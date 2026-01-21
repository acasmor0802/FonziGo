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
│   └── design/        # Documentación de diseño
└── docker-compose.yaml # Configuración Docker
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

- [Guía de Despliegue](DEPLOYMENT.md) - Cómo desplegar la aplicación
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

La aplicación está desplegada en **Render**:

| Componente | Plataforma | Región |
|------------|------------|--------|
| Frontend | Render (Docker) | Frankfurt (EU) |
| Backend | Render (Docker) | Frankfurt (EU) |
| Base de datos | Render PostgreSQL 17 | Frankfurt (EU) |

### Despliegue Local con Docker

```bash
docker-compose up --build -d
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## Autor

acasmor0802 - [@acasmor0802](https://github.com/acasmor0802)

## Agradecimientos

- Inspirado en comparadores de precios existentes
- Diseño basado en principios de Material Design
- Arquitectura CSS basada en ITCSS de Harry Roberts
