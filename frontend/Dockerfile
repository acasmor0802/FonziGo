# =============================================================================
# FonziGo Frontend - Multi-stage Dockerfile
# Angular 21 application served with Nginx
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:22.16-alpine3.21 AS builder

LABEL maintainer="FonziGo Team"
LABEL stage="builder"

WORKDIR /app

# Copiar archivos de dependencias primero (mejor uso de caché)
COPY frontend/package.json frontend/package-lock.json ./

# Instalar dependencias en modo CI (limpio y reproducible)
RUN npm ci --no-audit --no-fund

# Copiar código fuente
COPY frontend/ ./

# Construir para producción
RUN npm run build -- --configuration production

# -----------------------------------------------------------------------------
# Stage 2: Serve
# -----------------------------------------------------------------------------
FROM nginx:1.25.4-alpine3.18 AS production

LABEL maintainer="FonziGo Team"
LABEL description="FonziGo Frontend - Angular SPA"

# Copiar archivos compilados
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuración de Nginx
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Instalar curl para healthcheck
RUN apk add --no-cache curl

EXPOSE 80

# Healthcheck para Docker (usando curl que está disponible)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl --fail --silent http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
