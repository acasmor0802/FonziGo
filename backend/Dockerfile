# =============================================================================
# FonziGo Backend - Multi-stage Dockerfile
# Spring Boot 4.0 application with Java 21
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM eclipse-temurin:21.0.2_13-jdk-alpine AS builder

LABEL maintainer="FonziGo Team"
LABEL stage="builder"

WORKDIR /app

# Copiar archivos de Gradle (mantener estructura correcta)
COPY backend/gradlew ./
COPY backend/gradle gradle/
COPY backend/build.gradle backend/settings.gradle ./

# Dar permisos de ejecución al wrapper
RUN chmod +x gradlew

# Descargar dependencias (capa cacheada)
RUN ./gradlew dependencies --no-daemon || true

# Copiar código fuente
COPY backend/src src/

# Construir aplicación (sin tests para acelerar)
RUN ./gradlew clean build -x test --no-daemon

# -----------------------------------------------------------------------------
# Stage 2: Run
# -----------------------------------------------------------------------------
FROM eclipse-temurin:21.0.2_13-jre-alpine AS production

LABEL maintainer="FonziGo Team"
LABEL description="FonziGo Backend - Spring Boot API"

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copiar JAR desde builder
COPY --from=builder /app/build/libs/*.jar app.jar

# Cambiar ownership y usuario
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

# Configuración JVM optimizada para contenedores
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Healthcheck para Docker
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
