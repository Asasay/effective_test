FROM node:22-alpine
RUN npm install -g npm@latest

WORKDIR /app/history-service
ARG NODE_ENV=production
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
