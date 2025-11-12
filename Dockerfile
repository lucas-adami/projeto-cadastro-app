# Etapa 1: Imagem base com Node e dependências
FROM node:18-slim

# Instalar dependências básicas
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    apt-get clean

# Instalar Expo CLI global
RUN npm install -g expo-cli

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar apenas arquivos de dependências para instalar pacotes (melhor uso de cache)
COPY package.json package-lock.json ./

# Instalar dependências do projeto
RUN npm install

# Copiar todo o restante do projeto
COPY . .

# Expor as portas padrão do Expo
EXPOSE 8081 19000 19001 19002

# Comando para iniciar o Expo
CMD ["npx", "expo", "start", "--tunnel"]