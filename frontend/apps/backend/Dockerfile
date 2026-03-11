FROM node:18-alpine AS builder
WORKDIR /monorepo
COPY package*.json ./
COPY tsconfig.base.json* ./
COPY packages ./packages
COPY apps/backend ./apps/backend
RUN npm ci
WORKDIR /monorepo/apps/backend
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /monorepo/apps/backend/dist ./dist
COPY --from=builder /monorepo/apps/backend/prisma ./prisma
COPY --from=builder /monorepo/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/main.js"]
