# Build stage
FROM node:18-alpine AS builder

WORKDIR /monorepo

# Copier les fichiers package du monorepo (racine)
COPY package*.json ./
COPY tsconfig.base.json* ./

# Copier tous les workspaces nécessaires
COPY packages ./packages
COPY apps/frontend ./apps/frontend

# Installer toutes les dépendances du monorepo
RUN npm ci

# Build du frontend
WORKDIR /monorepo/apps/frontend
RUN npm run build

# Production stage
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /monorepo/apps/frontend/dist /usr/share/nginx/html

# Copier la config Nginx
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
