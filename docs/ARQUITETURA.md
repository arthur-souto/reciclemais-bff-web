# Arquitetura — reciclemais-bff-web

> Estado do projeto: **esqueleto inicial**. Poucos arquivos, mas já revelam uma decisão arquitetural clara e intencional. Este documento descreve o que existe hoje, os padrões aplicados e pontos que merecem atenção conforme o projeto cresce.

## Visão geral

O projeto é o novo backend/BFF do recicleMais, reescrevendo o CRUD original com uma base "mais robusta". A base de código atual não tem nenhuma rota de negócio ainda — o que existe é a **casca de infraestrutura**: bootstrap da aplicação, servidor HTTP e logging, todos organizados segundo Arquitetura Hexagonal (Ports & Adapters).

```
src/
├── domain/
│   └── ports/                    # Interfaces (contratos) do domínio
│       ├── ApplicationRunnable.ts
│       └── Logger.ts
├── adapters/
│   ├── in/http/                  # Adapters de entrada (driving)
│   │   └── ExpressServerAdpater.ts
│   └── out/logging/               # Adapters de saída (driven)
│       └── PinoLogger.ts
├── infrastructure/
│   └── config/
│       └── Banner.ts              # Cross-cutting concern (startup banner)
└── index.ts                       # Composition root
```

## Padrão arquitetural: Ports & Adapters (Arquitetura Hexagonal)

A separação `domain/ports` vs `adapters/in` vs `adapters/out` é o núcleo hexagonal clássico:

- **`domain/ports`** define *o que* a aplicação precisa, sem dizer *como*. São interfaces puras, sem dependência de bibliotecas externas:
  - [`ApplicationRunnable`](../src/domain/ports/ApplicationRunnable.ts): contrato `run(port)` / `stop()` — qualquer coisa que possa subir e derrubar um servidor.
  - [`Logger`](../src/domain/ports/Logger.ts): contrato `info` / `error` — abstrai a biblioteca de log escolhida.

- **`adapters/in`** (driving adapters) — implementam a entrada de dados na aplicação. Hoje só há [`ExpressServerAdapter`](../src/adapters/in/http/ExpressServerAdpater.ts), que implementa `ApplicationRunnable` usando Express. Quando rotas HTTP forem adicionadas, elas nascerão aqui.

- **`adapters/out`** (driven adapters) — implementam dependências que a aplicação consome. Hoje só há [`PinoLogger`](../src/adapters/out/logging/PinoLogger.ts), que implementa `Logger` usando a biblioteca `pino`.

Essa estrutura já antecipa onde crescerá: quando surgir persistência (banco de dados), o adapter correspondente entrará em `adapters/out/persistence` (ou similar) implementando uma porta `domain/ports/*Repository`, sem que o domínio precise saber que banco é.

## Padrões de projeto observados

- **Dependency Inversion / Injection via construtor**: `ExpressServerAdapter` recebe `Logger` no construtor ([ExpressServerAdpater.ts:15](../src/adapters/in/http/ExpressServerAdpater.ts#L15)) em vez de instanciar `PinoLogger` diretamente. O adapter HTTP depende da abstração `Logger`, não da implementação concreta — isso é o que torna a troca de biblioteca de log (ou o uso de um mock em teste) trivial no futuro.
- **Composition Root**: [`index.ts`](../src/index.ts) é o único lugar onde implementações concretas (`PinoLogger`, `ExpressServerAdapter`) são instanciadas e conectadas às suas interfaces (`Logger`, `ApplicationRunnable`). Todo o resto do código enxerga apenas os `ports`. Não há um container de DI (tipo InversifyJS/tsyringe) — a composição é manual, o que é apropriado para o tamanho atual do projeto.
- **Programar contra interface, não implementação**: reforçado explicitamente pela tipagem em `index.ts` (`const logger: Logger = new PinoLogger()`), embora TypeScript não exija isso.
- **Graceful shutdown parcial**: `ApplicationRunnable.stop()` existe e fecha o servidor HTTP, mas nada em `index.ts` ainda escuta `SIGTERM`/`SIGINT` para chamá-lo — é um contrato pronto, mas ainda não conectado a um evento de processo.

## Stack tecnológica

| Categoria | Escolha | Observação |
|---|---|---|
| Runtime/linguagem | TypeScript ~7.0 (nightly/beta), NodeNext modules, target ESNext | Versão do TS é bem à frente (a estável é 5.x) — vale confirmar se é intencional. |
| HTTP | Express 5 | Major recente; API de error-handling mudou em relação ao Express 4 (ver observação abaixo). |
| Logging | Pino + pino-pretty (dev) | Log estruturado, adequado para produção. |
| CORS | pacote `cors` | Configurado sem opções — libera tudo por padrão. |
| Banner de inicialização | `figlet` | Cosmético, mas separado como "infrastructure/config", não como domínio. |
| Build | `tsc` puro | Sem bundler; `dist/` é o output publicado (`main: index.js`, `start: node dist/index.js`). |

`tsconfig.json` está com `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` — configuração rigorosa, bom sinal para evitar bugs de tipagem conforme o projeto cresce.

## Fluxo de inicialização

1. `index.ts` instancia `PinoLogger` e injeta em `ExpressServerAdapter`.
2. `app.run(3000)` sobe o Express na porta fixa 3000.
3. Ao concluir, `logBanner()` imprime um banner ASCII (figlet) + informações de startup, e também loga via `Logger.info`.

## Pontos interessantes / atenção

- **`.env` existe mas não é lido**: há um arquivo `.env` no projeto (corretamente no `.gitignore`), mas nenhum código carrega variáveis de ambiente (`dotenv` não está nas dependências). Porta (`3000`), versão (`"1.0.0"`) e nome da app estão hardcoded em `index.ts`. Isso é uma inconsistência a resolver antes de ir para produção/múltiplos ambientes.
- **`environment` é a única var de ambiente lida** (`process.env.NODE_ENV`), e mesmo assim sem tipagem/validação.
- **Sem testes**: `npm test` é um placeholder (`echo "Error: no test specified" && exit 1`). Como o domínio já está isolado via ports, o projeto está bem posicionado para testes unitários (mock de `Logger`) e de integração leves.
- **Erro de `app.listen` tratado incorretamente**: em [ExpressServerAdpater.ts:22-28](../src/adapters/in/http/ExpressServerAdpater.ts#L22-L28), o callback de `app.listen(port, (err) => ...)` — o Express 5 (assim como o `net.Server` do Node) **não passa um `err` para esse callback**; ele só é chamado em sucesso. Erros de bind (porta em uso, por exemplo) são emitidos pelo evento `'error'` do `Server`, não pelo callback. Ou seja, o bloco `if (err)` nunca vai disparar, e falhas de porta ocupada hoje passam silenciosamente sem log nem `process.exit`.
- **Nome de arquivo com typo**: `ExpressServerAdpater.ts` (faltando o "a" de "Adapter"). Pequeno, mas vale corrigir agora antes que mais imports dependam do nome.
- **`dist/` versionado fora do git mas presente no working tree**: há artefatos de build (`dist/*.js`, `.d.ts`) já gerados localmente, consistente com o `.gitignore` que os exclui — apenas confirmando que não há builds obsoletos sendo commitados.
- **CORS aberto (`cors()` sem opções)**: adequado para desenvolvimento; deve ganhar allowlist de origens antes de produção.

## Sugestões para evolução (não implementadas, apenas observações)

- Introduzir carregamento de configuração (`dotenv` + um `Config`/`Env` port) para eliminar os valores hardcoded.
- Conectar `ApplicationRunnable.stop()` a `SIGINT`/`SIGTERM` para shutdown gracioso.
- Corrigir a checagem de erro do `listen` usando o evento `'error'` do `Server`.
- Ao adicionar persistência ou regras de negócio, manter o padrão já estabelecido: interface em `domain/ports`, implementação em `adapters/out/<tecnologia>`.
