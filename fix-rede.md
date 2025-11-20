# Corrigir Erro de Rede

O erro indica que está procurando por `traefik-network` mas a rede correta é `simulador_traefik_network`.

## Solução:

Na sua VPS, verifique o conteúdo do docker-compose.yml:

```bash
cat docker-compose.yml
```

Se o arquivo tiver `traefik-network` ao invés de `simulador_traefik_network`, atualize o arquivo ou faça upload da versão correta.

## Ou simplesmente copie este conteúdo para o docker-compose.yml na VPS:

```yaml
version: '3.8'

services:
  portfolio:
    build: .
    container_name: portfolio
    restart: unless-stopped
    labels:
      # Labels do Traefik
      - "traefik.enable=true"
      
      # Porta HTTP
      - "traefik.http.routers.portfolio.rule=Host(`devgabrieldias.agentelegtech.pro`)"
      - "traefik.http.routers.portfolio.entrypoints=web"
      - "traefik.http.services.portfolio.loadbalancer.server.port=80"
      
      # Porta HTTPS (opcional - se tiver SSL configurado)
      - "traefik.http.routers.portfolio-secure.rule=Host(`devgabrieldias.agentelegtech.pro`)"
      - "traefik.http.routers.portfolio-secure.entrypoints=websecure"
      - "traefik.http.routers.portfolio-secure.tls=true"
      - "traefik.http.routers.portfolio-secure.tls.certresolver=letsencrypt"
      
      # Middleware para redirecionar HTTP para HTTPS (opcional)
      - "traefik.http.middlewares.portfolio-redirect.redirectscheme.scheme=https"
      - "traefik.http.routers.portfolio.middlewares=portfolio-redirect"
    
    networks:
      - portfolio_network
      - simulador_traefik_network

networks:
  portfolio_network:
    driver: bridge
  simulador_traefik_network:
    external: true
```

## Depois de atualizar:

```bash
docker-compose up -d --build
```

