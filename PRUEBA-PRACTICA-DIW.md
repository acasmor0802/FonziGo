# Prueba Practica DIW

## Variables de color nuevas

He tenido dos variables nuevas en la capa de Settings (`00-settings/_variables.sass`):
- `--stats-accent`: color principal para las cabeceras de las tarjetas de estadisticas y botones de accion.
- `--stats-highlight`:color para destacar ofertas y porcentajes altos.

Tambien definí sus variantes claras (`--stats-accent-light`, `--stats-highlight-light`) para fondos de badges y bordes sutiles.

## Archivos SASS creados

He creado 2 parciales nuevos en la capa Components (`05-components/`):
- `_stats-page.sass`:estilos del contenedor de la pagina, el grid, el spinner de carga, el bloque de error y el boton de reintentar.
- `_stats-card.sass`: estilos de la tarjeta individual con su cabecera, cuerpo de datos y footer con badges.

Ambos estan importados en `styles.sass` despues de `buttons`, respetando el orden ITCSS.

## BEM

He usado la convencion bloque__elemento--modificador de forma:
- Bloques: `stats-page`, `stats-card`
- Elementos: `Stats-card__header`...
- Modificadores: `stats-card__value--price`...

Los estados interactivos como hover o active, estan definidos en los botones y en las tarjetas usando las variables de color nuevas.

## Layout responsive

El grid de la pagina usa CSS Grid con tres breakpoints:

- Movil: 1 columna (`grid-template-columns: 1fr`)
- Tablet (md): 2 columnas (`repeat(2, 1fr)`)
- Escritorio (lg): 3 columnas (`repeat(3, 1fr)`)

Cada tarjeta usa Flexbox en columna. El body de la tarjeta pasa a distribuirse en fila en escritorio, con los pares de dato (label + valor) ocupando el 50% del ancho cada uno.

## Semantica HTML

He usado etiquetas semanticas en vez de divs genericos:

- `<section>` para el contenedor de la pagina
- `<article>` para cada tarjeta
- `<header>` y `<footer>` dentro de las tarjetas
- `<dl>`, `<dt>`, `<dd>` para los pares etiqueta-valor
- `<aside>` con `role="alert"` para el bloque de error
- `<nav>` con `aria-label` en header y footer
- Atributos `aria-hidden="true"` en iconos decorativos y `role="status"` en el spinner de carga

## Justificacion DIW

**Arquitectura: por que las variables van en Settings y los estilos en Components?**

Las variables van en la capa Settings porque es la primera que se carga y no genera CSS por si misma, solo define valores que el resto de capas recibiran. Los estilos de los componentes van en la capa Components porque tienen mayor especificidad y dependen de que las variables ya existan. Si importara Components antes que Settings, las referencias a `var(--stats-accent)` no tendrian valor definido en el momento de la compilacion del preprocesador o, con custom properties CSS, el orden de la cascada haria que los valores por defecto no estuvieran disponibles aun, lo que podria provocar que los estilos no se apliquen correctamente.

**Metodologia: que ventaja real me ha dado BEM frente a selectores anidados?**

Con BEM cada clase es plana y autocontenida, asi que la especificidad siempre es la misma. Eso me permite mover un componente de sitio o reutilizarlo sin que se rompa porque no depende de la estructura del DOM. Si hubiera usado selectores anidados como `div > button`, al cambiar el HTML o meter el componente dentro de otro contenedor, los estilos dejarian de aplicarse. Ademas, con BEM el nombre de la clase ya te dice a que componente pertenece cada elemento, lo que facilita leer el SASS y el HTML sin tener que rastrear la cadena de anidamiento.