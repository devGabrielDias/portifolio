# Deploy via Git

Guia completo para fazer deploy do portfólio usando Git na VPS com Traefik.

## 1. Preparar o Repositório Git

### 1.1. Inicializar o repositório (se ainda não fez)

No seu computador local, na pasta do projeto:

```bash
git init
git add .
git commit -m "Initial commit - Portfolio com Traefik"
```

### 1.2. Criar repositório remoto

Crie um repositório no GitHub, GitLab ou Bitbucket, e depois:

```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git branch -M main
git push -u origin main
```

## 2. Configurar na VPS

### 2.1. Clonar o repositório na VPS

Na sua VPS, execute:

```bash
cd ~
git clone https://github.com/seu-usuario/seu-repositorio.git Portifolio
cd Portifolio
```

### 2.2. Verificar se o docker-compose.yml está correto

```bash
cat docker-compose.yml
```

Certifique-se de que:
- O domínio está correto: `devgabrieldias.agentelegtech.pro`
- A rede está correta: `simulador_traefik_network`

## 3. Fazer o Deploy Inicial

```bash
docker-compose up -d --build
```

## 4. Verificar se está funcionando

```bash
# Ver status dos containers
docker-compose ps

# Ver logs do portfólio
docker-compose logs -f portfolio

# Ver logs do Traefik (para verificar se detectou o serviço)
docker logs traefik_traefik.1.y51t2iut2r6t2o8mo8vn48sfg -f
```

## 5. Atualizar o Site (Workflow)

Depois de fazer alterações no código:

### 5.1. No seu computador local:

```bash
# Fazer commit das alterações
git add .
git commit -m "Descrição das alterações"
git push
```

### 5.2. Na VPS:

```bash
cd ~/Portifolio
git pull
docker-compose up -d --build
```

Isso fará o rebuild da imagem e reiniciará o container com as novas alterações.

## 6. Script de Deploy Automático (Opcional)

Crie um script para facilitar o deploy:

### Criar script `deploy.sh` na VPS:

```bash
#!/bin/bash
cd ~/Portifolio
echo "Atualizando código..."
git pull
echo "Fazendo rebuild do container..."
docker-compose up -d --build
echo "Deploy concluído!"
docker-compose ps
```

### Tornar o script executável:

```bash
chmod +x ~/Portifolio/deploy.sh
```

### Usar o script:

```bash
~/Portifolio/deploy.sh
```

## 7. Webhook Automático (Avançado - Opcional)

Para fazer deploy automático quando você fizer push no Git:

### 7.1. Instalar webhook na VPS:

```bash
# Exemplo com webhookd (GitHub)
# Ou use outras ferramentas como webhook do adnanh

# Criar script de deploy
cat > ~/Portifolio/deploy.sh << 'EOF'
#!/bin/bash
cd ~/Portifolio
git pull
docker-compose up -d --build
EOF

chmod +x ~/Portifolio/deploy.sh
```

### 7.2. Configurar webhook no GitHub/GitLab:

1. Vá em Settings > Webhooks no seu repositório
2. Adicione um webhook apontando para `http://sua-vps:porta/webhook/deploy`
3. Configure para disparar em eventos de push

## 8. Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f portfolio

# Parar o container
docker-compose down

# Reiniciar sem rebuild
docker-compose restart

# Ver status
docker-compose ps

# Ver redes do container
docker inspect portfolio | grep -A 20 "Networks"
```

## 9. Troubleshooting

### Container não atualiza após git pull

Certifique-se de fazer o rebuild:
```bash
docker-compose up -d --build
```

### Erro de rede não encontrada

Verifique se a rede existe:
```bash
docker network ls | grep simulador_traefik_network
```

### Traefik não detecta o serviço

Verifique:
- Se o container está na rede correta: `simulador_traefik_network`
- Se as labels estão corretas no docker-compose.yml
- Logs do Traefik para ver erros

### Verificar DNS

```bash
nslookup devgabrieldias.agentelegtech.pro
```

## 10. Estrutura Final do Projeto

```
Portifolio/
├── index.html
├── css/
├── js/
├── images/
├── videos/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md (opcional)
```

## Próximos Passos

1. ✅ Configurar domínio no Cloudflare (já feito)
2. ✅ Configurar docker-compose.yml (já feito)
3. ⏳ Fazer push do código para o Git
4. ⏳ Clonar na VPS
5. ⏳ Fazer deploy

