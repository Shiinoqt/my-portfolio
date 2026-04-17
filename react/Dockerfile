# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app

# Install build tools (Vite/Rollup sometimes need these for dependency optimization)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# Using 'npm ci' is faster and more reliable in Docker
RUN npm install 

COPY . .
RUN npm run build

# Stage 2: Serve (Nginx is fine on Alpine as it's just serving static files)
FROM nginx:stable-alpine
# Vite outputs to 'dist' by default
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]