# FonziGo - Plataforma de Comparacion de Precios de Supermercados

FonziGo es una plataforma backend REST API que permite a los usuarios comparar precios de productos entre diferentes supermercados, gestionar carritos de compra y realizar pedidos.

## Caracteristicas

- Autenticacion JWT - Sistema seguro de autenticacion y autorizacion
- Gestion de Usuarios - Registro y login de usuarios con roles (USER/ADMIN)
- Catalogo de Productos - CRUD completo de productos con validaciones
- Categorias - Organizacion de productos por categorias
- Comparacion de Precios - Ver precios en diferentes supermercados
- Carrito de Compras - Gestion de carrito persistente
- Sistema de Pedidos - Crear y gestionar pedidos
- Upload de Archivos - Carga de imagenes de productos
- Documentacion Swagger - API documentada con OpenAPI 3.0
- Validaciones - Validaciones en todos los DTOs

## Requisitos Previos

- Java 17+
- Spring Boot 3.0+
- PostgreSQL 12+
- Gradle 7.0+
- Docker 

##  Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/acasmor0802/FonziGo.git
cd fonzigo-backend
```
### 2. Configurar base de datos

Crear una base de datos PostgreSQL:

CREATE DATABASE fonzigo;
CREATE USER fonzi WITH PASSWORD 'fonzipass';
ALTER ROLE fonzi SET client_encoding TO 'utf8';
ALTER ROLE fonzi SET default_transaction_isolation TO 'read committed';
ALTER ROLE fonzi SET default_transaction_deferrable TO on;
ALTER ROLE fonzi SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE fonzigo TO fonzi;

### 3. Configurar variables de entorno

Editar application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/fonzigo
spring.datasource.username=fonzi
spring.datasource.password=fonzipass
security.jwt.secret-key=tu_clave_secreta_super_larga
file.upload.dir=uploads/

### 4. Instalar dependencias y ejecutar

./gradlew clean build
./gradlew bootRun

La aplicación estará disponible en: http://localhost:8080

##  Documentación API

### Swagger UI

Accede a la documentación interactiva en:
http://localhost:8080/swagger-ui.html

### Endpoints Principales

#### Autenticación

POST /api/auth/register - Registrar nuevo usuario
POST /api/auth/login - Iniciar sesión
GET /api/auth/me - Obtener usuario actual (autenticado)

#### Productos (Público)

GET /api/products - Obtener todos los productos
GET /api/products/{id} - Obtener producto por ID

#### Productos (Admin)

POST /api/products - Crear producto
PUT /api/products/{id} - Actualizar producto
DELETE /api/products/{id} - Eliminar producto
POST /api/products/{id}/upload-image - Subir imagen

#### Categorías (Público)

GET /api/categories - Obtener todas las categorías
GET /api/categories/{id} - Obtener categoría por ID

#### Categorías (Admin)

POST /api/categories - Crear categoría
PUT /api/categories/{id} - Actualizar categoría
DELETE /api/categories/{id} - Eliminar categoría

##  Autenticación

### Obtener Token JWT

1. Registrar usuario:

curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{ \"name\": \"Juan Pérez\", \"email\": \"juan@example.com\", \"phone\": \"123456789\", \"password\": \"password123\" }"

2. Iniciar sesión:

curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{ \"email\": \"juan@example.com\", \"password\": \"password123\" }"

3. Usar token en requests:

curl -X GET http://localhost:8080/api/auth/me -H "Authorization: Bearer YOUR_JWT_TOKEN"

##  Estructura del Proyecto

backend/
├── src/main/java/fonzigo/backend/
│   ├── config/              # Configuraciones (JWT, Security, Swagger)
│   ├── controller/          # Controladores REST
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # Entidades JPA
│   ├── exception/           # Manejo de excepciones
│   ├── repository/          # Repositorios JPA
│   ├── security/            # Seguridad (JWT, Auth)
│   ├── service/             # Lógica de negocio
│   └── FonzigoApplication.java
├── src/main/resources/
│   └── application.properties
├── build.gradle
└── README.md

##  Roles y Permisos

### USER (Usuario Regular)
- Ver productos y categorías
- Ver carrito y realizar pedidos
- Gestionar su perfil

### ADMIN (Administrador)
- Crear, actualizar y eliminar productos
- Crear, actualizar y eliminar categorías
- Subir imágenes de productos
- Gestionar usuarios

##  Códigos de Estado HTTP

200 OK - Solicitud exitosa
201 Created - Recurso creado exitosamente
400 Bad Request - Validación fallida
401 Unauthorized - No autenticado
403 Forbidden - Sin permisos
404 Not Found - Recurso no encontrado
500 Internal Server Error - Error del servidor

##  Validaciones

### Usuario (Registro)
- Nombre: 2-100 caracteres
- Email: formato válido
- Teléfono: 9-15 dígitos
- Contraseña: mínimo 8 caracteres

### Producto
- Nombre: 2-255 caracteres
- Descripción: máximo 1000 caracteres
- Stock: número no negativo
- Categoría: obligatoria

### Categoría
- Nombre: 2-100 caracteres

##  Docker 

### Docker Compose

Crear docker-compose.yml:

version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: fonzigo
      POSTGRES_USER: fonzi
      POSTGRES_PASSWORD: fonzipass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/fonzigo
      SPRING_DATASOURCE_USERNAME: fonzi
      SPRING_DATASOURCE_PASSWORD: fonzipass

volumes:
  postgres_data:

Ejecutar:
docker-compose up

---