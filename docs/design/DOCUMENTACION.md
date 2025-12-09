# Documentación del Diseño y la Arquitectura

## Sección 1: Arquitectura CSS y Comunicación Visual

---

### 1.1 Principios de Comunicación Visual

La comunicación visual efectiva es crucial para la experiencia de usuario. En este proyecto, aplicamos los siguientes principios:

*   **Jerarquía:** Utilizamos el tamaño, peso de la fuente, color y espaciado para guiar la atención del usuario. Por ejemplo, los `h1` son visualmente más prominentes que los `h2`, y los elementos importantes tienen más espacio a su alrededor.
    *   **Aplicación:**
        *   **Tamaño:** La escala tipográfica (`$text-xs` a `$text-5xl`) define la importancia de los títulos y textos.
        *   **Peso:** Los títulos (`h1`-`h6`) utilizan pesos de fuente más fuertes (`$font-bold`, `$font-semibold`) que los párrafos (`$font-regular`).
        *   **Espaciado:** Márgenes (`margin-bottom: $spacing-4`) y paddings (`padding: $spacing-3 $spacing-5`) adecuados para separar secciones y elementos.
        *   **Color:** Colores primarios (`$primary-blue`) para acciones principales y elementos destacados, y neutrales (`$gray-800`) para el texto principal.

*   **Contraste:** Diferenciamos elementos y estados utilizando variaciones de color, tamaño y peso. Esto mejora la legibilidad y la interactividad.
    *   **Aplicación:**
        *   **Color:** El contraste entre el fondo (`$background`) y el texto (`$gray-800`, `$primary-blue`) asegura legibilidad. Los colores semánticos (`$success`, `$error`, `$warning`, `$info`) destacan la información importante.
        *   **Tamaño/Peso:** El contraste entre `$text-base` y `$text-5xl` o entre `$font-light` y `$font-bold` para los textos y títulos.
        *   **Sombras:** Las elevaciones (`$shadow-sm` a `$shadow-xl`) proporcionan contraste visual y profundidad para elementos interactivos o destacados.

*   **Alineación:** Mantenemos la consistencia visual y la organización a través de una alineación cuidadosa de los elementos.
    *   **Aplicación:**
        *   **Grid System:** El sistema de rejilla (`.grid` y `.grid-col-*`) asegura una alineación consistente de los elementos en el layout.
        *   **Centrado:** La clase `.container` centra el contenido principal de la página, proporcionando un eje visual claro.
        *   **Flexbox:** El mixin `+flex-center` se utiliza para alinear elementos de manera consistente.

*   **Proximidad:** Agrupamos elementos relacionados visualmente mediante el espaciado, haciéndolos percibir como un todo.
    *   **Aplicación:**
        *   **Espaciado:** Las variables de espaciado (`$spacing-1` a `$spacing-24`) se utilizan para controlar las distancias entre elementos relacionados, como los `margin-bottom` de párrafos y títulos.
        *   **Elementos Agrupados:** Los formularios o grupos de botones compartirán un espaciado consistente para indicar su relación.

*   **Repetición:** Creamos coherencia y un sentido de unidad repitiendo patrones visuales, como estilos de botones, tipografías y espaciados.
    *   **Aplicación:**
        *   **Design Tokens:** El uso consistente de las variables de color, tipografía y espaciado garantiza que el mismo estilo se aplique de la misma manera en todo el proyecto.
        *   **Mixins:** Los mixins (`+font-style`, `+flex-center`) promueven la reutilización de patrones CSS, asegurando una apariencia unificada.
        *   **Estilos Base:** Los estilos definidos en `_base.sass` para `h1`-`h6`, `p`, `a` y `button` establecen un lenguaje visual consistente para los elementos HTML básicos.

---

### 1.2 Metodología CSS: BEM (Bloque, Elemento, Modificador)

Se recomienda el uso de la metodología BEM (Block, Element, Modifier) para la nomenclatura de clases CSS. BEM proporciona una estructura modular, escalable y fácil de entender, lo que facilita la colaboración y el mantenimiento del código.

*   **Bloque (`.block`)**: Componente independiente con significado propio. Ejemplos: `.card`, `.header`, `.button`.
*   **Elemento (`.block__element`)**: Parte de un bloque que no tiene significado independiente fuera de él. Ejemplos: `.card__title`, `.header__logo`, `.button__icon`.
*   **Modificador (`.block--modifier` o `.block__element--modifier`)**: Bandera en un bloque o elemento que cambia su apariencia o comportamiento. Ejemplos: `.button--primary`, `.card--featured`, `.button__icon--large`.

**Ejemplos de Nomenclatura BEM:**

```html
<!-- Bloque: card -->
<div class="card card--featured">
  <h2 class="card__title">Título de la tarjeta</h2>
  <p class="card__description">Descripción del contenido.</p>
  <button class="button button--primary card__button">Ver más</button>
</div>

<!-- Bloque: nav -->
<nav class="main-nav">
  <ul class="main-nav__list">
    <li class="main-nav__item">
      <a href="#" class="main-nav__link main-nav__link--active">Inicio</a>
    </li>
    <li class="main-nav__item">
      <a href="#" class="main-nav__link">Productos</a>
    </li>
  </ul>
</nav>
```

---

### 1.3 Organización de Archivos: ITCSS (Inverted Triangle CSS)

La estructura de archivos CSS sigue la metodología ITCSS (Inverted Triangle CSS), que organiza el código de estilos de menor a mayor especificidad y de general a específico. Esto ayuda a gestionar la cascada de CSS y a prevenir la sobreescritura innecesaria de estilos.

El orden es crítico:

1.  **`00-settings/`**: Contiene variables, funciones y configuraciones globales del proyecto (Ej: `_variables.sass`). Estos archivos tienen una especificidad muy baja.
2.  **`01-tools/`**: Contiene mixins y funciones reutilizables (Ej: `_mixins.sass`). Estos no añaden CSS directamente, sino que se usan en otros lugares.
3.  **`02-generic/`**: Contiene estilos muy genéricos y de bajo nivel, como el reset CSS o normalizaciones de box-sizing (Ej: `_reset.sass`).
4.  **`03-elements/`**: Estilos para elementos HTML base sin clases (Ej: `_base.sass` para `h1`, `p`, `a`, `img`).
5.  **`04-layout/`**: Estilos para el layout principal del sitio, como el sistema de rejilla o la estructura de secciones mayores (Ej: `_layout.sass`).
6.  **`05-components/`**: Estilos para componentes de UI reutilizables (Ej: `_button.sass`, `_card.sass`). Aquí se aplica BEM.
7.  **`06-utilities/`**: Clases de ayuda con un solo propósito y con `!important` para sobrescribir (Ej: `.u-hidden`, `.u-text-center`).
8.  **`07-pages/`**: Estilos específicos de páginas, que sobrescriben componentes o layouts solo en contextos específicos.
9.  **`08-vendors/`**: Estilos de librerías o frameworks de terceros (Ej: CSS de un carousel, estilos de un plugin).

**Árbol de Carpetas Completo:**

```
src/styles/
├── 00-settings/
│   └── _variables.sass
├── 01-tools/
│   └── _mixins.sass
├── 02-generic/
│   └── _reset.sass
├── 03-elements/
│   └── _base.sass
├── 04-layout/
│   └── _layout.sass
├── 05-components/
│   ├── (Archivos .sass para componentes BEM, ej. _button.sass)
│   └── ...
├── 06-utilities/
│   ├── (Archivos .sass para clases de utilidad, ej. _helpers.sass)
│   └── ...
├── 07-pages/
│   ├── (Archivos .sass para estilos específicos de página, ej. _home.sass)
│   └── ...
├── 08-vendors/
│   ├── (Archivos .sass para estilos de terceros, ej. _swiper.sass)
│   └── ...
└── styles.sass // Archivo principal que importa todo en orden
```

---

### 1.4 Sistema de Design Tokens

Los Design Tokens son la única fuente de verdad para los valores de diseño (colores, tipografías, espaciados, etc.), definidos en `00-settings/_variables.sass` como **CSS Custom Properties** (variables CSS nativas). Esto asegura consistencia, facilita cambios globales, mejora la escalabilidad del diseño y permite modificaciones dinámicas en tiempo de ejecución.

*   **Colores:**
    *   **Paleta Completa:** Definimos colores primarios (`--primary-blue`, `--primary-blue-alt`, `--primary-blue-light`), secundarios (`--secundary-yellow`, `--secundary-yellow-alt`, `--secundary-yellow-dark`), neutrales (escalas de grises `--gray-50` a `--gray-900`) y semánticos (`--success`, `--error`).
    *   **Decisión:** Esta paleta permite una expresión de marca rica, un manejo claro de los estados de interfaz (éxito, error) y una jerarquía visual a través de los grises para textos y fondos. El uso de CSS Custom Properties permite cambios dinámicos de tema y personalización en runtime.

*   **Tipografía:**
    *   **Escala Tipográfica:** Definimos `--font-primary` (Open Sans) y `--font-secondary` (Montserrat) para las familias, y una escala de tamaños (`--text-xs` a `--text-5xl`) basada en una escala modular. También se incluyen pesos (`--font-light` a `--font-bold`) y alturas de línea (`--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`).
    *   **Decisión:** La escala modular asegura una relación armónica entre los diferentes tamaños de texto. Las familias de fuentes se eligen por su legibilidad y su alineación con la identidad de marca del proyecto. Los pesos y alturas de línea garantizan la legibilidad en diferentes contextos.

*   **Sistema de Espaciado:**
    *   **Escala Basada en 0.25rem (4px):** Definimos una escala de espaciado desde `--spacing-1` (0.25rem) hasta `--spacing-24` (6rem).
    *   **Decisión:** Un sistema de espaciado basado en una unidad consistente (4px) promueve la alineación vertical y horizontal, reduce la necesidad de valores arbitrarios y garantiza una interfaz ordenada y predecible.

*   **Breakpoints Genéricos:**
    *   **Definición:** `$breakpoint-sm` (640px), `$breakpoint-md` (768px), `$breakpoint-lg` (1024px), `$breakpoint-xl` (1280px).
    *   **Decisión:** Estos breakpoints cubren los tamaños de pantalla más comunes para dispositivos móviles grandes, tablets, desktops y desktops grandes, permitiendo un diseño responsive eficaz.

*   **Elevaciones (Sombras):**
    *   **Definición:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` con diferentes intensidades y transparencia `rgba`.
    *   **Decisión:** Las sombras añaden profundidad y jerarquía visual, indicando interactividad o prominencia de un elemento. Usar `rgba` permite que las sombras se mezclen bien con cualquier color de fondo.

*   **Bordes y Radios:**
    *   **Definición:** Grosores de borde (`--border-thin`, `--border-medium`, `--border-thick`) y radios de borde (`--radius-sm` a `--radius-full`).
    *   **Decisión:** La consistencia en el grosor de los bordes y el redondeo de las esquinas contribuye a la identidad visual del proyecto y mejora la experiencia táctil en interfaces interactivas.

*   **Transiciones:**
    *   **Definición:** Duraciones estándar (`--transition-fast`, `--transition-base`, `--transition-slow`) con una función de temporización `ease-in-out`.
    *   **Decisión:** Las transiciones suaves mejoran la experiencia de usuario, haciendo que las interacciones sean más agradables y menos abruptas. Las duraciones estandarizadas aseguran coherencia.

---

### 1.5 Componentes y Elementos Definidos en _base.sass

El archivo `03-elements/_base.sass` define los estilos base de la aplicación, incluyendo:

*   **Estilos Globales del Body:** Configuración tipográfica, color de fondo y texto principal usando CSS Custom Properties.

*   **Cards de Productos (`.product-card`):** Componente reutilizable con:
    - Estructura Flexbox con gap para espaciado interno
    - Estados hover con transiciones suaves
    - Contenedor de imagen con aspect ratio controlado
    - Información del producto bien estructurada (nombre, precio, unidad, tienda)
    - Variables de diseño para colores, bordes, sombras y espaciados

*   **Botones (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`):** Sistema de botones con estados hover y active, usando tipografía secundaria y transformaciones suaves.

*   **Formularios (`input`, `select`, `textarea`, `label`):** Estilos consistentes con focus states y placeholders personalizados.

*   **Modal (`.modal`, `.modal-overlay`, `.modal-header`, `.modal-body`, `.modal-footer`):** Sistema de ventanas modales con overlay, cabecera, cuerpo y pie de página.

*   **Grid de Productos (`.products-grid`):** Sistema de grilla responsive con auto-fill que se adapta a diferentes breakpoints.

*   **Tipografía (`h1`-`h6`, `p`, `a`):** Jerarquía tipográfica completa usando la escala modular definida en variables.

*   **Utilidades:** Clases auxiliares para espaciado, texto, flexbox, display, bordes y sombras que complementan los componentes principales.

*   **Scrollbar Personalizado:** Estilos custom para la barra de desplazamiento que mantienen la coherencia visual.

---

### 1.6 Mixins y Funciones

Los mixins definidos en `01-tools/_mixins.sass` promueven la reutilización del código, la consistencia y reducen la duplicación. El proyecto cuenta con 10 mixins especializados:

#### Mixins de Layout y Utilidades

*   **`+responsive-prop($property, $small, $medium, $large)`:**
    *   **Propósito:** Aplica diferentes valores a una propiedad CSS según los breakpoints definidos.
    *   **Ejemplo:**
        ```sass
        .mi-componente
          +responsive-prop(padding, var(--spacing-2), var(--spacing-4), var(--spacing-6))
        ```

*   **`+flex-center`:**
    *   **Propósito:** Centra contenido horizontal y verticalmente con flexbox.
    *   **Ejemplo:**
        ```sass
        .contenedor-centrado
          +flex-center
        ```

*   **`+font-style($size, $weight, $line-height)`:**
    *   **Propósito:** Aplica estilos tipográficos consistentes usando CSS Custom Properties.
    *   **Ejemplo:**
        ```sass
        .titulo-seccion
          +font-style(var(--text-3xl), var(--font-semibold), var(--line-height-tight))
        ```

#### Mixins de Transiciones y Efectos

*   **`+smooth-transition($properties...)`:**
    *   **Propósito:** Aplica transiciones suaves a una o más propiedades con duración y easing consistentes.
    *   **Ejemplo:**
        ```sass
        .mi-elemento
          +smooth-transition(color, background-color, border-color)
        ```

*   **`+hover-lift`:**
    *   **Propósito:** Añade efecto de elevación en hover (desplazamiento y sombra).
    *   **Ejemplo:**
        ```sass
        .card-interactiva
          +hover-lift
        ```

#### Mixins de Estilo Base

*   **`+border-style($color, $width: var(--border-medium))`:**
    *   **Propósito:** Aplica bordes consistentes con el sistema de diseño.
    *   **Ejemplo:**
        ```sass
        .mi-card
          +border-style(var(--primary-blue-light))
        ```

*   **`+button-base`:**
    *   **Propósito:** Aplica todos los estilos base compartidos por botones (padding, tipografía, transiciones, estados hover/active).
    *   **Uso:** Se aplica en la clase `.btn` y todos los botones heredan estos estilos.
    *   **Ejemplo:**
        ```sass
        .btn
          +button-base
        ```

*   **`+input-base`:**
    *   **Propósito:** Aplica estilos base para inputs, selects y textareas (bordes, colores, estados focus, placeholders).
    *   **Uso:** Se aplica globalmente a todos los elementos de formulario.
    *   **Ejemplo:**
        ```sass
        input, select, textarea
          +input-base
        ```

*   **`+card-base`:**
    *   **Propósito:** Aplica estilos base para cards (fondo, bordes, transiciones, estado hover).
    *   **Uso:** Se usa en `.product-card` y otros componentes de tipo card.
    *   **Ejemplo:**
        ```sass
        .product-card
          +card-base
        ```

#### Ventajas del Sistema de Mixins

*   **DRY (Don't Repeat Yourself):** Elimina duplicación de código CSS.
*   **Consistencia:** Garantiza que elementos similares se vean y comporten igual.
*   **Mantenibilidad:** Cambios en el mixin se propagan a todos los usos.
*   **Escalabilidad:** Facilita añadir nuevos componentes siguiendo los patrones establecidos

---

### 1.7 ViewEncapsulation en Angular

Angular, por defecto, utiliza la estrategia de `ViewEncapsulation.Emulated`.

*   **`ViewEncapsulation.Emulated` (Predeterminado):** Angular simula el comportamiento de los Shadow DOM, pero lo hace con CSS puro. Esto significa que los estilos definidos en un componente son aplicados solo a la vista de ese componente, añadiendo atributos únicos (`_ngcontent-cXX`) a los selectores CSS. Los estilos del componente **no se filtran** al resto de la aplicación y los estilos globales **sí pueden afectar** al componente.
*   **`ViewEncapsulation.None`:** Los estilos definidos en el componente se convierten en estilos globales de la aplicación, afectando a todos los componentes.
*   **`ViewEncapsulation.ShadowDom`:** Utiliza la implementación nativa del navegador de Shadow DOM, aislando completamente los estilos del componente.

**Decisión:** Mantendremos la estrategia por defecto de **`ViewEncapsulation.Emulated`**.

**Justificación:**
Esta decisión se basa en la necesidad de un equilibrio entre aislamiento de componentes y flexibilidad.
*   **Aislamiento de Componentes:** `Emulated` previene que los estilos de un componente afecten accidentalmente a otros componentes, lo que reduce los conflictos CSS y facilita el desarrollo modular.
*   **Flexibilidad con Estilos Globales:** Permite que los estilos globales definidos en `styles.sass` (variables, mixins, reset, estilos base y de layout) se apliquen y establezcan el foundation visual de toda la aplicación. Esto es crucial para un sistema de diseño consistente.
*   **Compatibilidad:** `Emulated` es la opción más compatible con todos los navegadores, ya que no depende de la implementación nativa del Shadow DOM.
*   **Mantenimiento:** Facilita la gestión del CSS, ya que los estilos de componentes están contenidos, y los estilos globales se manejan a través de la arquitectura ITCSS, que está diseñada para una especificidad controlada.
