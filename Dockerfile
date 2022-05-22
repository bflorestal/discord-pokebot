FROM node:latest

# Création d'un répertoire pour l'application
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code de l'application
COPY . .

# Expose port 8080
EXPOSE 8080

# Lancement de l'application
CMD ["node", "index.js"]