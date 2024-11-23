FROM node:22-alpine
RUN npm install -g npm@latest

WORKDIR /app/user-service
ARG NODE_ENV=production
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run prisma:seed && npm run start:prod"]
