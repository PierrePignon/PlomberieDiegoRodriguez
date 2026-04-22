# Use Node LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose port (Fly uses 8080 by default)
EXPOSE 8080

# Start app
CMD ["npm", "start"]
