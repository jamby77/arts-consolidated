# syntax=docker/dockerfile:1
FROM node:25.1.0-alpine AS base
WORKDIR /app

# Install deps
COPY package.json tsconfig.json ./
RUN npm install --no-audit --no-fund

# Copy source
COPY src ./src
COPY scripts ./scripts
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Build
RUN npm run build || true

# Runtime
EXPOSE 3001
ENV NODE_ENV=production
ENTRYPOINT ["./docker-entrypoint.sh"]
