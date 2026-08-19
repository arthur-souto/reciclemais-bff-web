# Deploy — reciclemais-bff-web

> Este documento cobre como a aplicação roda fora do ambiente de desenvolvimento: os arquivos docker compose, o servidor onde ela está hospedada hoje e o fluxo de atualização.

## Arquivos docker compose

O projeto tem dois arquivos de compose, cada um para um propósito diferente — não existe mais um `docker-compose.yml` genérico, sempre use `-f`.

| Arquivo | Contém | Uso |
| --- | --- | --- |
| `docker-compose.dev-local.yml` | Só o Postgres | Desenvolvimento local: sobe o banco em container e roda a aplicação direto na máquina (`npx tsx src/index.ts`), como descrito no [README](../README.md) |
| `docker-compose.prod.yml` | Aplicação (build via [`Dockerfile`](../Dockerfile)) + Postgres | Deploy real — app containerizada, `NODE_ENV=production`, migrations aplicadas automaticamente no start (`CMD` do Dockerfile roda `npm run db:migrate && npm start`) |

```bash
# desenvolvimento
docker compose -f docker-compose.dev-local.yml up -d

# produção
docker compose -f docker-compose.prod.yml up -d --build
```

Ambos os serviços em `docker-compose.prod.yml` têm `restart: unless-stopped` e healthcheck configurado.

### Desenvolvimento local — passo a passo

`docker-compose.dev-local.yml` sobe **só o Postgres**. A aplicação em si roda direto na máquina (fora de container):

```bash
docker compose -f docker-compose.dev-local.yml up -d   # sobe o banco
npm install
npm run db:migrate                                     # aplica as migrations
npx tsx src/index.ts                                    # roda a aplicação
```

Para parar o banco: `docker compose -f docker-compose.dev-local.yml down` (adicione `-v` se quiser apagar o volume `k_dev-data` e recomeçar do zero).

## Servidor atual

Hoje a aplicação está hospedada em um computador pessoal (Arch Linux) usado como servidor doméstico, não em nuvem.

- **Rede local**: IP fixo `192.168.1.250`, configurado via NetworkManager (`nmcli`) diretamente na máquina — o roteador (ZTE F6600P, comodato de operadora) não expõe reserva de DHCP no painel do usuário.
- **Acesso externo**: a conexão da operadora está atrás de CGNAT (sem IP público), então não é possível expor a aplicação via port forwarding direto no roteador. O acesso remoto é feito via [Tailscale](https://tailscale.com), que não depende de IP público.
- **Boot**: Docker (`docker.service`) e Tailscale (`tailscaled.service`) estão habilitados para iniciar com o sistema, e a conexão de rede tem autoconnect ativado — depois de um reboot, os containers com `restart: unless-stopped` voltam sozinhos, sem precisar rodar o compose manualmente.

Para checar se tudo subiu certo depois de um reboot:

```bash
docker compose -f docker-compose.prod.yml ps
tailscale status
```

## Fluxo de atualização (deploy de uma mudança)

O desenvolvimento continua normal em outra máquina. Para levar uma alteração até o servidor:

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

- O `--build` é obrigatório — sem ele o Compose reaproveita a imagem antiga e ignora o código novo.
- As migrations rodam automaticamente no start do container da app; o Postgres não é afetado se nada mudou nele.

### Atenção: variáveis de ambiente

O `.env` está no `.gitignore` e por isso **nunca é atualizado pelo `git pull`**. Se uma alteração no outro computador adicionar uma variável nova (visível em `.env.example`), ela precisa ser replicada manualmente no `.env` deste servidor antes do próximo `up --build` — senão a aplicação pode subir faltando alguma env var obrigatória.
