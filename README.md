# FonziGo 🛒

Aplicación web para comparar precios de productos entre diferentes supermercados.

[![Deploy to GitHub Pages](https://github.com/acasmor0802/FonziGo/actions/workflows/deploy.yml/badge.svg)](https://github.com/acasmor0802/FonziGo/actions/workflows/deploy.yml)

## 🚀 Demo en Vivo

**Frontend:** https://acasmor0802.github.io/FonziGo/

## 📋 Características

- ✅ Comparación de precios entre supermercados
- ✅ Sistema de diseño completo con ITCSS + BEM
- ✅ Componentes Angular reutilizables
- ✅ Responsive design (Mobile-first)
- ✅ Accesibilidad WCAG AA
- ✅ Sintaxis moderna de Angular 17+

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Angular 21
- **Estilos:** SASS con arquitectura ITCSS
- **Metodología CSS:** BEM
- **Tipografía:** Open Sans + Montserrat
- **Testing:** Vitest

### Backend
- **Framework:** Spring Boot 3.x
- **Base de datos:** PostgreSQL
- **Build:** Gradle

## 📦 Estructura del Proyecto

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
└── .github/           # GitHub Actions workflows
```

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 20+
- Java 17+
- PostgreSQL 14+

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

## 📖 Documentación

- [📘 Guía de Despliegue](DEPLOYMENT.md) - Cómo desplegar en GitHub Pages
- [🎨 Documentación de Diseño](docs/design/DOCUMENTACION.md) - Sistema de diseño completo
- [📄 Documentación Técnica](DOCUMENTACION_TECNICA.md) - Arquitectura y decisiones técnicas

## 🎨 Sistema de Diseño

El proyecto implementa un sistema de diseño completo documentado:

- **Arquitectura CSS:** ITCSS (Inverted Triangle CSS)
- **Nomenclatura:** BEM (Block Element Modifier)
- **Design Tokens:** Variables CSS para colores, tipografía, espaciado
- **Componentes:** Biblioteca de componentes UI reutilizables
- **Accesibilidad:** ARIA labels, navegación por teclado, contraste AAA

Ver [documentación completa de diseño](docs/design/DOCUMENTACION.md).

## 🧪 Testing

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
./gradlew test
```

## 📦 Build para Producción

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

## 🚀 Despliegue

### Despliegue Automático (GitHub Actions)

El proyecto se despliega automáticamente en GitHub Pages con cada push a `main`.

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para detalles completos.

### Despliegue Manual

```bash
cd frontend
npm run deploy
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 👤 Autor

acasmor0802 - [@acasmor0802](https://github.com/acasmor0802)

## 🙏 Agradecimientos

- Inspirado en comparadores de precios existentes
- Diseño basado en principios de Material Design
- Arquitectura CSS basada en ITCSS de Harry Roberts
