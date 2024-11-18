# Dockerfile

# Use an official Node.js runtime as the base image
FROM node:22

# Set the working directory in the container
WORKDIR /app/history-service

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3001

# Seed and then start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run start"]
