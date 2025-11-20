# Como Descobrir a Rede do Traefik

## 1. Listar todas as redes Docker

Execute na sua VPS:

```bash
docker network ls
```

Isso mostrará algo como:
```
NETWORK ID     NAME              DRIVER    SCOPE
abc123def456   bridge            bridge    local
def456ghi789   host              host      local
ghi789jkl012   none              null      local
jkl012mno345   traefik-network   bridge    local
```

## 2. Verificar qual rede o Traefik está usando

Para descobrir especificamente qual rede o container do Traefik está usando:

```bash
docker inspect traefik | grep -A 20 "Networks"
```

Ou de forma mais detalhada:

```bash
docker inspect traefik --format='{{range $key, $value := .NetworkSettings.Networks}}{{$key}}{{end}}'
```

## 3. Ver detalhes completos do Traefik

```bash
docker inspect traefik
```

Procure pela seção "Networks" no output JSON.

## 4. Listar containers conectados a uma rede específica

Se você já suspeita que é `traefik-network`, pode verificar:

```bash
docker network inspect traefik-network
```

Isso mostrará todos os containers conectados a essa rede, incluindo o Traefik.

## 5. Verificar outros sites que você já tem rodando

Se você já tem outros sites rodando com Traefik, pode verificar qual rede eles usam:

```bash
# Listar todos os containers
docker ps

# Para cada container do seu site, verificar sua rede
docker inspect nome-do-container-do-site | grep -A 20 "Networks"
```

Ou mais simples:

```bash
docker inspect nome-do-container-do-site --format='{{range $key, $value := .NetworkSettings.Networks}}{{$key}}{{end}}'
```

## Exemplo Prático

1. Na sua VPS, execute:
   ```bash
   docker network ls
   ```

2. Procure por redes com nomes como:
   - `traefik-network`
   - `traefik_default`
   - `traefik_proxy`
   - `proxy` (nome comum quando o Traefik é chamado de "proxy")

3. Para confirmar, veja qual rede o Traefik está usando:
   ```bash
   # Descobrir o nome do container do Traefik
   docker ps | grep traefik
   
   # Ver qual rede ele está usando (substitua pelo nome real do container)
   docker inspect traefik_traefik.1.y51t2iut2r6t2o8mo8vn48sfg --format='{{range $key, $value := .NetworkSettings.Networks}}{{$key}}{{end}}'
   ```

4. Depois, ajuste o `docker-compose.yml` do portfólio com o nome da rede encontrada.

## Exemplo Real (Docker Swarm)

Se o container do Traefik for um serviço do Docker Swarm (nome como `traefik_traefik.1.xxxxx`):

```bash
# Ver rede do Traefik no Swarm
docker inspect traefik_traefik.1.y51t2iut2r6t2o8mo8vn48sfg --format='{{range $key, $value := .NetworkSettings.Networks}}{{$key}}{{end}}'

# Ver todas as redes que o container está conectado
docker inspect traefik_traefik.1.y51t2iut2r6t2o8mo8vn48sfg | grep -A 10 "Networks"

# Ver detalhes de uma rede específica (substitua pelo nome da rede encontrada)
docker network inspect nome-da-rede
```

