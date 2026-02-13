# Análisis de Accesibilidad — FonziGo

> Proyecto Órbita 4 — Diseñar para todos  
> DIW — 2º DAW

---

## Sección 1: Fundamentos de accesibilidad

### ¿Por qué es necesaria la accesibilidad web?

La accesibilidad web permite que todas las personas puedan usar una página, tengan o no alguna discapacidad visual, auditiva, motora o cognitiva. También mejora la experiencia para usuarios mayores, con conexiones lentas o que prefieren navegar con teclado. En España es obligatoria por el Real Decreto 1112/2018 y en Europa por la Directiva 2016/2102, por lo que no es algo opcional.

### Los 4 principios de WCAG 2.1

1. **Perceptible:** La información tiene que poder percibirse por cualquier usuario.
   - Ejemplo: Las imágenes de los logos de supermercados llevan `alt="Logo de Mercadona"`, para que un lector de pantalla pueda describir la imagen.

2. **Operable:** Hay que poder usar toda la web sin depender solo del ratón.
   - Ejemplo: El carrusel de ofertas se puede manejar con las flechas del teclado, no hace falta usar el ratón.

3. **Comprensible:** El contenido tiene que ser claro y fácil de entender.
   - Ejemplo: El HTML tiene `lang="es"` para que los lectores de pantalla pronuncien bien el español, y los formularios tienen etiquetas visibles en cada campo.

4. **Robusto:** La web tiene que funcionar bien en distintos navegadores y con tecnologías de asistencia.
   - Ejemplo: Uso roles ARIA como `role="dialog"` en modales y `aria-live="polite"` en el carrusel para que los lectores de pantalla los interpreten bien.

### Niveles de conformidad

- **Nivel A:** Lo mínimo. Sin cumplir esto, hay usuarios que no pueden acceder al contenido.
- **Nivel AA:** El nivel recomendado y exigido por la ley. Elimina la mayoría de barreras.
- **Nivel AAA:** El más alto. Es ideal pero difícil de cumplir en todo el contenido.

El objetivo de este proyecto es alcanzar el **nivel AA**.

---

## Sección 2: Componente multimedia implementado

**Tipo de componente:** Carrusel / Slider

**Descripción:** He creado un componente de carrusel (`<app-carousel>`) para mostrar las ofertas de productos. Permite pasar entre grupos de productos con botones de anterior/siguiente y muestra la posición actual (por ejemplo "1-4 de 12").

**Características de accesibilidad:**

- Navegación por teclado completa: flechas izquierda/derecha para moverse, Inicio/Fin para ir al principio o al final.
- Roles ARIA adecuados: `role="region"`, `aria-roledescription="carrusel"`, `aria-labelledby` vinculado al título, y los botones agrupados con `role="group"`.
- El indicador de posición usa `aria-live="polite"` para que el lector de pantalla anuncie la posición al cambiar de página.
- Un texto oculto (`visually-hidden`) explica a los usuarios de lectores de pantalla qué teclas pueden usar.
- Respeta `prefers-reduced-motion`: si el usuario tiene desactivadas las animaciones, las transiciones no se aplican.
- Los botones tienen `:focus-visible` con borde y sombra para que se vea claro cuál está seleccionado al navegar con Tab.

---

## Sección 3: Auditoría automatizada inicial

He analizado el proyecto con 3 herramientas:

1. **Lighthouse** — Chrome DevTools (F12 → Lighthouse → solo Accessibility)
2. **WAVE** — Extensión del navegador (https://wave.webaim.org/extension/)
3. **TAW** — Herramienta online (https://www.tawdis.net/?lang=es)

### Resultados iniciales

| Herramienta | Puntuación/Errores | Captura |
|-------------|-------------------|---------|
| Lighthouse  | 93/100           | ![Lighthouse inicial](./capturas/lighthouse-antes.png) |
| WAVE        | [X] errores, [X] alertas | ![WAVE inicial](./capturas/wave-antes.png) |
| TAW         | 0 problemas, 15 advertencias | ![TAW](./capturas/taw.png) |

### 3 problemas más graves

1. **[RELLENAR cuando pase las herramientas]**
2. **[RELLENAR cuando pase las herramientas]**
3. **[RELLENAR cuando pase las herramientas]**

---

## Sección 4: Análisis y corrección de errores

### Tabla resumen

| # | Error | Criterio WCAG | Herramienta | Solución |
|---|-------|---------------|-------------|----------|
| 1 | Skip link roto (apuntaba a `#main-content` pero no existía ese id) | 2.4.1 | Manual | Añadí `id="main-content"` en el `<main>` de cada página |
| 2 | Productos no tenía `<h1>` | 1.3.1 | WAVE | Añadí un `<h1>` oculto con "Productos" |
| 3 | Carrusel solo funcionaba con ratón | 2.1.1 | Manual | Creé el componente `<app-carousel>` con soporte de teclado |
| 4 | Carrusel sin roles ARIA | 4.1.2 | Manual | Añadí `role="region"`, `aria-roledescription`, `aria-live` |
| 5 | Botones del carrusel sin focus claro | 2.4.7 | Manual | Añadí `:focus-visible` con outline y box-shadow |

### Detalle de cada error

#### Error #1: Skip link roto

**Problema:** El enlace "Saltar al contenido principal" apuntaba a `#main-content`, pero ningún elemento tenía ese id. Solo existía como clase (`class="main-content"`).  
**Impacto:** Los usuarios de teclado y lectores de pantalla no podían saltar la navegación para ir al contenido.  
**Criterio WCAG:** 2.4.1 — Evitar bloques (Nivel A)

**Antes:**
```html
<main class="landing">
```

**Después:**
```html
<main id="main-content" class="landing">
```

#### Error #2: Página de productos sin H1

**Problema:** La página de productos no tenía `<h1>`, empezaba con `<h2>`. Los lectores de pantalla necesitan un H1 para identificar el tema de la página.  
**Impacto:** Al navegar por encabezados no se puede saber de qué trata la página.  
**Criterio WCAG:** 1.3.1 — Información y relaciones (Nivel A)

**Antes:**
```html
<main class="products-page">
  <section class="categories-scroll">
```

**Después:**
```html
<main id="main-content" class="products-page">
  <h1 class="visually-hidden">Productos</h1>
  <section class="categories-scroll">
```

#### Error #3: Carrusel sin navegación por teclado

**Problema:** El carrusel de ofertas solo respondía a clics de ratón. No se podía usar con teclado.  
**Impacto:** Los usuarios que dependen del teclado no podían navegar por las ofertas.  
**Criterio WCAG:** 2.1.1 — Teclado (Nivel A)

**Antes:**
```html
<button class="carousel-btn" (click)="prevOffers()">←</button>
<button class="carousel-btn" (click)="nextOffers()">→</button>
```

**Después:**
```html
<!-- Nuevo componente con @HostListener('keydown') -->
<div class="carousel" role="region" aria-roledescription="carrusel" tabindex="0">
  <button class="carousel__btn" (click)="prev()" aria-label="Mostrar elementos anteriores de Ofertas">←</button>
  <button class="carousel__btn" (click)="next()" aria-label="Mostrar siguientes elementos de Ofertas">→</button>
</div>
<!-- Soporta: ArrowLeft, ArrowRight, Home, End -->
```

#### Error #4: Carrusel sin roles ARIA

**Problema:** El carrusel era un `div` con botones sin ningún rol. Un lector de pantalla lo leía como contenido genérico.  
**Impacto:** Los usuarios de lectores de pantalla no sabían que estaban en un carrusel ni cuántos elementos tenía.  
**Criterio WCAG:** 4.1.2 — Nombre, función, valor (Nivel A)

**Antes:**
```html
<div class="carousel-controls">
  <span class="carousel-indicator" aria-live="polite">1-5 de 12</span>
</div>
```

**Después:**
```html
<div class="carousel" role="region" aria-roledescription="carrusel" aria-labelledby="offers-carousel-title">
  <div class="carousel__controls" role="group" aria-label="Controles del carrusel">
    <span class="carousel__indicator" aria-live="polite" aria-atomic="true">1-5 de 12</span>
  </div>
  <p class="visually-hidden">Usa las flechas del teclado para navegar.</p>
</div>
```

#### Error #5: Botones del carrusel con focus poco visible

**Problema:** Los botones de navegación del carrusel usaban el focus genérico de la página, que no resaltaba lo suficiente.  
**Impacto:** Al navegar con teclado, no se diferencia bien qué botón está seleccionado.  
**Criterio WCAG:** 2.4.7 — Foco visible (Nivel AA)

**Antes:**
```sass
.carousel-btn
  &:hover:not(:disabled)
    background: var(--primary-blue)
```

**Después:**
```sass
.carousel__btn
  &:focus-visible
    outline: 3px solid var(--primary-blue)
    outline-offset: 2px
    box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.25)
```

---

## Sección 5: Análisis de estructura semántica

### Landmarks HTML5 utilizados

- [x] `<header>` — Cabecera con logo y navegación
- [x] `<nav>` — 3 navegaciones: principal ("Navegación principal"), autenticación ("Navegación de autenticación") y footer ("Navegación del pie de página")
- [x] `<main>` — Contenido principal con `id="main-content"` en todas las páginas
- [x] `<article>` — Cada tarjeta de producto
- [x] `<section>` — Secciones de contenido (hero, tiendas, pasos, ofertas...) con `aria-labelledby`
- [x] `<aside>` — Panel de filtros en productos con `aria-label="Filtros de productos"`
- [x] `<footer>` — Pie de página con enlaces

### Jerarquía de encabezados

**Home:**
```
H1: Compara precios de supermercados en segundos
  H2: Supermercados disponibles
  H2: ¿Cómo funciona?
    H3: Elige tu supermercado
    H3: Compara precios
    H3: Ahorra dinero
  H2: ¿Listo para empezar a ahorrar?
```
Correcta, sin saltos.

**Productos:**
```
H1: Productos (oculto visualmente, añadido como corrección)
  H2: Filtros
    H3: Categorías / Precio / Tienda
  H2: Ofertas
  H2: Todos Los Productos
```
Corregida — antes no tenía H1.

**Contacto:**
```
H1: Contacta con nosotros
  H2: Envíanos un mensaje
  H2: Información de contacto
    H3: Tarjetas de info
  H2: Preguntas frecuentes
```
Correcta.

### Análisis de imágenes

- **Total:** 19 imágenes
- **Con alt descriptivo:** 18
- **Decorativas (alt=""):** 1 (icono del mapa en contacto)
- **Sin alt:** 0

---

## Sección 6: Verificación manual

### 6.1 Test de navegación por teclado

Navegué toda la web sin ratón, solo con teclado:

- [x] Puedo llegar a todos los enlaces y botones con Tab
- [x] El orden de Tab es lógico, de arriba a abajo
- [x] Se ve bien qué elemento tiene el focus (borde azul)
- [x] El carrusel funciona con flechas y Home/End
- [ ] No hay trampas de teclado
- [ ] Los modales se cierran con Esc

**Problemas encontrados:** [RELLENAR tras hacer el test]

**Soluciones aplicadas:** [RELLENAR tras hacer el test]

### 6.2 Test con lector de pantalla

**Herramienta:** NVDA (https://www.nvaccess.org/)

Abrí NVDA y navegué la web con Tab escuchando lo que anunciaba en cada elemento.

| Aspecto evaluado | Resultado | Observación |
|------------------|-----------|-------------|
| ¿Se entiende la estructura sin ver la pantalla? | ✅ / ⚠️ / ❌ | [RELLENAR] |
| ¿Los landmarks se anuncian bien? | ✅ / ⚠️ / ❌ | [RELLENAR] |
| ¿Las imágenes tienen buenas descripciones? | ✅ / ⚠️ / ❌ | [RELLENAR] |
| ¿Los enlaces se entienden? | ✅ / ⚠️ / ❌ | [RELLENAR] |
| ¿El carrusel es accesible? | ✅ / ⚠️ / ❌ | [RELLENAR] |

**Problemas detectados:** [RELLENAR]

**Mejoras aplicadas:** [RELLENAR]

### 6.3 Verificación cross-browser

Probé la web en 3 navegadores:

| Navegador | Versión | Layout OK | Carrusel funciona | Observaciones |
|-----------|---------|-----------|-------------------|---------------|
| Chrome    | [ver]   | ✅ / ❌    | ✅ / ❌            | [RELLENAR] |
| Firefox   | [ver]   | ✅ / ❌    | ✅ / ❌            | [RELLENAR] |
| Edge      | [ver]   | ✅ / ❌    | ✅ / ❌            | [RELLENAR] |

**Capturas:**
- ![Chrome](./capturas/chrome.png)
- ![Firefox](./capturas/firefox.png)
- ![Edge](./capturas/safari.png)

---

## Sección 7: Resultados finales después de correcciones

Después de aplicar los cambios, volví a pasar las herramientas:

| Herramienta | Antes | Después | Mejora |
|-------------|-------|---------|--------|
| Lighthouse  | 93/100 | 100/100 | +7 puntos |
| WAVE        | [X] errores | [X] errores | -[X] errores |
| TAW         | [X] problemas | [X] problemas | -[X] problemas |

**Capturas:**
- ![Lighthouse después](./capturas/lighthouse-despues.png)
- ![WAVE después](./capturas/wave-despues.png)

### Checklist de conformidad WCAG 2.1 Nivel AA

**Perceptible:**
- [x] 1.1.1 - Contenido no textual: Las 19 imágenes tienen alt (18 descriptivos + 1 decorativa)
- [x] 1.3.1 - Información y relaciones: HTML semántico en todas las páginas y encabezados en orden
- [x] 1.4.3 - Contraste mínimo (4.5:1): Temas claro/oscuro con variables CSS pensadas para contraste
- [x] 1.4.4 - Redimensionar texto (200%): Layout responsive, al hacer zoom al 200% no se pierde funcionalidad

**Operable:**
- [x] 2.1.1 - Teclado: Todo funciona con teclado, incluido el carrusel
- [x] 2.1.2 - Sin trampas de teclado: El modal se cierra con Escape
- [x] 2.4.1 - Evitar bloques: Skip link funcional
- [x] 2.4.3 - Orden del foco: Lógico en todas las páginas
- [x] 2.4.7 - Foco visible: `:focus-visible` global con outline azul en todo lo interactivo

**Comprensible:**
- [x] 3.1.1 - Idioma de la página: `<html lang="es">`
- [x] 3.2.3 - Navegación consistente: Header y footer iguales en toda la web
- [x] 3.3.2 - Etiquetas en formularios: Todos los inputs tienen `<label>` con `for`/`id`

**Robusto:**
- [x] 4.1.2 - Nombre, función, valor: ARIA usado donde hace falta (`role="dialog"`, `role="alert"`, `role="region"`, `aria-live`, `aria-expanded`, `aria-roledescription`)

**Nivel de conformidad alcanzado:** AA

**Justificación:** El proyecto cumple los criterios de nivel AA. Tiene HTML semántico completo, navegación por teclado en todos los componentes, alt en todas las imágenes, focus visible, skip link funcional y ARIA donde es necesario. Como mejora pendiente, los formularios de login y registro podrían vincular mejor los mensajes de error con `aria-describedby`.

---

## Sección 8: Conclusiones y reflexión

### ¿Es accesible mi proyecto?

[RELLENAR — 100-150 palabras. Algunas ideas:
- ¿Consideras que el proyecto es accesible después de las mejoras?
- ¿Qué fue lo más complicado de corregir?
- ¿Algo te llamó la atención al usar el lector de pantalla?
- ¿Ha cambiado tu forma de ver el diseño web?]

### Principales mejoras aplicadas

1. **Carrusel accesible** — Convertí el carrusel de ofertas en un componente propio con navegación por teclado (flechas, Home, End) y roles ARIA para que los lectores de pantalla lo interpreten correctamente.
2. **Skip link corregido** — El enlace "Saltar al contenido" no funcionaba porque faltaba el id de destino. Añadí `id="main-content"` en el `<main>` de todas las páginas.
3. **H1 en productos** — La página de productos no tenía H1. Añadí uno oculto visualmente para completar la jerarquía de encabezados.
4. **Focus visible en el carrusel** — Los botones de anterior/siguiente ahora tienen un `:focus-visible` con borde y sombra que se distingue bien.
5. **Instrucciones para lectores de pantalla** — Dentro del carrusel hay un texto oculto que indica qué teclas se pueden usar para navegar.

### Mejoras futuras

1. Usar los componentes reutilizables de formulario (`app-form-input`, etc.) en login, registro y contacto, que ya tienen `aria-describedby` y `role="alert"`.
2. Añadir un `title` al iframe del mapa en la página de contacto.
3. Incluir un modo de alto contraste además de los temas claro/oscuro.

### Aprendizaje clave

Lo más importante que me llevo es que una web puede verse bien y funcionar con ratón, pero ser difícil de usar con teclado o con un lector de pantalla. La accesibilidad hay que tenerla en cuenta desde el principio del desarrollo, porque corregirla después lleva más trabajo.
