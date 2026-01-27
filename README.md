# FonziGo

Aplicación web para comparar precios de productos entre diferentes supermercados.

## Demo en Vivo

| Servicio | URL |
|----------|-----|
| **Frontend** | https://fonzigo-frontend.onrender.com |
| **Backend API** | https://fonzigo.onrender.com |
| **Swagger UI** | https://fonzigo.onrender.com/swagger-ui.html |

> **Nota:** Los servicios gratuitos de Render pueden tardar ~30-50 segundos en "despertar" si han estado inactivos.

## Características

- ✅ Comparación de precios entre supermercados
- ✅ Sistema de diseño completo con ITCSS + BEM
- ✅ Componentes Angular standalone reutilizables
- ✅ Responsive design (Mobile-first)
- ✅ Accesibilidad WCAG AA
- ✅ Autenticación JWT + Google OAuth2
- ✅ Carrito de compras persistente
- ✅ API REST documentada con Swagger

## Stack Tecnológico

### Frontend
- **Framework:** Angular 21 (standalone components, signals)
- **Estilos:** SASS con arquitectura ITCSS
- **Metodología CSS:** BEM
- **Tipografía:** Open Sans + Montserrat
- **Testing:** Vitest

### Backend
- **Framework:** Spring Boot 4.0.0
- **Base de datos:** PostgreSQL 17
- **Seguridad:** Spring Security + JWT + Google OAuth2
- **Documentación API:** OpenAPI 3 (Swagger)
- **Build:** Gradle 8.x

## Estructura del Proyecto

```
FonziGo/
 ├── frontend/           # Aplicación Angular
 │   ├── src/
 │   │   ├── app/       # Componentes y páginas
 │   │   └── styles/    # Sistema de diseño ITCSS
 │   └── public/        # Assets estáticos
 ├── backend/           # API Spring Boot
 │   └── src/
 ├── database/          # Scripts SQL
 ├── docs/              # Documentación
 │   ├── deployment/    # Guías de despliegue (VPS, Render)
 │   └── design/        # Documentación de diseño
 ├── scripts/           # Scripts de automatización
 ├── docker-compose.prod.yaml      # Producción (VPS)
 ├── docker-compose.dev.yaml       # Desarrollo
 ├── docker-compose.dev-local.yaml  # Desarrollo local sin SSL
 ├── docker-compose.override.yaml   # Overrides de desarrollo
 ├── Caddyfile                   # Configuración de reverse proxy y SSL
 ├── deploy.sh                   # Script de despliegue
 └── update.sh                   # Script de actualización
```

## Inicio Rápido

### Prerequisitos

- Node.js 20+
- Java 21+
- PostgreSQL 17+

### Desarrollo Local - Frontend

```bash
cd frontend
npm install
npm start
```

Abre http://localhost:4200

### Desarrollo Local - Backend

```bash
cd backend
./gradlew bootRun
```

API disponible en http://localhost:8080

### Docker (Proyecto completo)

```bash
docker-compose up
```

## Documentación

- [Guía de Despliegue](docs/deployment/README.md) - Guías de despliegue (VPS, Render, GitHub Pages)
- [Documentación de Diseño](docs/design/DOCUMENTACION.md) - Sistema de diseño completo
- [Documentación Técnica](DOCUMENTACION_TECNICA.md) - Arquitectura y decisiones técnicas

## Sistema de Diseño

El proyecto implementa un sistema de diseño completo documentado:

- **Arquitectura CSS:** ITCSS (Inverted Triangle CSS)
- **Nomenclatura:** BEM (Block Element Modifier)
- **Design Tokens:** Variables CSS para colores, tipografía, espaciado
- **Componentes:** Biblioteca de componentes UI reutilizables
- **Accesibilidad:** ARIA labels, navegación por teclado, contraste AAA

Ver [documentación completa de diseño](docs/design/DOCUMENTACION.md).

## Testing

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
./gradlew test
```

## Build para Producción

### Frontend

```bash
cd frontend
npm run build:prod
```

Los archivos compilados estarán en `dist/frontend/browser/`

### Backend

```bash
cd backend
./gradlew build
```

El JAR estará en `build/libs/`

## Despliegue

### Producción (VPS - Recomendado)

La aplicación puede desplegarse en un VPS con Ubuntu 24.04 usando Docker y Caddy con SSL automático.

**Documentación completa:** [DEPLOYMENT_VPS.md](docs/deployment/DEPLOYMENT_VPS.md)

**Características del despliegue VPS:**
- ✅ Docker containerization
- ✅ Caddy con SSL automático (Let's Encrypt)
- ✅ Despliegue automatizado
- ✅ Health checks
- ✅ Logging y monitoreo
- ✅ Seguridad hardening

**Quick Start:**
```bash
# 1. Conectarse al VPS
ssh root@your-vps-ip

# 2. Clonar y ejecutar setup
cd /opt
git clone https://github.com/acasmor0802/FonziGo.git
cd FonziGo
sudo bash scripts/vps-setup.sh

# 3. Configurar variables de entorno
nano .env.prod

# 4. Desplegar
./deploy.sh
```

### Producción (Render)

La aplicación también está desplegada en **Render** (opcional):

| Componente | Plataforma | Región |
|------------|------------|--------|
| Frontend | Render (Docker) | Frankfurt (EU) |
| Backend | Render (Docker) | Frankfurt (EU) |
| Base de datos | Render PostgreSQL 17 | Frankfurt (EU) |

### Despliegue Local con Docker

**Desarrollo:**
```bash
docker-compose -f docker-compose.dev.yaml --env-file .env up -d
```

**Producción (local):**
```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## Autor

acasmor0802 - [@acasmor0802](https://github.com/acasmor0802)
