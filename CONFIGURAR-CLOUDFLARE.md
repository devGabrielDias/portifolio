# Configurar Domínio no Cloudflare

Guia para configurar o domínio no Cloudflare e conectar com o Traefik na VPS.

## 1. Configurar DNS no Cloudflare

### Passos no painel do Cloudflare:

1. **Acesse o painel do Cloudflare** e selecione seu domínio
2. **Vá em "DNS" > "Records"**
3. **Adicione um registro A** ou **CNAME**:

   **Opção A - Registro A (recomendado):**
   - **Type**: A
   - **Name**: `portfolio` (ou o subdomínio que você quiser)
   - **IPv4 address**: IP da sua VPS
   - **Proxy status**: 🔴 **DNS only** (importante!)
   - **TTL**: Auto

   **Opção B - Registro CNAME (se preferir):**
   - **Type**: CNAME
   - **Name**: `portfolio`
   - **Target**: seu domínio principal ou outro subdomínio
   - **Proxy status**: 🔴 **DNS only**
   - **TTL**: Auto

### ⚠️ Importante sobre Proxy no Cloudflare:

- **🔴 DNS only (desativado)** - Recomendado quando você usa Traefik com Let's Encrypt:
  - O Traefik gerencia o SSL diretamente
  - Funciona melhor com certificados Let's Encrypt
  - A requisição vai direto para sua VPS
  
- **🟠 Proxied (ativado)** - Usa o proxy do Cloudflare:
  - O Cloudflare gerencia o SSL
  - Mas pode ter conflitos com certificados do Traefik
  - Requer configurações adicionais no Traefik

**Recomendação**: Use **DNS only (desativado)** para que o Traefik gerencie o SSL.

## 2. Verificar o IP da sua VPS

Se você não souber o IP da sua VPS, execute:

```bash
curl ifconfig.me
```

Ou veja no painel da sua VPS.

## 3. Aguardar propagação do DNS

Após configurar, aguarde alguns minutos para a propagação do DNS. Você pode verificar com:

```bash
# No terminal ou online (ex: whatsmydns.net)
nslookup portfolio.seudominio.com
# ou
dig portfolio.seudominio.com
```

## 4. Atualizar o docker-compose.yml

Depois de configurar o domínio no Cloudflare, atualize o `docker-compose.yml`:

Substitua `portfolio.seudominio.com` pelo seu domínio real em duas linhas:

```yaml
# Linha 13 e 18 do docker-compose.yml
- "traefik.http.routers.portfolio.rule=Host(`portfolio.seudominio.com`)"  # ← aqui
- "traefik.http.routers.portfolio-secure.rule=Host(`portfolio.seudominio.com`)"  # ← e aqui
```

**Exemplo:**
Se seu domínio for `portfolio.gabrieldias.com`:
```yaml
- "traefik.http.routers.portfolio.rule=Host(`portfolio.gabrieldias.com`)"
- "traefik.http.routers.portfolio-secure.rule=Host(`portfolio.gabrieldias.com`)"
```

## 5. Fazer o Deploy

Após configurar o DNS e atualizar o docker-compose.yml:

```bash
# Na VPS
cd ~/Portifolio
docker-compose up -d --build
```

## 6. Verificar se está funcionando

```bash
# Ver logs do container
docker-compose logs -f portfolio

# Ver logs do Traefik (para ver se detectou o serviço)
docker logs traefik_traefik.1.y51t2iut2r6t2o8mo8vn48sfg -f
```

Depois de alguns minutos, acesse o domínio no navegador!

## Troubleshooting

### O domínio não está resolvendo

- Aguarde mais tempo para propagação do DNS (pode levar até 24h, geralmente 5-10 minutos)
- Verifique se o DNS está apontando para o IP correto da VPS
- Verifique no Cloudflare se o proxy está desativado (DNS only)

### Certificado SSL não é gerado

- Verifique se o DNS está apontando corretamente para a VPS
- Verifique os logs do Traefik para erros do Let's Encrypt
- Certifique-se de que o domínio é acessível de fora antes de o Traefik tentar gerar o certificado

### Traefik não detecta o serviço

- Verifique se o container está na rede correta: `simulador_traefik_network`
- Verifique as labels no docker-compose.yml
- Veja os logs do Traefik para ver se ele detectou as labels

