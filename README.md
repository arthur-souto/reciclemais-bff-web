# reciclemais-bff-web

Este repositório é a nova base do backend/BFF do projeto recicleMais: reescreve o CRUD original do repositório principal com uma estrutura mais robusta (Arquitetura Hexagonal / Ports & Adapters) e funcionalidades adicionais.

## Proposta

O backend cobre hoje o fluxo completo de cadastro e autenticação de usuários, cadastro de materiais recicláveis, registro de entregas ("deliveries"), validação de evidências de reciclagem por IA (Groq) com pontuação automática, e um catálogo de prêmios resgatáveis por pontos — com controle de concorrência para evitar resgates duplicados ou estoque negativo. Veja o detalhamento completo em [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Como iniciar o projeto

### Pré-requisitos

- Node.js 22+
- Docker e Docker Compose (para subir o banco de dados)

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores conforme necessário:

```bash
cp .env.example .env
```

| Variável               | Descrição                                                                 | Exemplo/Padrão                                            |
| ---------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `PORT`                 | Porta em que a aplicação HTTP sobe                                        | `3000`                                                      |
| `GROQ_API_KEY`         | Chave de API da Groq, usada na análise de evidências por IA               | *(obrigatória, obtenha em https://console.groq.com)*        |
| `GROQ_MODEL`           | Modelo Groq usado para texto                                               | `qwen/qwen3.6-27b`                                          |
| `GROQ_VISION_MODEL`    | Modelo Groq usado para análise de imagens                                 | `qwen/qwen3.6-27b`                                          |
| `POSTGRES_DB`          | Nome do banco criado pelo container do Postgres                           | `recicle_db`                                                |
| `POSTGRES_USER`        | Usuário do Postgres                                                       | `dev`                                                       |
| `POSTGRES_PASSWORD`    | Senha do Postgres                                                         | `dev`                                                       |
| `DATABASE_URL`         | String de conexão usada pela aplicação e pelo drizzle-kit                 | `postgresql://dev:dev@localhost:5432/recicle_db`            |
| `JWT_PRIVATE_KEY`      | Chave privada RSA (PEM) usada para assinar os tokens JWT (RS256)          | *(obrigatória, veja como gerar abaixo)*                     |
| `JWT_PUBLIC_KEY`       | Chave pública RSA (PEM) usada para validar os tokens JWT (RS256)          | *(obrigatória, veja como gerar abaixo)*                     |
| `JWT_EXPIRES_IN`       | Tempo de expiração do token JWT                                           | `1d`                                                         |
| `R2_ENDPOINT`          | Endpoint S3-compatível do bucket Cloudflare R2 usado para upload de imagens | *(obrigatória, obtenha no painel da Cloudflare)*           |
| `R2_ACCESS_KEY_ID`     | Access key do bucket R2                                                   | *(obrigatória)*                                              |
| `R2_SECRET_ACCESS_KEY` | Secret key do bucket R2                                                   | *(obrigatória)*                                              |
| `R2_BUCKET_NAME`       | Nome do bucket R2                                                         | *(obrigatória)*                                              |
| `R2_PUBLIC_URL`        | URL pública usada para montar o link das imagens enviadas                 | *(obrigatória)*                                              |

> `GROQ_API_KEY`, `JWT_PRIVATE_KEY`/`JWT_PUBLIC_KEY` e as credenciais `R2_*` são segredos — nunca faça commit deles. O arquivo `.env` já está no `.gitignore`.

#### Gerando o par de chaves do JWT

A autenticação usa JWT assinado com RS256 (chave privada assina, chave pública valida). Gere o par com OpenSSL:

```bash
mkdir -p keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

A pasta `keys/` já está no `.gitignore` — as chaves nunca devem ser commitadas. Depois, copie o conteúdo de cada arquivo `.pem` para as variáveis no `.env`, substituindo as quebras de linha por `\n` (o código faz o `unescape` automaticamente em `src/index.ts`):

```bash
JWT_PRIVATE_KEY=$(awk '{printf "%s\\n", $0}' keys/private.pem)
JWT_PUBLIC_KEY=$(awk '{printf "%s\\n", $0}' keys/public.pem)
```

Ou, manualmente, cole o conteúdo do `.pem` entre aspas no `.env`, uma linha só, com `\n` no lugar das quebras de linha reais:

```
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIj...\n-----END PUBLIC KEY-----\n"
```

Use um par de chaves diferente por ambiente (dev, staging, produção).

### Subindo o banco de dados com Docker

```bash
docker compose up -d
```

Isso sobe um Postgres 16 na porta `5432`, usando as credenciais definidas em `docker-compose.yml` (`recicle_db` / `dev` / `dev`). Os dados persistem no volume `k_dev-data`.

Se preferir usar um Postgres já instalado localmente em vez do container, apenas ajuste `DATABASE_URL` no `.env` para apontar para essa instância — o restante do fluxo (migrations, aplicação) funciona da mesma forma.

### Instalando dependências e rodando as migrations

```bash
npm install
npm run db:migrate
```

`db:generate` (drizzle-kit generate) só é necessário ao criar/alterar schemas em `src/infrastructure/database/schema`.

### Rodando a aplicação

Em desenvolvimento:

```bash
npx tsx src/index.ts
```

Em produção (build + start):

```bash
npm run build
npm start
```

A aplicação sobe em `http://localhost:<PORT>`.

### Documentação da API (`/docs`)

Com a aplicação rodando, a documentação interativa da API (Swagger UI, gerada a partir das anotações OpenAPI presentes nos arquivos de rota em `src/adapters/in/http/route/`) fica disponível em:

```
http://localhost:<PORT>/docs
```

Lá dá pra ver todos os endpoints, seus parâmetros/body esperados e testar chamadas direto pelo navegador ("Try it out"). Endpoints protegidos aparecem com um ícone de cadeado — para testá-los:

1. Crie um usuário em `POST /users` (ou use um já existente).
2. Faça login em `POST /auth/login` e copie o valor de `accessToken` da resposta.
3. Clique no botão **Authorize** (canto superior direito da página) e cole o token — sem o prefixo `Bearer`, o Swagger adiciona isso automaticamente.
4. A partir daí, toda chamada feita pela UI para rotas protegidas já vai com o header `Authorization` preenchido.

### Rodando os testes

```bash
npm test              # roda a suíte uma vez (Vitest)
npm run test:watch    # modo watch
npm run test:coverage # com relatório de cobertura
```

Os testes ficam em `src/__tests__/` e cobrem controllers e rotas (Vitest + Supertest), com fakes para logger e serviço de token — não dependem do Postgres/R2/Groq reais.

## Documentação

📐 [Arquitetura do projeto](docs/ARQUITETURA.md) — domínio, casos de uso, fluxo de análise de evidência por IA, controle de concorrência no resgate de prêmios e stack completa.

### Feature 1: Inteligência de Valor para o Novo Backend

A imagem abaixo representa a primeira feature de valor deste repositório: a evolução da solução inicial para um backend/BFF mais inteligente, preparado para suportar cadastros, consultas e gestão de dados com maior escalabilidade e abertura para novas funcionalidades.

![Imagem inicial da proposta](docs/ia-feature.drawio.png)
