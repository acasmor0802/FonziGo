src/
├── styles/                              # ITCSS Global
│   ├── 00-settings/
│   │   └── _variables.sass              # ✅ Global - Custom properties
│   ├── 01-tools/
│   │   └── _mixins.sass                 # ✅ Global - Se importa con @use
│   ├── 02-generic/
│   │   └── _reset.sass                  # ✅ Global
│   ├── 03-elements/
│   │   └── _base.sass                   # ✅ Global
│   ├── 04-objects/
│   │   └── _layouts.sass                # ✅ Global
│   ├── 05-components/
│   │   ├── _header.sass                 # ✅ Global - Layout único
│   │   ├── _footer.sass                 # ✅ Global - Layout único
│   │   └── _buttons.sass                # ✅ Global - Simples y reutilizables
│   ├── 06-utilities/
│   │   └── _helpers.sass                # ✅ Global
│   └── main.scss                        # Punto de entrada
│
├── app/
│   ├── layout/
│   │   ├── header/
│   │   │   ├── header.component.ts      # ViewEncapsulation.None
│   │   │   ├── header.component.html
│   │   │   └── header.component.sass    # Vacío - estilos en global
│   │   └── footer/
│   │       └── ...                      # ViewEncapsulation.None
│   │
│   ├── components/
│   │   ├── card/
│   │   │   ├── card.component.ts        # ViewEncapsulation.Emulated (default)
│   │   │   ├── card.component.html
│   │   │   └── card.component.sass      # ✅ Encapsulado - Usa variables globales
│   │   └── modal/
│   │       ├── modal.component.ts       # ViewEncapsulation.Emulated
│   │       ├── modal.component.html
│   │       └── modal.component.sass     # ✅ Encapsulado
│   │
│   └── pages/
│       └── ...
│
└── styles.sass                          # @use 'styles/main'

FASE 1: FUNDAMENTOS Y ARQUITECTURA CSS
Criterios: RA1.a, RA2.a, RA2.c, RA1.f Entrega: 18 de diciembre

OBJETIVOS DE LA FASE
En esta fase establecerás los cimientos técnicos de todo tu sistema de estilos. No se trata solo de escribir CSS, sino de crear una arquitectura escalable que permita mantener y hacer crecer tu proyecto sin que se convierta en caos.

Definirás un sistema de design tokens (variables SCSS) que sean la única fuente de verdad para colores, tipografías, espaciados y demás propiedades visuales. Organizarás tus archivos siguiendo una metodología profesional (ITCSS), crearás mixins reutilizables que te ahorren código repetitivo, y documentarás todo para que cualquiera entienda cómo funciona el sistema.

TAREAS
1. Sistema de Design Tokens en SCSS
Crea la carpeta src/styles/00-settings/ y dentro el archivo _variables.scss con todas tus variables:

Variables de color: Define tu paleta completa. Necesitas colores primarios (el color principal de tu marca), secundarios (color de apoyo), neutrales (grises del 50 al 900 para textos y fondos), y semánticos (success verde, error rojo, warning naranja, info azul).

Escala tipográfica: Define las fuentes que usarás y los tamaños. La escala debe ser coherente (usa una escala modular, por ejemplo con ratio 1.25). Necesitas definir familias (font-primary para texto, font-secondary si usas otra para títulos), tamaños desde xs hasta 5xl, pesos (light, regular, medium, semibold, bold), y line-heights (tight para títulos, normal para párrafos, relaxed para textos largos).

Sistema de espaciado: Crea una escala basada en 4px u 8px. Define spacing-1 (0.25rem), spacing-2 (0.5rem), spacing-3 (0.75rem), spacing-4 (1rem), spacing-5 (1.25rem), y así hasta spacing-24 (6rem). Esto te permite mantener consistencia en márgenes y paddings.

Breakpoints genéricos: Define los puntos de quiebre para responsive. Usa al menos: sm (640px para móvil grande), md (768px para tablet), lg (1024px para desktop), xl (1280px para desktop grande).

Elevaciones (sombras): Define sombras de diferentes intensidades: shadow-sm (sombra sutil), shadow-md (sombra media), shadow-lg (sombra grande), shadow-xl (sombra muy grande). Usa rgba con transparencia para que funcionen en cualquier fondo.

Bordes y radios: Define grosores de borde (thin 1px, medium 2px, thick 4px) y radios de borde (desde sm 2px hasta full 9999px para círculos).

Transiciones: Define duraciones estándar: fast (150ms para cambios rápidos), base (300ms para la mayoría), slow (500ms para transiciones complejas). Usa ease-in-out para transiciones suaves.

2. Mixins y funciones útiles
Crea la carpeta src/styles/01-tools/ y dentro el archivo _mixins.scss, con al menos 3 mixins reutilizables.

3. Organización de archivos ITCSS
Crea la estructura completa de carpetas en src/styles/.
En styles.scss importa todo en orden
Importante: Este orden es crítico. Las variables primero, luego mixins, luego reset, y así sucesivamente aumentando la especificidad.

4. Reset CSS
En 02-generic/_reset.scss crea un reset básico. Puedes usar un reset existente como Normalize.css o crear el tuyo propio.

5. Estilos base de elementos
En 03-elements/ define estilos base para elementos HTML sin clases:

6. Sistema de Grid
En 04-layout/_layout.scss crea un sistema de grid básico usando CSS Grid. También puedes usar Flex y otros métodos de Layout.

7. Documentación en DOCUMENTACION.md
Crea el archivo docs/design/DOCUMENTACION.md y escribe la Sección 1: Arquitectura CSS y comunicación visual.

Esta sección debe incluir:

1.1 Principios de comunicación visual: Explica los 5 principios básicos y cómo los aplicas en tu proyecto:

Jerarquía: Cómo usas tamaños, pesos y espaciado para crear importancia visual
Contraste: Cómo usas color, tamaño y peso para diferenciar elementos
Alineación: Tu estrategia de alineación (izquierda, centro, grid)
Proximidad: Cómo agrupas elementos relacionados con espaciado
Repetición: Cómo creas coherencia repitiendo patrones visuales
Incluye capturas de pantalla de tu diseño de Figma señalando dónde aplicas cada principio.

1.2 Metodología CSS: Explica qué metodología usas (BEM recomendado) y por qué. Muestra ejemplos de tu nomenclatura. Si usas BEM, explica que usarás bloques (.card), elementos (.card__title), y modificadores (.card--featured).

1.3 Organización de archivos: Documenta tu estructura ITCSS. Explica por qué cada carpeta está en ese orden (de menor a mayor especificidad). Muestra el árbol de carpetas completo.

1.4 Sistema de Design Tokens: Documenta todas tus variables. Para cada grupo (colores, tipografía, espaciado, etc.) explica las decisiones:

Por qué elegiste esos colores
Por qué esa escala tipográfica
Por qué esos breakpoints
1.5 Mixins y funciones: Documenta cada mixin que creaste, para qué sirve, y muestra un ejemplo de uso.

1.6 ViewEncapsulation en Angular: Explica qué estrategia de encapsulación usarás. Angular por defecto usa Emulated (estilos encapsulados por componente). Documenta si mantendrás esto o usarás None (estilos globales). Justifica tu decisión.

ENTREGABLES FASE 1
Carpeta src/styles/ con estructura ITCSS completa
Archivo _variables.scss con todos los design tokens
Archivo _mixins.scss con mixins reutilizables
Reset CSS implementado
Estilos base de elementos HTML
Sistema de grid básico
Sección 1 del docs/design/DOCUMENTACION.md completada con capturas

FASE 2: HTML SEMÁNTICO Y COMPONENTES DE LAYOUT
Criterios: RA2.f, RA2.a
Entrega: 18 de diciembre

OBJETIVOS DE LA FASE
En esta fase crearás la estructura semántica de tu aplicación y los componentes de layout que enmarcan todo el contenido. No estamos haciendo páginas completas todavía, sino construyendo los "contenedores principales" que se usarán en toda la aplicación: el header, el footer, la navegación principal, y cualquier sidebar o estructura fija.

Estos componentes de layout son especiales porque aparecen en (casi) todas las páginas y definen la estructura general. Un header bien hecho se usa igual en home, en listados, en detalle. Por eso es crítico hacerlos bien desde el principio, con HTML semántico impecable y pensando en que sean reutilizables.

TAREAS
1. Componentes de layout semánticos
Crea los siguientes componentes usando ng generate component components/layout/nombre-componente:

Header (app-header): Usa la etiqueta semántica <header>. Debe incluir logo (enlace a home), navegación principal (<nav>), y elementos de utilidad según tu aplicación (búsqueda, usuario, carrito, etc.).

Main (app-main): Usa <main>. Este componente actúa como contenedor del contenido principal. Usa <ng-content></ng-content> para proyectar contenido dentro del componente.

Footer (app-footer): Usa <footer>. Incluye enlaces legales (términos, privacidad, cookies), enlaces a redes sociales, y copyright.

2. Componentes funcionales HTML semántico
Crea un componente form-input reutilizable usando ng generate component components/shared/form-input.

Este componente debe poder usarse para cualquier tipo de input (text, email, password, etc.). El HTML debe incluir: - Label siempre asociado al input mediante atributos for (en label) e id (en input), o como hemos visto en clase. - Input con los atributos necesarios (type, name, placeholder, required) - Indicador visual de campo requerido (asterisco) - Mensaje de error opcional - Texto de ayuda opcional

3. Formularios estructurados
Crea un formulario completo (login, registro o contacto según tu aplicación) usando ng generate component components/shared/nombre-form.

El formulario debe usar: - <form> con método apropiado - <fieldset> para agrupar campos relacionados - <legend> para describir el grupo de campos - Tus componentes <app-form-input> para los campos - Botón de submit con texto descriptivo

4. Estilos de componentes de layout
Para cada componente de layout, crea sus estilos siguiendo BEM en su archivo .scss correspondiente.

Los componentes de layout normalmente necesitan: - Ancho completo o max-width contenido - Padding lateral consistente - Flex o Grid para distribución interna - Z-index si son sticky o fixed - Transiciones para interacciones

Usa las variables SCSS que definiste en Fase 1 (spacing, colores, etc.).

5. CSS Custom Properties para temas
En src/styles/00-settings/ crea un nuevo archivo _css-variables.scss:

Define variables CSS (Custom Properties) en :root para los valores que cambiarán con el tema: - Colores de fondo (bg-primary, bg-secondary) - Colores de texto (text-primary, text-secondary) - Color de borde

Usa la sintaxis #{$variable-scss} para convertir tus variables SCSS a valores CSS.

Importa este archivo en styles.scss después de las variables SCSS.

6. Documentación en DOCUMENTACION.md
Añade la Sección 2: HTML semántico y estructura a tu archivo docs/DOCUMENTACION.md.

Esta sección debe incluir:

2.1 Elementos semánticos utilizados: Explica qué elementos semánticos usas y cuándo: header, nav, main, article, section, aside, footer. Muestra ejemplos de tu código.

2.2 Jerarquía de headings: Documenta tu estrategia de headings (h1 a h6). Reglas: solo un h1 por página, h2 para secciones principales, h3 para subsecciones. NUNCA saltes niveles. Muestra un diagrama de tu jerarquía.

2.3 Estructura de formularios: Muestra tu estructura de formularios explicando el uso de fieldset, legend, y la asociación de labels con inputs (for e id) o como hemos visto en clase. Incluye un ejemplo de código de tu componente form-input.

ENTREGABLES FASE 2
Componentes layout: header, main, footer con HTML semántico
Componente form-input reutilizable
Un formulario completo estructurado
Estilos SCSS para todos los componentes siguiendo BEM
CSS Custom Properties básicas en _variables.sass
Sección 2 del docs/design/DOCUMENTACION.md completada


FASE 3: COMPONENTES UI BÁSICOS
Criterios: RA2.g, RA2.e, RA2.f, RA1.f

Entrega: 18 de diciembre

OBJETIVOS DE LA FASE
En esta fase crearás los componentes UI básicos que se reutilizarán en toda tu aplicación: botones, cards, elementos de formulario adicionales, navegación responsive, y elementos de feedback. Estos son los "bloques de construcción" que luego combinarás para crear páginas completas.

La clave aquí es que cada componente debe tener todas sus variantes, todos sus tamaños, y todos sus estados (hover, focus, active, disabled). Un botón bien hecho no es solo un rectángulo azul, es un sistema completo: botón primary, secondary, ghost; tamaños small, medium, large; estados normal, hover, focus, active, disabled.

También crearás un Style Guide: una página especial donde muestras TODOS tus componentes con TODAS sus variantes. Esto sirve como documentación visual y para testing rápido.

TAREAS
1. Botones (app-button)
Crea el componente usando ng generate component components/shared/button.

Debe soportar:

Variantes (modificadores BEM): - .button--primary (color principal, para acciones principales) - .button--secondary (color secundario, para acciones secundarias) - .button--ghost (sin fondo, solo texto y borde opcional) - .button--danger (rojo, para acciones destructivas como eliminar)

Tamaños: - .button--sm (pequeño) - .button--md (mediano, por defecto) - .button--lg (grande)

Estados CSS: - :hover (cambio al pasar el mouse) - :focus (outline visible para navegación con teclado) - :active (efecto al hacer clic) - [disabled] o .button--disabled (botón no clickeable, opacidad reducida)

2. Cards (app-card)
Crea el componente usando ng generate component components/shared/card.

Crea al menos dos variantes:

Variante básica: - Imagen (opcional) - Título - Descripción - Botón de acción (opcional)

Variante horizontal (OPCIONAL): - Imagen a la izquierda - Contenido a la derecha

Debe incluir estados hover con transiciones (elevación de sombra, transformación).

3. Elementos de formulario adicionales
Además del form-input de Fase 2, crea:

Textarea (OBLIGATORIO): ng generate component components/shared/form-textarea

Similar a form-input pero con <textarea> en lugar de <input>.

Select (OBLIGATORIO): ng generate component components/shared/form-select

Dropdown con <select> y <option>. Debe incluir label asociado.

Checkbox (OPCIONAL): ng generate component components/shared/form-checkbox

Input tipo checkbox con label asociado.

Radio buttons (OPCIONAL): ng generate component components/shared/form-radio-group

Grupo de radio buttons del mismo name.

4. Navegación responsive
Menú hamburguesa en header:

Añade a tu componente header de Fase 2: - Botón hamburguesa (visible solo en mobile) - Menú que se muestra/oculta al hacer clic - Navegación horizontal en desktop - Transiciones suaves

Breadcrumbs (OPCIONAL): ng generate component components/shared/breadcrumbs

Navegación de migas de pan con lista ordenada mostrando la ruta actual.

5. Elementos de feedback
Alerts (OBLIGATORIO): ng generate component components/shared/alert

Tipos mediante modificadores BEM: - .alert--success (verde, para confirmaciones) - .alert--error (rojo, para errores) - .alert--warning (naranja, para advertencias) - .alert--info (azul, para información)

Debe poder cerrarse (botón X opcional).

Notificaciones/Toast (OPCIONAL): ng generate component components/shared/notification

Similar a alert pero con posición fixed (esquina de pantalla) y animaciones de entrada/salida.

6. Componentes adicionales (OPCIONALES - elige según tiempo)
Si terminas lo obligatorio y tienes tiempo, añade 1-3 de estos:

Modales: ng generate component components/shared/modal

Ventana superpuesta con overlay oscuro. Debe poder cerrarse con botón X y tecla ESC.

Tablas responsive: ng generate component components/shared/data-table

Tabla que en mobile se adapta (cards o scroll horizontal).

Badges: ng generate component components/shared/badge

Pequeñas etiquetas para estados, categorías, contadores.

Tabs: ng generate component components/shared/tabs

Sistema de pestañas para organizar contenido.

Paginación: ng generate component components/shared/pagination

Controles de paginación (anterior, siguiente, números de página).

Sistema de iconos:

Integra una librería de iconos (Heroicons, Font Awesome, Material Icons, Feather Icons) o crea componentes SVG propios.

7. Style Guide
Crea una página especial para mostrar todos tus componentes.

ng generate component pages/style-guide

En el HTML muestra: - TODOS los componentes creados - TODAS las variantes de cada componente - TODOS los tamaños - TODOS los estados

Organiza por secciones: Botones, Cards, Formularios, Navegación, Feedback, etc.

Añade una ruta en tu router de Angular para acceder a /style-guide.

8. Documentación en DOCUMENTACION.md
Añade la Sección 3: Sistema de componentes UI a tu archivo docs/DOCUMENTACION.md.

Esta sección debe incluir:

3.1 Componentes implementados: Lista TODOS los componentes creados. Para cada uno documenta: - Nombre del componente - Propósito - Variantes disponibles - Tamaños disponibles - Estados que maneja - Ejemplo de uso (código)

3.2 Nomenclatura y metodología: Muestra ejemplos reales de tu nomenclatura BEM aplicada en los componentes. Explica tu estrategia: qué es block vs element, cuándo usas modificadores vs clases de estado.

3.3 Style Guide: Incluye capturas de pantalla de tu página de Style Guide mostrando los componentes. Explica para qué sirve (documentación visual, testing, referencia).

ENTREGABLES FASE 3
5 componentes obligatorios: botones, cards, textarea, select, alerts
Navegación responsive (menú hamburguesa funcional)
Componentes adicionales opcionales (según tiempo)
Archivo SCSS por cada componente siguiendo BEM
Style Guide funcional en /style-guide
Sección 3 del docs/design/DOCUMENTACION.md completada con capturas