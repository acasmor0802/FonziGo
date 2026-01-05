# =============================================================================
# FonziGo Database - PostgreSQL
# =============================================================================
FROM postgres:17.2-alpine3.19

LABEL maintainer="FonziGo Team"
LABEL description="FonziGo Database - PostgreSQL 17"

# Variables de entorno (pueden sobrescribirse en docker-compose)
ENV POSTGRES_DB=fonzigo
ENV POSTGRES_USER=fonzi
ENV POSTGRES_PASSWORD=fonzipass
ENV LANG=es_ES.utf8

# Puerto por defecto de PostgreSQL
EXPOSE 5432

# Healthcheck nativo
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
