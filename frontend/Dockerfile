# ==============================================================================
# FonziGo Frontend - Dockerfile for Angular 21
# ==============================================================================

# Build stage
FROM node:22.16-alpine3.21 AS builder

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm ci --no-audit --no-fund

# Copy source code
COPY frontend/ .

# Build for production
RUN npm run build -- --configuration production

# Production stage
FROM nginx:1.27.1-alpine AS production

LABEL maintainer="FonziGo Team"
LABEL description="FonziGo Frontend - Angular SPA"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built files from builder
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Create directories for caching if they don't exist
RUN mkdir -p /usr/share/nginx/html/assets

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl --fail --silent http://localhost/80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
