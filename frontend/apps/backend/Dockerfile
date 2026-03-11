FROM node:18-alpine AS builder
WORKDIR /app
COPY apps/backend/package.json ./
RUN npm install
COPY apps/backend/prisma ./prisma
RUN npx prisma generate
COPY apps/backend/tsconfig*.json ./
COPY apps/backend/nest-cli.json ./
COPY apps/backend/src ./src
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
