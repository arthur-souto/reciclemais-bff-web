# Arquitetura — reciclemais-bff-web

> Estado do projeto: já não é mais um esqueleto — há domínio, casos de uso, persistência via Drizzle/Postgres, autenticação JWT, upload de imagens (Cloudflare R2) e análise de evidências por IA (Groq). A base segue Arquitetura Hexagonal (Ports & Adapters) de forma consistente em todos os módulos.

## Visão geral

O projeto é o backend/BFF do recicleMais: cadastro e gestão de usuários, materiais recicláveis, entregas ("deliveries") de material com validação de evidência por IA, pontuação e resgate de prêmios. Tudo organizado segundo Ports & Adapters, com um composition root único ([`src/index.ts`](../src/index.ts)) que instancia e conecta todas as peças.

```
src/
├── domain/
│   ├── models/                    # Entidades de domínio (classes com getters/setters)
│   │   ├── user.ts, material.ts, delivery.ts, prize.ts, prizeRedemption.ts
│   ├── ports/                     # Interfaces (contratos)
│   │   ├── AiPort.ts, ApplicationRunnablePort.ts, LoggerPort.ts
│   │   ├── PasswordHasherPort.ts, StoragePort.ts, TransactionManagerPort.ts
│   │   └── repository/            # *RepositoryPort.ts (um por agregado)
│   ├── TokenServicePort.ts
│   ├── dto/Pagination.ts
│   └── errors/AppError.ts
├── application/                   # Casos de uso (orquestram domínio + ports)
│   ├── AuthUseCases.ts, UserUseCase.ts, MaterialUseCase.ts
│   ├── DeliveryUseCase.ts, PrizeUseCase.ts, PrizeRedemptionUseCase.ts
│   ├── EvidenceUseCases.ts, UploadImageUseCase.ts
│   └── service/ScoreService.ts
├── adapters/
│   ├── in/http/                   # Adapters de entrada (driving)
│   │   ├── controller/            # Um controller por recurso
│   │   ├── route/                 # Definição de rotas Express + OpenAPI (JSDoc)
│   │   ├── middleware/            # auth, requireRole, validate, errorHandler
│   │   ├── utils/pagination.ts
│   │   └── ExpressServerAdpater.ts
│   ├── out/                       # Adapters de saída (driven)
│   │   ├── ai/GroqServiceAdpater.ts
│   │   ├── database/DrizzleTransactionManager.ts
│   │   ├── logging/PinoLoggerAdpater.ts
│   │   ├── mapper/                # domínio <-> DTO de resposta
│   │   ├── repositories/          # Drizzle*Repository.ts (implementam os ports)
│   │   └── security/              # Argon2PasswordHasher, JwtTokenService
│   └── request/                   # DTOs de entrada (class-validator)
├── infrastructure/
│   ├── adapters/storage/R2StorageAdpater.ts   # implementa ImageStoragePort (Cloudflare R2)
│   ├── config/Banner.ts, Swagger.ts
│   └── database/client.ts, schema/*.ts        # Drizzle ORM
├── utils/                         # GenerateBufferByImage.ts, ScapeLike.ts
├── validators/CpfValidator.ts     # decorator @IsCPF para class-validator
└── index.ts                       # Composition root
```

## Padrão arquitetural: Ports & Adapters (Arquitetura Hexagonal)

- **`domain/ports`** define *o que* a aplicação precisa, sem dizer *como*:
  - [`LoggerPort`](../src/domain/ports/LoggerPort.ts) — abstrai a lib de log.
  - [`ApplicationRunnablePort`](../src/domain/ports/ApplicationRunnablePort.ts) — contrato `run(port)`/`stop()`.
  - [`PasswordHasherPort`](../src/domain/ports/PasswordHasherPort.ts) — `hash`/`compare`.
  - [`TokenServicePort`](../src/domain/TokenServicePort.ts) — `sign`/`verify` de JWT.
  - [`AiPort`](../src/domain/ports/AiPort.ts) (`AiCompletionService`) — `prompt`/`analyze` (texto e imagem).
  - [`StoragePort`](../src/domain/ports/StoragePort.ts) (`ImageStoragePort`) — `upload` de arquivo.
  - [`TransactionManagerPort`](../src/domain/ports/TransactionManagerPort.ts) — `run(work)` executando `work` dentro de uma transação de banco.
  - `domain/ports/repository/*` — um port por agregado (`UserRepositoryPort`, `MaterialRepositoryPort`, `DeliveryRepositoryPort`, `PrizeRepositoryPort`, `PrizeRedemptionRepositoryPort`), cada um só com os métodos que os casos de uso realmente precisam (não é CRUD genérico — por exemplo `decrementScoreIfEnough`, `incrementScore`, `decrementQuantity` são operações atômicas específicas do domínio, não um `update` genérico).

- **`adapters/in/http`** (driving) — controllers recebem `Request`/`Response`, delegam para os casos de uso e traduzem `AppError` em respostas HTTP (via `errorHandler`). Rotas ficam em `route/*.ts`, cada uma com anotações OpenAPI em JSDoc consumidas pelo Swagger.

- **`adapters/out`** (driven) — implementações concretas dos ports: `GroqServiceAdpater` (IA), `Drizzle*Repository` (persistência), `PinoLoggerAdpater` (log), `Argon2PasswordHasher`/`JwtTokenService` (segurança), `DrizzleTransactionManager` (transação).

- **`infrastructure`** — configuração e tecnologia pura sem regra de negócio: conexão com Postgres (`database/client.ts`), schemas Drizzle, Swagger, banner de startup e o adapter de storage `R2StorageAdapter` (implementa `ImageStoragePort` usando S3-compatible API da Cloudflare R2).

Essa separação já se provou na prática: quando um caso de uso precisa de storage, IA ou transação, ele depende só da interface (`ImageStoragePort`, `AiCompletionService`, `TransactionManagerPort`), nunca da lib concreta — trocar Groq por outro provedor, ou R2 por S3, é troca de adapter, sem tocar em `application/` nem `domain/`.

## Domínio

| Entidade | Descrição | Campos-chave |
|---|---|---|
| `User` | Usuário do sistema | `id` (uuid), `email`, `cpf`, `password` (hash), `role` (`USER`\|`ADMIN`\|`ASSOCIATE`), `total_score` |
| `Material` | Tipo de material reciclável cadastrado | `name`, `importance` (`EImportance`, 1–60), `points_value`, `fk_user` (quem cadastrou) |
| `Delivery` | Entrega de material feita por um usuário | `status` (`PENDING`\|`COMPLETED`\|`CANCELED`), `material_type` (nome livre, validado contra `fk_material`), `quantity`, `weight`, `total_score`, `evidence_url`, `fk_user`, `fk_material`, `fk_approved_by` |
| `Prize` | Prêmio resgatável com pontos | `required_points`, `quantity` (nulo = ilimitado), `status` (`ACTIVE`\|`INACTIVE`), `type` (`PHYSICAL`\|`DIGITAL`\|`DISCOUNT`), `expiration_date` |
| `PrizeRedemption` | Registro de resgate | `fk_prize`, `fk_user`, `redeemed_at` — único por `(fk_user, fk_prize)` (constraint `uq_user_prize`) |

`EImportance` mapeia para uma pontuação base (`BasePointsValue`, de 5 a 300 pontos) usada como referência ao cadastrar materiais.

## Casos de uso e fluxos principais

### Autenticação e usuários
- `AuthUseCases.sign` — valida credenciais (`Argon2PasswordHasher.compare`) e emite um JWT via `JwtTokenService` (payload com `sub`, `email`, `role`, `iss`, `aud`).
- `UserUseCase` — CRUD de usuário; hash de senha no `createUser`; valida formato de UUID nos IDs antes de tocar o repositório.

### Materiais e entregas
- `MaterialUseCase` — CRUD de material, incluindo busca por nome (`findByTarget`, usa `escapeLike` para sanitizar `LIKE`).
- `DeliveryUseCase.create`/`update` chamam `ensureMaterialExists`, que garante que `fk_material` existe **e** que `material.getName()` bate com o `material_type` enviado — evita entregas com material_type e fk_material inconsistentes entre si.

### Análise de evidência e pontuação (`EvidenceUseCases` + `ScoreService`)
Fluxo de `POST /evidence/:id`:
1. `ScoreService.getEntitiesForAction` busca a `Delivery` (com o `Material` relacionado) e o `User`; falha com 404/400 se algo não existir.
2. `EvidenceUseCases.analyzeEvidence` chama `AiCompletionService.analyze` (Groq, modelo de visão) com um prompt fixo que instrui o modelo a validar se a imagem realmente mostra reciclagem (incluindo heurísticas contra prompt injection embutido na imagem e contra fotos de banco de imagens) e retornar `{validado, motivo, qualidade}` em JSON.
3. A pontuação final é `round(points_value_do_material * qualidade * quantity)` — só é calculada se `validado === true`; caso contrário o score é 0 e a entrega não é completada.
4. Se válido e a entrega ainda está `PENDING`, `ScoreService.execute` roda dentro de `TransactionManagerPort.run`: faz upload da imagem de evidência (`ImageStoragePort.upload`), marca a entrega como `COMPLETED`, seta `total_score`/`evidence_url` e incrementa o score do usuário (`incrementScore`) — tudo atômico: se o upload ou o update falhar, a transação de banco desfaz o incremento de score.

`GroqServiceAdpater` tem tratamento de erro dedicado para `Groq.APIError` (loga `status`/`code`/`message` separadamente) vs. erro genérico, e sempre relança um `Error` de domínio (nunca vaza a exceção da SDK para cima).

### Resgate de prêmios — concorrência segura (`PrizeRedemptionUseCase`)
Esse é o fluxo com maior atenção a corrida de dados. `redeem(prizeId, userId)`:
1. Validações não-transacionais primeiro (fail-fast, sem tocar o banco em transação): prêmio existe, está `ACTIVE`, não expirou; usuário existe e tem pontos suficientes; usuário ainda não resgatou esse prêmio (`existsByUserAndPrize`).
2. As operações que efetivamente mudam estado compartilhado rodam dentro de `TransactionManagerPort.run` (Drizzle `db.transaction`):
   - Se o prêmio é `PHYSICAL`, `PrizeRepositoryPort.decrementQuantity` executa um `UPDATE prizes SET quantity = quantity - 1 WHERE id = :id AND quantity >= 1 RETURNING *`. A condição `WHERE quantity >= N` no mesmo `UPDATE` é o que garante atomicidade: o Postgres só devolve uma linha se ainda havia estoque no momento exato do update, então duas requisições concorrentes para o último item nunca conseguem decrementar as duas — a segunda simplesmente não afeta nenhuma linha (`decrementQuantity` retorna `false`) e o caso de uso lança `AppError("Prêmio esgotado")`.
   - Em seguida, `UserRepositoryPort.decrementScoreIfEnough` faz o mesmo padrão de "UPDATE condicional atômico": `UPDATE users SET total_score = total_score - :score WHERE id = :id AND total_score >= :score`. Isso evita o clássico bug de "check-then-act" (ler o score, checar em JS, depois atualizar) — a checagem e a escrita são a mesma instrução SQL, então não há janela de corrida entre duas requisições simultâneas do mesmo usuário.
   - Só depois desses dois updates condicionais terem sucesso é que o `PrizeRedemptionRepositoryPort.create` insere a linha de resgate. Se qualquer passo falhar, a transação inteira é revertida (nenhum estoque/score fica decrementado "no vácuo").
   - A constraint `unique("uq_user_prize")` no schema é uma segunda camada de proteção contra duplicidade, independente da checagem em aplicação (`existsByUserAndPrize`) — cobre a corrida entre a checagem e o insert.

Esse padrão ("UPDATE ... WHERE <condição de suficiência> RETURNING") é o mecanismo central de controle de concorrência do projeto: **não usa** locks explícitos (`SELECT ... FOR UPDATE`) nem controle otimista por versão — depende da atomicidade nativa do `UPDATE` do Postgres para transformar um "read-check-write" em uma única operação indivisível.

### Upload de imagens
- `UploadImageUseCase.execute` valida MIME type (`image/jpeg`, `image/png`, `image/webp`) e tamanho (máx. 5MB) antes de delegar para `ImageStoragePort.upload`.
- `R2StorageAdapter` sobe o arquivo para um bucket Cloudflare R2 via SDK S3 (`@aws-sdk/client-s3`, `forcePathStyle: true`), gerando a key como `uploads/<timestamp>-<nome-sem-espaços>` e retornando a URL pública montada a partir de `R2_PUBLIC_URL`.
- `GenerateBufferByImage` (usado no fluxo de evidência) redimensiona a imagem com `sharp` (máx. 5760px) e a converte para data URL base64 antes de mandar pro Groq — o modelo de visão recebe a imagem embutida, não uma URL pública.

## HTTP: rotas, autenticação e validação

Registro central em [`route/index.ts`](../src/adapters/in/http/route/index.ts). Rotas por recurso:

| Recurso | Rotas | Auth | Observação |
|---|---|---|---|
| Auth | `POST /auth/login` | pública | valida body com `LoginDto` |
| Users | `POST /users` (pública) · `GET /users/:id`, `GET /users/email/:email`, `PATCH /users/:id`, `DELETE /users/:id` (autenticadas) | JWT | |
| Materials | `GET /materials`, `GET /materials/search`, `GET /materials/:id` (autenticadas) · `POST /materials`, `PATCH /materials/:id`, `DELETE /materials/:id` (autenticadas + `ADMIN`) | JWT (+role) | |
| Deliveries | `POST /deliveries`, `GET /deliveries`, `GET /deliveries/:id`, `PATCH /deliveries/:id`, `DELETE /deliveries/:id` | JWT | todas autenticadas |
| Evidence | `POST /evidence/:id` (multipart, campo `evidence`) | JWT | dispara análise de IA + pontuação |
| Prizes | `GET /prizes`, `GET /prizes/:id`, `GET /prizes/redemptions/me` (autenticadas) · `POST /prizes`, `PATCH /prizes/:id`, `DELETE /prizes/:id`, `GET /prizes/:id/redemptions` (autenticadas + `ADMIN`/`ASSOCIATE`) · `POST /prizes/:id/redeem` (autenticada, qualquer role) | JWT (+role) | |
| Upload | `POST /upload` (multipart, campo `image`) | JWT | upload avulso de imagem |

Middlewares de entrada:
- **`authMiddleware(tokens)`** — exige header `Authorization: Bearer <token>`, valida via `TokenServicePort.verify`, popula `req.user` com o payload do JWT.
- **`requireRole(roles[])`** — checa `req.user.role` contra uma allowlist; usado depois de `authMiddleware`.
- **`validate(DtoClass)`** — usa `class-transformer` (`plainToInstance`) + `class-validator` (`validate`) para validar o body contra o DTO; em erro, responde `400` com a lista de campos/mensagens antes mesmo de chegar no controller.
- **`errorHandler(logger)`** — middleware de erro global do Express. Diferencia `AppError` (erro de domínio, com `statusCode` próprio) de erros de infraestrutura do próprio Express/multer (que trazem `statusCode`/`status` na convenção `http-errors` — ex.: JSON malformado, arquivo grande demais) de erros verdadeiramente inesperados (loga como 500 genérico, sem vazar detalhe interno na resposta).

Validação de DTOs usa `class-validator`/`class-transformer` (ex.: `CreateDeliveryDto`, `CreateMaterialDto`), incluindo um validador customizado (`@IsCPF`, [`CpfValidator.ts`](../src/validators/CpfValidator.ts)) que calcula os dígitos verificadores do CPF.

Paginação é padronizada via [`utils/pagination.ts`](../src/adapters/in/http/utils/pagination.ts): `parsePagination` lê `page`/`limit` da query string (padrão 1/10, limite máximo 100) e `paginatedPayload` formata a resposta com `{ payload, meta: { total, page, limit, totalPages } }`.

## Persistência (Drizzle ORM + Postgres)

Schemas em `src/infrastructure/database/schema/*.ts`, um arquivo por tabela: `users`, `materials`, `deliveries`, `prizes`, `prize_redemptions`. Pontos relevantes:
- `users.role` e `deliveries.status`/`prizes.status`/`prizes.type` são `pgEnum` — os valores são impostos pelo próprio Postgres, não só pela aplicação.
- `prize_redemptions` tem `unique("uq_user_prize").on(fk_user, fk_prize)` — impede duplicidade no nível do banco (ver seção de concorrência acima).
- Todas as FKs (`fk_user`, `fk_material`, `fk_prize`, `fk_approved_by`, `fk_created_by`) usam `uuid`/`integer` com `.references()`.
- `repositories/DrizzleErrors.ts` centraliza a detecção de violação de FK (`code === "23503"`) para os repositórios converterem em mensagens de domínio em vez de vazar o erro cru do `pg`.
- `db` é uma instância única do Drizzle (`drizzle-orm/node-postgres`) sobre um `pg.Pool`, exportada de `infrastructure/database/client.ts`; repositórios que participam de transação recebem `tx?: unknown` e usam `(tx as DbClient) ?? db` como executor — assim o mesmo método de repositório funciona dentro ou fora de uma transação.

## Autenticação e autorização

- Senhas com **Argon2** (`Argon2PasswordHasher`, lib `argon2` — `bcrypt` está nas dependências mas não é usado nos adapters atuais).
- Tokens **JWT** (`JwtTokenService`, lib `jsonwebtoken`), assinados com RS256 via par de chaves assimétricas (`JWT_PRIVATE_KEY` assina, `JWT_PUBLIC_KEY` valida) e `JWT_EXPIRES_IN`; payload inclui `role`, usado por `requireRole` para autorização por papel (`USER`, `ADMIN`, `ASSOCIATE`). Veja no [README](../README.md#gerando-o-par-de-chaves-do-jwt) como gerar o par de chaves.

## Documentação da API

Swagger/OpenAPI 3.0 gerado via `swagger-jsdoc` a partir de comentários JSDoc nos arquivos de rota (`infrastructure/config/Swagger.ts` aponta para `route/*.ts`), servido em `/docs` (`swagger-ui-express`). Autenticação no Swagger UI usa `bearerAuth` (colar só o token, sem `Bearer`).

## Composition root e ciclo de vida

`src/index.ts` é o único lugar que instancia implementações concretas e as injeta via construtor: `PinoLogger`, `Argon2PasswordHasher`, `JwtTokenService`, `GroqServiceAdpater`, os `Drizzle*Repository`, `DrizzleTransactionManager`, `R2StorageAdapter`, todos os `*UseCase`/`*UseCases` e `ScoreService`, e por fim os controllers passados para `ExpressServerAdapter`. Não há container de DI — a composição é manual, adequada ao tamanho atual.

Ciclo de vida:
1. `app.run(PORT)` sobe o Express (`ExpressServerAdapter`), registra CORS aberto, `express.json`/`urlencoded`, docs em `/docs`, rotas e por último o `errorHandler`.
2. `logBanner` imprime o banner ASCII de start (nome, versão, porta, ambiente).
3. **Graceful shutdown**: `SIGINT`/`SIGTERM` chamam `shutdown()`, que fecha o pool do Postgres (`poll.end()`) e para o servidor HTTP (`app.stop()`) antes de `process.exit(0)` — diferente da versão anterior deste documento, isso já está conectado (não é mais um contrato "solto").

## Testes

Stack: **Vitest** + **Supertest**. `src/__tests__/` tem duas camadas:
- `controller/*.test.ts` — testam os controllers isoladamente (use cases/loggers fake).
- `routes/*.test.ts` — testam o Express app montado de ponta a ponta (`helpers/testApp.ts` monta um app de teste; `helpers/fakeLogger.ts` e `helpers/fakeTokenService.ts` são fakes para isolar dependências externas).

Cobrem: auth, delivery, evidence, material, user (rotas) e todos os controllers listados acima (incluindo prize). Rodar com `npm test` (ou `npm run test:watch` / `npm run test:coverage`).

## Stack tecnológica

| Categoria | Escolha | Observação |
|---|---|---|
| Runtime/linguagem | TypeScript ~7.0, NodeNext modules, target ESNext, `strict: true` | Configuração rigorosa (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). |
| HTTP | Express 5 | |
| Validação | `class-validator` + `class-transformer` | DTOs em `adapters/request/`. |
| ORM | Drizzle ORM (`drizzle-orm`) sobre `pg` | Migrations via `drizzle-kit`. |
| Autenticação | `jsonwebtoken` + `argon2` | |
| IA | `groq-sdk` | Análise de texto e visão computacional (evidências de reciclagem). |
| Storage de imagens | `@aws-sdk/client-s3` apontando para Cloudflare R2 | |
| Upload multipart | `multer` (memory storage) | |
| Processamento de imagem | `sharp` | Redimensionamento antes de enviar à IA. |
| Logging | Pino + pino-pretty (dev) | |
| Documentação | `swagger-jsdoc` + `swagger-ui-express` | Servido em `/docs`. |
| Testes | Vitest + Supertest | |
| CORS | pacote `cors`, sem opções | Libera tudo por padrão — ok em dev, precisa de allowlist em produção. |
| Build | `tsc` puro, sem bundler | `dist/` é o output publicado. |

## Pontos de atenção conhecidos

- **CORS aberto** (`cors()` sem opções): adequado para desenvolvimento, deve ganhar allowlist de origens antes de produção.
- **`bcrypt` não utilizado**: está nas dependências mas o hasher em uso é `Argon2PasswordHasher`; pode ser removido se não houver planos de uso.
- **`db` configurado com `logger: true`**: loga toda query SQL executada — útil em dev, vale revisar/desligar em produção por volume de log.
- **Sem `SELECT ... FOR UPDATE` explícito**: a estratégia de concorrência (ver seção de resgate de prêmios) depende inteiramente do padrão `UPDATE ... WHERE <condição> RETURNING` ser usado corretamente em qualquer novo decremento de recurso compartilhado; um novo fluxo que "leia depois escreva" sem seguir esse padrão reintroduziria a corrida.

## Sugestões para evolução

- Adicionar teste de concorrência (ex.: disparar `redeem` duas vezes em paralelo para o último item de um prêmio `PHYSICAL`) para documentar em código a garantia descrita acima.
- Restringir CORS por ambiente antes de produção.
- Avaliar remover a dependência `bcrypt` não utilizada.
- Ao adicionar novos agregados, manter o padrão já estabelecido: modelo em `domain/models`, port em `domain/ports` (ou `domain/ports/repository`), implementação em `adapters/out/<tecnologia>`, DTO de entrada em `adapters/request`, mapper em `adapters/out/mapper`.
