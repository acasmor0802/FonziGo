# Guía de Despliegue en GitHub Pages

## 🚀 Despliegue del Frontend

### Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

El proyecto está configurado para desplegarse automáticamente en GitHub Pages cada vez que haces push a la rama `main`.

#### Configuración inicial en GitHub:

1. **Activa GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: selecciona **GitHub Actions**

2. **Hacer push al repositorio:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Verifica el despliegue:**
   - Ve a la pestaña **Actions** en tu repositorio
   - Espera a que el workflow termine (ícono verde ✅)
   - Tu sitio estará disponible en: `https://acasmor0802.github.io/FonziGo/`

### Opción 2: Despliegue Manual

Si prefieres desplegar manualmente:

```bash
# 1. Ve al directorio frontend
cd frontend

# 2. Instala angular-cli-ghpages (solo la primera vez)
npm install

# 3. Despliega
npm run deploy
```

## 📋 URLs del Proyecto

- **Producción:** https://acasmor0802.github.io/FonziGo/
- **Desarrollo local:** http://localhost:4200

## ⚙️ Configuración del Backend

⚠️ **IMPORTANTE:** GitHub Pages solo sirve contenido estático. El backend de Spring Boot debe desplegarse en otro servicio:

### Opciones para el Backend:

#### 1. **Railway** (Recomendado - Gratis)
- Conecta tu repo de GitHub
- Railway detecta automáticamente Spring Boot
- URL: `https://[tu-app].railway.app`

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecciona el repositorio FonziGo
4. Selecciona la carpeta `backend`
5. Railway desplegará automáticamente

#### 2. **Render** (Gratis con limitaciones)
- Servicio gratuito que duerme después de 15 min sin uso
- URL: `https://[tu-app].onrender.com`

#### 3. **Heroku** (Ya no tiene plan gratuito)
- Opción de pago ($7/mes)

### Configurar la URL del Backend en Angular

Después de desplegar el backend, actualiza la URL en tu frontend:

```typescript
// frontend/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend.railway.app/api'  // URL de tu backend
};
```

Luego reconstruye y despliega:
```bash
npm run deploy
```

## 🔧 Solución de Problemas

### Error 404 en rutas de Angular

Si al navegar a `/productos` obtienes 404:
- ✅ Verifica que el archivo `404.html` existe en `frontend/public/`
- ✅ Asegúrate de que `.nojekyll` está en `frontend/public/`

### Estilos no se cargan

Si los estilos no aparecen:
1. Verifica que `--base-href` en `build:prod` sea `/FonziGo/`
2. Limpia y reconstruye:
   ```bash
   rm -rf dist
   npm run build:prod
   ```

### CORS errors con el backend

Configura CORS en Spring Boot:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("https://acasmor0802.github.io")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

## 📊 Monitoreo

- **Estado del despliegue:** https://github.com/acasmor0802/FonziGo/actions
- **Logs del backend:** Panel de tu servicio (Railway/Render)

## 🔄 Actualizar el Sitio

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de cambios"
git push origin main

# GitHub Actions desplegará automáticamente
```

## 📝 Comandos Útiles

```bash
# Desarrollo local
npm start

# Build de producción
npm run build:prod

# Despliegue manual
npm run deploy

# Ver preview del build
cd dist/frontend/browser
npx http-server
```

## ✅ Checklist de Despliegue

- [ ] GitHub Pages activado en Settings → Pages
- [ ] Workflow de GitHub Actions configurado (`.github/workflows/deploy.yml`)
- [ ] Base href configurado como `/FonziGo/`
- [ ] Archivos `.nojekyll` y `404.html` en `public/`
- [ ] Backend desplegado (Railway/Render/etc.)
- [ ] URL del backend actualizada en `environment.prod.ts`
- [ ] CORS configurado en el backend
- [ ] Primera build y push realizados

---