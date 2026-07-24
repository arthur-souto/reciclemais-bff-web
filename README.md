# reciclemais-bff-web

Este repositório representa a nova base do backend/BFF do projeto recicleMais. A ideia inicial é reescrever a implementação original do CRUD presente no repositório principal com uma estrutura mais robusta e com funcionalidades adicionais.

## Proposta inicial

O projeto tem como objetivo evoluir a solução inicial do recicleMais, mantendo o foco em facilitar o fluxo de cadastro, consulta e manipulação de dados, mas com uma arquitetura mais organizada para expansão futura.

## Como iniciar o projeto

### Pré-requisitos

- Node.js 22+
- Docker e Docker Compose (para subir o banco de dados)

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores conforme necessário:

```bash
cp .env.example .env
```

| Variável            | Descrição                                                              | Exemplo/Padrão                                            |
| ------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `PORT`              | Porta em que a aplicação HTTP sobe                                     | `3000`                                                      |
| `GROQ_API_KEY`      | Chave de API da Groq, usada na análise de evidências por IA             | *(obrigatória, obtenha em https://console.groq.com)*        |
| `GROQ_MODEL`        | Modelo Groq usado para texto                                            | `qwen/qwen3.6-27b`                                          |
| `GROQ_VISION_MODEL` | Modelo Groq usado para análise de imagens                               | `qwen/qwen3.6-27b`                                          |
| `POSTGRES_DB`       | Nome do banco criado pelo container do Postgres                        | `recicle_db`                                                |
| `POSTGRES_USER`     | Usuário do Postgres                                                     | `dev`                                                       |
| `POSTGRES_PASSWORD` | Senha do Postgres                                                       | `dev`                                                       |
| `DATABASE_URL`      | String de conexão usada pela aplicação e pelo drizzle-kit               | `postgresql://dev:dev@localhost:5432/recicle_db`            |

> `GROQ_API_KEY` é sua chave pessoal — nunca faça commit dela. O arquivo `.env` já está no `.gitignore`.

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

## Documentação

📐 [Arquitetura do projeto](docs/ARQUITETURA.md)

### Feature 1: Inteligência de Valor para o Novo Backend

A imagem abaixo representa a primeira feature de valor deste repositório: a evolução da solução inicial para um backend/BFF mais inteligente, preparado para suportar cadastros, consultas e gestão de dados com maior escalabilidade e abertura para novas funcionalidades.

![Imagem inicial da proposta](docs/ia-feature.drawio.png)
