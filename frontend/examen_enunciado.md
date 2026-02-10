BLOQUE 1: DESARROLLO EN ENTORNO SERVIDOR (DWES).
Objetivo: Implementar la lógica de negocio y exponer los datos y exponerlos de forma segura mediante servicios web.
Resultados de Aprendizaje trabajados: RA5, RA6, RA7
1. Funcionalidad (Endpoint)
Debes añadir un endpoint nuevo a tu proyecto Spring Boot que no existiera previamente.
Requisito: Debe tener un propósito claro y ser coherente con tu dominio (ej: listado filtrado, recurso de usuario, resumen de datos, cálculo específico).
Arquitectura: Debes respetar estrictamente la separación de capas: Controlador → Servicio → Repositorio.
2. Seguridad y Calidad
Seguridad: El endpoint debe estar protegido mediante alguna estrategia válida (JWT, Rol específico o validación de propiedad del recurso).
Pruebas: El endpoint debe ser probado manualmente (Postman/Insomnia/Curl).
3. Entregable DWES
Código funcional en la rama del examen.
Archivo PRUEBA-PRACTICA-DWES.md en la raíz del proyecto explicando:
Qué endpoint has creado y por qué.
Cómo has implementado la seguridad.
Capturas o comandos para probarlo.
BLOQUE 2: DESARROLLO EN ENTORNO CLIENTE (DWEC) 
Objetivo: Estructura de la aplicación SPA, enrutado y consumo de datos.
1. Routing y Navegación (RA7 + RA5.d)
Nueva Ruta: Define e implementa una nueva ruta en el sistema de routing de Angular.
Integración: Modifica los componentes estructurales (Header y Footer) para incluir la navegación hacia esta nueva sección.
Lazy Loading: Se valorará positivamente la carga perezosa del módulo/componente.
2. Arquitectura de Componentes (RA6 + RA4)
Debes crear al menos 2 componentes nuevos (relación Padre-Hijo) para visualizar la respuesta del Backend:
Componente Contenedor (Padre):
Responsable de inyectar el servicio y recuperar los datos.
Debe gestionar el control de flujo en la vista.
Componente Presentacional (Hijo):
Debe ser un componente Standalone.
Recibe la información a través de decoradores de entrada (@Input).
Tipado: Es obligatorio el uso de interfaces para tipar los datos (prohibido any).
3. Documentación
Crear PRUEBA-PRACTICA-DWEC.md detallando la jerarquía de componentes creada y las instrucciones de ejecución.
BLOQUE 3: DISEÑO DE INTERFACES WEB (DIW)
Objetivo: Maquetación, arquitectura CSS escalable y adaptación multidispositivo.
Instrucciones Técnicas (RA2):
1. Arquitectura de Estilos y Preprocesadores
Evolución Cromática: 
Define 2 nuevas variables de color que complementen la identidad visual existente.
Integración ITCSS:
Debes ubicar estas variables en la capa de configuración correspondiente de tu arquitectura.
Debes crear los archivos parciales necesarios para los nuevos componentes y ubicarlos en la capa de abstracción correcta.
Realiza las importaciones en el manifiesto principal respetando el orden de la cascada y la especificidad.
Nota Importante: No se permite código CSS en los componentes de Angular, ni estilos en línea.
2. Metodología y Naming
BEM: Aplica estrictamente la nomenclatura estándar para bloques, elementos y modificadores en el HTML de los nuevos componentes.
Estados Interactivos: Define el comportamiento visual de los elementos interactivos (botones, inputs, enlaces) para todos sus estados posibles, utilizando las nuevas variables de color definidas.
3. Layout y Responsive Design
Tienes que tener una página nueva creada con un componente.
Visualización de Datos del componente (Endpoint Propio):
Implementa un sistema de rejilla bidimensional (CSS Grid) para el listado de elementos.
El diseño debe responder a los puntos de ruptura estándar: 1 columna (Móvil), 2 columnas (Tablet), 3 columnas (Escritorio).
El elemento del listado debe estar maquetado caja flexible (Flexbox).
Comportamiento Adaptativo: Debes manipular el eje principal de la distribución para que los elementos se apilen en dispositivos móviles y se alineen lateralmente en escritorio, ocupando el ancho disponible. 
4. Semántica
Selecciona las etiquetas HTML5 que mejor describan la estructura del contenido, evitando el uso genérico de contenedores (div) sin significado semántico.
5. Justificación de Decisiones
Para validar tu comprensión de la arquitectura, añade una sección en tu archivo PRUEBA-PRACTICA-DIW.md titulada "Justificación DIW" y responde brevemente con tus palabras:
Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?
Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).

Entrega final
Debéis entregar:
Enlace al repositorio en la tarea de Moodle.
Ánimo 🖖



Resultados de Aprendizaje y Evaluación
Diseño de Interfaces Web
RA2: Crea interfaces Web homogéneos definiendo y aplicando estilos.


a. Se han reconocido las posibilidades de modificar las etiquetas HTML.
c. Se han definido y asociado estilos globales en hojas externas.
d. Se han definido hojas de estilos alternativas.
e. Se han redefinido estilos.
f. Se han identificado las distintas propiedades de cada elemento.
g. Se han creado clases de estilos.
j. Se han analizado y utilizado preprocesadores de estilos para traducir estilos comunes a un código estándar y reconocible por los navegadores.


1. Arquitectura ITCSS y Comprensión
Criterios: c) Estilos externos, j) Preprocesadores, e) Redefinición.
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
No Apto. Usa estilos en línea, en el TS o mezcla capas sin lógica. No responde a la justificación en el Markdown.
0 - 2.9
Nivel 2
Mecánico. Archivos creados pero contenido desordenado (ej: CSS visual en capa Settings). La justificación es errónea o demuestra que no entiende la cascada ("lo puse ahí porque sí").
3.0 - 4.9
Nivel 3
Correcto. Estructura ITCSS válida. El orden de importación es correcto y las variables funcionan. La justificación es correcta aunque básica. 
5.0 - 6.9
Nivel 4
Notable. Buena separación de configuración y cosmética. No hay código redundante. La justificación denota entendimiento del preprocesador.
7.0 - 8.9
Nivel 5
Profesional. Arquitectura impecable y escalable. Uso avanzado de Sass. La justificación explica con precisión técnica conceptos de cascada y especificidad.
9.0 - 10

2. Metodología BEM y Estados
Criterios: g) Clases, f) Propiedades.
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
Caótico. Selectores anidados , IDs o nombres genéricos. Sin estados interactivos.
0 - 2.9
Nivel 2
Intento Fallido. Sintaxis BEM incorrecta. Mezcla metodologías. Estados interactivos visualmente pobres.
3.0 - 4.9
Nivel 3
Correcto. Sintaxis respetada. Define estados básicos. Las propiedades dentro de los selectores no están ordenadas.
5.0 - 6.9
Nivel 4
Limpio. Naming semántico y descriptivo. Baja especificidad en selectores. Estados claros para el usuario. El orden mantienen una coherencia.
7.0 - 8.9
Nivel 5
Profesional. BEM estricto incluyendo modificadores de estado. Código documentado. Feedback visual excelente. El orden mantiene una consistencia impecable.
9.0 - 10 .

3. Layout Responsive (Grid/Flex)
Criterios: d) Hojas alternativas, f) Propiedades.
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
No Funcional. Se rompe en el móvil. Usa float o tablas. No implementa Grid o Flex donde se pide.
0 - 2.9
Nivel 2
Parcial. Grid o Flex fallan en algún punto (ej: no cambia el eje en móvil). Solapamientos visuales.
3.0 - 4.9
Nivel 3
Funcional. Cumple el 1-2-3 columnas y la reorientación del contenido interior. Se ve bien en breakpoints estándar.
5.0 - 6.9
Nivel 4
Robusto. Fluidez sin saltos bruscos. Uso correcto de espaciado de columnas y alineaciones. Código CSS limpio.
7.0 - 8.9
Nivel 5
Moderno. Uso de funciones avanzadas para una adaptación fluida y perfecta al contenido.
9.0 - 10


4. Semántica HTML
Criterio: a) Modificación etiquetas.
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
Divitis. Uso exclusivo de div y span. Botones o inputs sin etiquetas adecuadas.
0 - 2.9
Nivel 2
Pobre. Estructura confusa. Faltan etiquetas clave. Jerarquía de encabezados rota.
3.0 - 4.9
Nivel 3
Correcto. Uso de etiquetas semánticas principales. Código indentado.
5.0 - 6.9
Nivel 4
Semántico. Elección precisa de etiquetas para cada contexto.
7.0 - 8.9
Nivel 5
Accesible. Estructura de documento perfecta. El HTML describe el contenido por sí solo sin necesidad de CSS. sin el uso de etiquetas genéricas.
9.0 - 10


Desarrollo Web en entorno cliente
RA4: Programa código para clientes Web analizando y utilizando estructuras definidas por el usuario.
Criterios: b) Funciones usuarios, c) Arrays, e) Orientación objetos, g) Métodos propiedades, 
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
No apto. Sin archivos .ts funcionales (Header/Footer solo HTML), sin arrays ni métodos en TS, sin @Input.
0 - 2.9
Nivel 2
Mecánico. Header/Footer con arrayItems = ['a','b'], @Input dato: string, métodos básicos selectItem(item).
3.0 - 4.9
Nivel 3
Correcto. Header/Footer con arrayItems = ['a','b'], @Input dato: string, métodos básicos selectItem(item).
5.0 - 6.9
Nivel 4
Notable. rrays con datos reales contextuales, @Input() tipados en 2 componentes, métodos reutilizables navegar(ruta), selectItem(item).
7.0 - 8.9
Nivel 5
Profesional. Arrays tipados de objetos (Item[]), @Input ItemModel, métodos encapsulados y reutilizables (navegar(ruta: string), selectItem(ItemModel)), arquitectura TS escalable.
9.0 - 10


RA5: Desarrolla aplicaciones Web interactivas integrando mecanismos de manejo de eventos.
Criterios: d) Eventos.
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
No apto. No existe ningún enlace de navegación a la nueva ruta, o se intenta con enlaces HTML <a href="/nueva"> que no funcionan correctamente en Angular (recarga completa de página).
0 - 2.9
Nivel 2
Mecánico. El routerLink="/nueva" existe en la plantilla pero está roto (sintaxis incorrecta como routerlink="/nueva", ruta mal escrita, o enlace que no responde al click).
3.0 - 4.9
Nivel 3
Correcto. routerLink="/nueva" funciona en al menos un componente (header/footer), navegando correctamente a la nueva ruta sin recargar la página, pero sin integración con métodos de TS reutilizables.
5.0 - 6.9
Nivel 4
Notable. routerLink="/nueva" implementado correctamente en múltiples componentes (header y footer), navegando sin problemas a la nueva ruta, y combinado con eventos (click) que llaman funciones de TS para lógica adicional (validaciones, logs, etc.).
7.0 - 8.9
Nivel 5
Profesional. Manejo completo de eventos de navegación: routerLink="/nueva" + eventos (click)="navegar('nueva')" tipados y reutilizables en TS, con manejo de estados (active route, guards, etc.) y comunicación entre componentes para mantener coherencia en toda la app.
9.0 - 10


RA6: Desarrolla aplicaciones Web analizando y aplicando las características del modelo de objetos del documento.
Criterios: a) Modelos Objeto, d) Crear elementos. 
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
No apto.  Sin componentes standalone (@Component({standalone: true})), Header/Footer inline (HTML/CSS en TS), 0 componentes nuevos creados (ng g c).
0 - 2.9
Nivel 2
Mecánico. Componentes generados con ng g c básico (no standalone), máximo 1 componente nuevo en Git, Header/Footer parcialmente funcionales.
3.0 - 4.9
Nivel 3
Correcto. Header/Footer como componentes standalone básicos (@Component({standalone: true})), 1 componente nuevo creado con ng g c y commiteado en Git.
5.0 - 6.9
Nivel 4
Notable. Header/Footer standalone completos (templateUrl + styleUrls), 2 componentes nuevos funcionales (ng g c lista/item) con Git history claro.
7.0 - 8.9
Nivel 5
Profesional.Arquitectura standalone impecable: Header/Footer/Item 100% reutilizables/independientes, 2+ componentes nuevos bien estructurados en Git (ng g c + workflow profesional), módulos auto-contenidos y escalables.
9.0 - 10


RA7: Desarrolla aplicaciones Web dinámicas, reconociendo y aplicando mecanismos de comunicación asíncrona entre cliente y servidor.
Criterios: c) Objetos Routing, d) Propiedades rutas, e) Comunicación Async.
Nivel
Descripción del Desempeño
Puntuación
Nivel 1
No apto. Sin nueva ruta añadida al routing (routes sin modificar), navegación inexistente o solo con <a href> HTML básico que recarga la página completa.
0 - 2.9
Nivel 2
Mecánico. Routes array existe pero sin nueva ruta ({path: 'nueva', ...} ausente), routerLink="/nueva" básico funciona pero sin métodos programáticos ni lazy loading.
3.0 - 4.9
Nivel 3
Correcto. 1 ruta NUEVA {path: 'nueva', component: NuevaComponent} añadida correctamente, routerLink="/nueva" navega sin recargar, pero navegación solo declarativa (sin router.navigate()).
5.0 - 6.9
Nivel 4
Notable. Nueva ruta completa con path: 'nueva' + navegación programática router.navigate(['nueva']) desde métodos TS, accesible desde múltiples componentes (Header/Footer).
7.0 - 8.9
Nivel 5
Profesional.Routing avanzado: 1 ruta NUEVA con {path: 'nueva', loadChildren: () => import('./nueva.module').then(m => m.NuevaModule)} (lazy loading), navegación programática tipada, guards/resolvers opcionales, y navegación activa destacada en toda la app.
9.0 - 10


Desarrollo Web en Entorno Servidor
Resultado de Aprendizaje
Criterio de Evaluación
Evidencia en la prueba
RA5. Separar lógica de negocio y presentación
5.a Identificación de ventajas de la separación
Uso explícito de controlador, servicio y repositorio


5.b Uso de frameworks que permiten esta separación
Implementación con Spring Boot


5.g Aplicación de principios y patrones OO
Diseño del endpoint y responsabilidades
RA6. Acceso a datos con seguridad
6.c Recuperación de información de BD
Endpoint que consulta datos


6.f Actualización / acceso controlado a datos
Endpoint protegido (JWT / roles / ownership)


6.g Prueba y documentación de aplicaciones
Pruebas manuales + documento explicativo
RA7. Servicios web
7.e Programación de un servicio web
Creación del endpoint REST


7.f Verificación del funcionamiento
Pruebas con Postman / Insomnia / curl


