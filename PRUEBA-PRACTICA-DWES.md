# Prueba Practica DWES

## Endpoint creado

He creado el endpoint `GET /api/products/stats` que devuelve estadisticas de productos agrupadas por categoria. Cada elemento incluye el numero de productos, precio medio, precio minimo y maximo, y cuantos estan en oferta. Me parecio util porque permite ver de un vistazo como se distribuyen los productos en la tienda sin tener que recorrer cada categoria manualmente.

## Arquitectura

He seguido la separacion de capas tal cual se pide:

- **Controller** (`ProductController.java`): recibe la peticion GET en `/api/products/stats` y delega al servicio. Tiene la anotacion de Swagger para documentarlo.
- **Service** (`ProductService` / `ProductServiceImpl`): interfaz con su implementacion. El metodo `getCategoryStats()` simplemente llama al repositorio.
- **Repository** (`ProductRepository`): contiene una query JPQL con `GROUP BY` que agrupa productos por categoria y calcula COUNT, AVG, MIN, MAX y la suma de productos en oferta. Devuelve directamente una lista de `CategoryStatsDTO`.
- **DTO** (`CategoryStatsDTO`): objeto con los campos categoryId, categoryName, categoryIcon, productCount, averagePrice, onSaleCount, minPrice y maxPrice. Usa Lombok para los getters y constructores.

## Seguridad

El endpoint esta protegido con JWT. En `SecurityConfig.java` he puesto la regla:

```java
.requestMatchers("/api/products/stats").authenticated()
.requestMatchers("/api/products/**").permitAll()
```

El orden importa: Spring Security evalua las reglas de arriba a abajo, asi que `/api/products/stats` se protege primero y el resto del catalogo sigue siendo publico. Si no estas autenticado y llamas a `/stats`, devuelve un 401.

## Pruebas con curl

Sin token (devuelve 401):

```bash
curl -i http://localhost:8080/api/products/stats
```

Con token (devuelve 200 y los datos):

```bash
curl -H "Authorization: Bearer <tu_token>" http://localhost:8080/api/products/stats
```

Para obtener el token primero hay que hacer login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fonzigo.com", "password": "admin123"}'
```

Y copiar el campo `token` de la respuesta para usarlo en la cabecera Authorization.