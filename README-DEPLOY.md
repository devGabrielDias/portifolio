# Deploy do Portfólio com Traefik

Este documento explica como fazer o deploy do portfólio usando Traefik na sua VPS.

## Pré-requisitos

- VPS com Docker e Docker Compose instalados
- Traefik já configurado e rodando na VPS
- Rede Docker `traefik-network` criada (ou ajuste o nome no docker-compose.yml)

## Passos para Deploy

### 1. Editar o docker-compose.yml

Abra o arquivo `docker-compose.yml` e ajuste:

- Substitua `portfolio.seudominio.com` pelo seu domínio real
- Verifique se o nome da rede (`traefik-network`) corresponde à rede do seu Traefik
- Ajuste os entrypoints (`web`, `websecure`) conforme sua configuração do Traefik
- Ajuste o certificado resolver (`letsencrypt`) se necessário

Exemplo de configuração:
```yaml
- "traefik.http.routers.portfolio.rule=Host(`portfolio.gabrieldias.com`)"
```

### 2. Fazer Upload do Projeto para a VPS

Você pode usar `scp`, `rsync` ou `git clone`:

```bash
# Exemplo com scp
scp -r . usuario@seu-servidor:/caminho/para/portfolio

# Ou com rsync
rsync -avz --exclude '.git' . usuario@seu-servidor:/caminho/para/portfolio
```

### 3. Na VPS, fazer o build e iniciar o container

```bash
cd /caminho/para/portfolio
docker-compose up -d --build
```

### 4. Verificar se está rodando

```bash
docker-compose ps
docker-compose logs -f portfolio
```

## Configurações Opcionais

### Sem SSL (apenas HTTP)

Se não quiser usar HTTPS, remova as linhas relacionadas a `websecure` e `letsencrypt` do docker-compose.yml:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.portfolio.rule=Host(`portfolio.seudominio.com`)"
  - "traefik.http.routers.portfolio.entrypoints=web"
  - "traefik.http.services.portfolio.loadbalancer.server.port=80"
```

### Entrypoints Personalizados

Se seus entrypoints do Traefik tiverem nomes diferentes, ajuste no docker-compose.yml:

```yaml
- "traefik.http.routers.portfolio.entrypoints=web,websecure"
```

### Sem Redirecionamento HTTPS

Se não quiser redirecionar HTTP para HTTPS, remova as linhas:

```yaml
- "traefik.http.middlewares.portfolio-redirect.redirectscheme.scheme=https"
- "traefik.http.routers.portfolio.middlewares=portfolio-redirect"
```

## Comandos Úteis

```bash
# Parar o container
docker-compose down

# Ver logs
docker-compose logs -f portfolio

# Rebuild após mudanças
docker-compose up -d --build

# Reiniciar
docker-compose restart
```

## Troubleshooting

### Container não inicia

Verifique se a rede `traefik-network` existe:
```bash
docker network ls
```

Se não existir, crie:
```bash
docker network create traefik-network
```

### Traefik não detecta o serviço

- Verifique se as labels estão corretas
- Confirme que o container está na mesma rede do Traefik
- Verifique os logs do Traefik: `docker logs traefik`

### Erro de domínio

- Certifique-se de que o domínio aponta para o IP da VPS
- Verifique se o DNS está configurado corretamente

