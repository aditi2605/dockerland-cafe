# frontend/Dockerfile

# node:20-alpine is Node.js on Alpine Linux — small and fast to download
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files FIRST (before the rest of the code)
# This lets Docker cache the npm install layer — if package.json hasn't
# changed, Docker reuses the cached layer and skips npm install entirely!
COPY package*.json ./

# Install dependencies (equivalent to npm install locally)
RUN npm ci --silent

# Now copy the rest of the source code
COPY . .

# Build the production React app (runs vite build)
# Output goes to /app/dist — a folder of optimised HTML/CSS/JS files
RUN npm run build

# Start fresh with a tiny Nginx image — none of the Node.js bloat!
FROM nginx:alpine

# Copy ONLY the compiled files from the builder stage
# We leave everything else behind — node_modules, source files, etc.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles React Router URLs properly)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Document that this container listens on port 8000
EXPOSE 8000

