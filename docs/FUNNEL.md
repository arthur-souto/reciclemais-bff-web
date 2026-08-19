# Exposição pública via Tailscale Funnel

> Este documento cobre como o backend fica acessível pela internet pública (não só pela tailnet), e o que checar depois de um reboot do servidor.

## Por que existe

O servidor (ver [DEPLOY.md](./DEPLOY.md)) está atrás de CGNAT — sem IP público — então normalmente só é alcançável por dispositivos na tailnet Tailscale. O frontend (`reciclemais-up`) é hospedado na Vercel e roda no navegador de qualquer visitante, que **não** está na tailnet. Para o frontend conseguir chamar a API, o backend é publicado na internet com o [Tailscale Funnel](https://tailscale.com/kb/1223/funnel), sem precisar de IP público nem port forwarding no roteador.

URL pública resultante: **`https://archlinux.tail0406e5.ts.net`**, proxeando para `http://127.0.0.1:3000` (a porta da app, ver `docker-compose.prod.yml`).

## Setup atual

```bash
sudo tailscale funnel --bg 3000
```

O `--bg` é essencial: sem ele, o Funnel roda em modo *foreground*, atrelado à sessão de terminal que rodou o comando, e cai assim que essa sessão fecha. Com `--bg`, a config é persistida pelo `tailscaled` e volta sozinha quando o serviço reinicia (inclusive depois de reboot).

Esse comando precisa de senha de `sudo` com TTY real — não funciona rodado por automação/agentes sem uma sessão de terminal interativa de verdade.

## O que sobe sozinho depois de um reboot

Duas peças independentes, ambas já configuradas para iniciar com o sistema:

| Peça | Mecanismo | Config |
| --- | --- | --- |
| App na porta 3000 | `docker.service` habilitado no boot + container `reciclemais-app` com `restart: unless-stopped` | `docker-compose.prod.yml` |
| Proxy público do Funnel | `tailscaled.service` habilitado no boot, lê a config persistida do Funnel (`--bg`) | estado interno do `tailscaled` |

Nenhuma das duas depende de rodar comandos manualmente depois do boot — mas isso ainda não foi validado com um reboot real da máquina (só inferido a partir de `systemctl is-enabled tailscaled` → `enabled`, `restart: unless-stopped` no compose, e a documentação do Tailscale sobre modo `--bg`).

## Como checar se está tudo certo

```bash
tailscale status                                          # tailnet conectada?
docker compose -f docker-compose.prod.yml ps              # app rodando?
tailscale funnel status                                   # funnel ligado?
curl -s -o /dev/null -w "%{http_code}\n" https://archlinux.tail0406e5.ts.net/docs   # end-to-end
```

O último comando deve retornar `301` (redirect de `/docs` para `/docs/`) — é o comportamento normal do Swagger UI, não um erro.

## Troubleshooting

Se o `curl` final falhar, siga a ordem dos comandos acima para isolar onde está o problema:

- **`tailscale status` não mostra o node como conectado**: `tailscaled` subiu mas não logou na tailnet. Rodar `sudo tailscale up`.
- **App não aparece no `docker compose ps` (ou não está `healthy`)**: seguir o troubleshooting normal de container, ver [DEPLOY.md](./DEPLOY.md).
- **`tailscale funnel status` não mostra nada ligado**: o Funnel foi resetado ou rodado sem `--bg` em algum momento. Rodar de novo, em um terminal real (SSH ou local nessa máquina, não via automação):

  ```bash
  sudo tailscale funnel --bg 3000
  ```

## Como desativar

```bash
tailscale funnel --https=443 off
```
