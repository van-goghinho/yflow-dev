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
# Ensure .prisma is available at a known location
RUN cp -r /monorepo/node_modules/.prisma /monorepo/apps/backend/node_modules/.prisma 2>/dev/null || true
RUN cp -r /monorepo/node_modules/@prisma /monorepo/apps/backend/node_modules/@prisma 2>/dev/null || true

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /monorepo/apps/backend/dist ./dist
COPY --from=builder /monorepo/apps/backend/node_modules ./node_modules
COPY --from=builder /monorepo/apps/backend/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
