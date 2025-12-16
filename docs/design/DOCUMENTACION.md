# DOCUMENTACIÓN DE DISEÑO Y ARQUITECTURA CSS - FonziGo

## Sistema de Diseño Completo con ITCSS + BEM + Arquitectura Angular

**Fecha:** Diciembre 2024 | **Versión:** 1.0.0

---

## TABLA DE CONTENIDOS

1. [Fase 1: Arquitectura CSS](#fase-1-arquitectura-css)
2. [Fase 2: HTML Semántico](#fase-2-html-semántico)
3. [Fase 3: Componentes UI](#fase-3-componentes-ui)

---

# FASE 1: ARQUITECTURA CSS Y COMUNICACIÓN VISUAL

## 1.1 Principios de Comunicación Visual

### Jerarquía
- **Implementación:** Escala tipográfica 1.25 (H1: 3rem  H6: 1.125rem)
- **Espaciado:** Sistema 4px (1rem, 1.5rem, 2rem, 3rem, etc.)
- **Colores:** Primario #1991b9, Secundario #f5af19

### Contraste
- **Ratios WCAG:** AAA para texto principal
- **Estados:** Normal, Hover (-2px transform), Focus (outline), Disabled (opacity 0.6)

### Alineación
- **Grid:** 12 columnas responsive
- **Contenedor:** Max-width 1280px centrado

### Proximidad
- **Grupos:** 8-12px entre elementos relacionados
- **Secciones:** 48-64px entre bloques

### Repetición
- **BEM:** Nomenclatura consistente
- **Transiciones:** 300ms ease-in-out universal
- **Border-radius:** 4-8px en todos los elementos

---

## 1.2 Metodología BEM

Estructura: \.block__element--modifier\

**Ejemplos:**
\\\sass
.btn                  // Block
  &__content         // Element
  &--primary         // Modifier
  &--sm              // Modifier de tamaño
\\\

---

## 1.3 Arquitectura ITCSS

\\\
00-settings/     Variables, tokens
01-tools/        Mixins, funciones
02-generic/      Reset CSS
03-elements/     HTML base (h1, p, a)
04-objects/      Layout patterns
05-components/   UI components
06-utilities/    Helper classes
\\\

**Orden de importación en styles.sass:**
1. Settings  Tools  Generic  Elements  Objects  Components  Utilities

---

## 1.4 Design Tokens

### Colores
\\\sass
// Primarios
\-primary-500: #1991b9

// Secundarios
\-secondary-500: #f5af19

// Semánticos
\-success: #22c55e
\-error: #ef4444
\-warning: #f59e0b
\-info: #3b82f6
\\\

### Tipografía
- **Familias:** Inter (lectura), Poppins (títulos)
- **Escala:** 0.75rem  3rem (ratio 1.25)
- **Pesos:** 300, 400, 500, 600, 700, 800

### Espaciado (base 4px)
\\\sass
\-1: 0.25rem  // 4px
\-4: 1rem     // 16px
\-12: 3rem    // 48px
\\\

### Breakpoints
\\\sass
\-sm: 640px
\-md: 768px
\-lg: 1024px
\-xl: 1280px
\\\

---

## 1.5 Mixins Principales

### Responsive
\\\sass
+media-breakpoint-up(md)
  font-size: 1.5rem
\\\

### Layout
\\\sass
+flex-center        // Centrado flexbox
+container          // Contenedor responsive
\\\

### Componentes
\\\sass
+button-base        // Base de botones
+input-base         // Base de inputs
+card-base          // Base de cards
\\\

### Efectos
\\\sass
+hover-lift         // Elevación en hover
+smooth-transition  // Transiciones suaves
\\\

---

## 1.6 ViewEncapsulation

### Estrategia
- **None:** Header, Footer, Main (estilos globales en 05-components/)
- **Emulated:** Todos los demás componentes (encapsulados)

### Razón
- Layout global necesita consistencia
- Componentes encapsulados evitan conflictos

---

# FASE 2: HTML SEMÁNTICO Y ESTRUCTURA

## 2.1 Elementos Semánticos

### \<header\>
\\\html
<header class=\"header\">
  <nav aria-label=\"Navegación principal\">...</nav>
</header>
\\\

### \<main\>
\\\html
<main role=\"main\">
  <ng-content></ng-content>
</main>
\\\

### \<footer\>
\\\html
<footer class=\"footer\">
  <p class=\"footer__copyright\">&copy; 2024 FonziGo</p>
</footer>
\\\

---

## 2.2 Jerarquía de Headings

**Reglas:**
1. Un solo H1 por página
2. No saltar niveles (H1  H2  H3)
3. Orden lógico

**Ejemplo:**
\\\
H1: Título Principal
 H2: Sección 1
    H3: Subsección 1.1
    H3: Subsección 1.2
 H2: Sección 2
\\\

---

## 2.3 Formularios Accesibles

### Asociación Label-Input
\\\html
<label for=\"email\">Email</label>
<input id=\"email\" type=\"email\">
\\\

### Fieldset y Legend
\\\html
<form>
  <fieldset>
    <legend>Inicia sesión</legend>
    <app-form-input id=\"email\" ...></app-form-input>
  </fieldset>
  <button type=\"submit\">Acceder</button>
</form>
\\\

### Atributos ARIA
- \ria-required=\"true\"\: Campo obligatorio
- \ria-invalid=\"true\"\: Campo con error
- \ria-describedby\: Vincula descripción/error
- \ole=\"alert\"\: Mensaje de error

---

# FASE 3: COMPONENTES UI

## 3.1 Button

**Variantes:** primary, secondary, outline, ghost, danger
**Tamaños:** sm, md, lg
**Estados:** normal, hover, focus, disabled, loading

\\\html
<app-button variant=\"primary\" size=\"md\">
  Guardar
</app-button>
\\\

---

## 3.2 Alert

**Tipos:** success, error, warning, info

\\\html
<app-alert type=\"success\" [closeable]=\"true\">
  ¡Operación exitosa!
</app-alert>
\\\

---

## 3.3 Form Input

**Características:**
- Label asociado correctamente
- Asterisco para requeridos
- Mensaje de error con role=\"alert\"
- ControlValueAccessor

\\\html
<app-form-input
  id=\"email\"
  label=\"Email\"
  type=\"email\"
  [required]=\"true\"
  helpText=\"Usa tu email de registro\"
  [errorText]=\"emailError\"
/>
\\\

---

## 3.4 Form Select

\\\html
<app-form-select
  id=\"provincia\"
  label=\"Provincia\"
  [options]=\"provincias\"
  [required]=\"true\"
/>
\\\

---

## 3.5 Product Card

\\\html
<app-product-card [product]=\"product\" />
\\\

---

## CONCLUSIÓN

 **Arquitectura ITCSS** implementada completamente
 **Design Tokens** como fuente única de verdad
 **Mixins reutilizables** en 01-tools/
 **HTML semántico** con ARIA
 **Componentes BEM** modulares
 **ViewEncapsulation** estratégico
 **Formularios accesibles** WCAG AA

**Archivos clave:**
- \styles/00-settings/_variables.sass\  Design tokens
- \styles/01-tools/_mixins.sass\  Mixins reutilizables
- \styles/05-components/\  Header, Footer, Buttons
- \styles.sass\  Punto de entrada ITCSS

---

**Mantenido por:** Equipo FonziGo
**Última actualización:** Diciembre 2024
