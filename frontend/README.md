# FonziGo Frontend

Aplicacion frontend desarrollada con Angular 21 para el proyecto FonziGo - comparador de precios de supermercados.

## Tecnologias

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| Angular | 21.0.0 | Framework principal |
| TypeScript | 5.x | Lenguaje de programacion |
| SASS | 1.x | Preprocesador CSS (sintaxis indentada) |
| RxJS | 7.x | Programacion reactiva |

## Estructura del Proyecto

```
src/app/
├── components/          # Componentes reutilizables
│   ├── accordion/       # Acordeon interactivo
│   ├── alert/           # Alertas
│   ├── button/          # Boton personalizado
│   ├── contact-form/    # Formulario de contacto
│   ├── invoice-form/    # Factura con FormArray
│   ├── login/           # Formulario de login
│   ├── modal/           # Ventanas modales
│   ├── register/        # Formulario de registro
│   ├── tabs/            # Sistema de pestanas
│   ├── toast/           # Notificaciones toast
│   └── tooltip/         # Tooltips informativos
├── layout/              # Componentes de estructura
│   ├── header/          # Header con theme switcher y menu movil
│   ├── footer/          # Footer
│   └── main/            # Pagina principal
├── pages/               # Paginas de la aplicacion
│   ├── login/           # Pagina de login con layout
│   ├── register/        # Pagina de registro con layout
│   └── style-guide/     # Guia de estilos
└── shared/              # Codigo compartido
    ├── services/        # Servicios (Toast, Communication, Loading)
    ├── interceptors/    # Interceptores HTTP
    └── validators/      # Validadores personalizados
```

## Sistema de Estilos (ITCSS + BEM)

```
src/styles/
├── 00-settings/    # Variables y design tokens
├── 01-tools/       # Mixins y funciones
├── 02-generic/     # Reset y normalizacion
├── 03-elements/    # Estilos base HTML
├── 04-layout/      # Sistema de layout
├── 05-components/  # Estilos de componentes
└── 06-utilities/   # Clases de utilidad
```

## Caracteristicas Principales

### Componentes Interactivos
- **Theme Switcher** - Modo claro/oscuro con persistencia
- **Menu Mobile** - Hamburguesa con apertura/cierre animado
- **Modal** - Cierre con ESC, overlay y boton X
- **Accordion** - Multiples items abiertos simultaneamente
- **Tabs** - Sistema de pestanas con signals
- **Tooltip** - 4 posiciones (top, bottom, left, right)
- **Toast** - Notificaciones auto-dismissables

### Formularios Reactivos
- **Login** - Validacion de email y contrasena
- **Register** - Validadores async (email unico) y sincronos
- **Contact Form** - NIF, telefono, validadores cross-field
- **Invoice Form** - FormArray para items dinamicos

### Validadores Personalizados

**Sincronos:**
- `passwordStrength()` - Mayuscula, minuscula, numero, simbolo
- `passwordMatch()` - Coincidencia de contrasenas
- `nifValidator()` - NIF espanol con letra de control
- `telefonoValidator()` - Telefono espanol
- `codigoPostalValidator()` - CP espanol

**Asincronos:**
- `emailUnique()` - Verificar email no registrado
- `usernameAvailable()` - Verificar username disponible
- `nifExists()` - Verificar NIF en base de datos

### Servicios

- **CommunicationService** - Comunicacion entre componentes
- **ToastService** - Sistema de notificaciones
- **LoadingService** - Estados de carga centralizados

## Eventos Documentados

| Componente | Evento | Descripcion |
|------------|--------|-------------|
| Button | `(clicked)` | Click con soporte loading |
| Modal | `(closed)` | Al cerrar modal |
| Accordion | `toggle()` | Abrir/cerrar item |
| Tabs | `selectTab()` | Cambiar pestana activa |
| Header | `toggleTheme()` | Cambiar tema |
| Header | `toggleMobileMenu()` | Abrir/cerrar menu |

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve
# http://localhost:4200

# Build de produccion
ng build --configuration production

# Tests
ng test
```

## Documentacion

Ver [DOCUMENTACION_TECNICA.md](../DOCUMENTACION_TECNICA.md) para documentacion completa del proyecto.
