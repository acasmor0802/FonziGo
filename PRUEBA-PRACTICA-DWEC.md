# Prueba Practica DWEC

## Ruta y navegacion

He creado la ruta `/estadisticas` en `app.routes.ts` con lazy loading:

```typescript
{
  path: 'estadisticas',
  loadComponent: () => import('./pages/stats/stats').then(m => m.StatsPage),
  title: 'Estadisticas - FonziGo',
  data: { breadcrumb: 'Estadisticas' }
}
```

Se carga bajo demanda, el bundle del componente solo se descarga cuando el usuario navega a esa pagina.

He anadido el enlace en el header (tanto en la navegacion de escritorio como en el menu movil) y en el footer, usando `routerLink="/estadisticas"` con `routerLinkActive="active"` para que se marque cuando estas en esa seccion. En el menu movil ademas tiene `(click)="closeMobileMenu()"` para cerrar el menu al pulsar.

## Jerarquia de componentes

### StatsPage (componente padre)

Archivo: `pages/stats/stats.ts`

Es el componente contenedor. Inyecta `ProductService` y llama a `getCategoryStats()` en el `ngOnInit`. Gestiona tres estados con signals: `stats` (los datos), `loading` (si esta cargando) y `error` (si falla la peticion). El template muestra un spinner mientras carga, un mensaje de error con boton de reintentar si falla, o el grid de tarjetas si todo va bien.

### StatsCardComponent (componente hijo)

Archivo: `components/stats-card/stats-card.ts`

Es el componente presentacional. Recibe un objeto `CategoryStats` a traves de `@Input({ required: true })`. No hace peticiones ni tiene logica de negocio, solo presenta los datos. Tiene getters para formatear los precios a dos decimales y calcular el porcentaje de productos en oferta.

### Tipado

La interfaz `CategoryStats` esta definida en `shared/types/index.ts` con todos los campos tipados como `number` o `string`. El servicio devuelve `Observable<CategoryStats[]>`. No se usa `any` en ningun sitio.

## Ejecucion

```bash
cd frontend
npm install
ng serve
```

Navegar a `http://localhost:4200/estadisticas`. Es necesario estar logueado para que el endpoint devuelva datos (si no, aparece el mensaje de error con opcion de reintentar).