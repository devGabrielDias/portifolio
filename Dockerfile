FROM nginx:alpine

# Copiar arquivos do site para o diretório do nginx
COPY . /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando padrão do nginx
CMD ["nginx", "-g", "daemon off;"]

