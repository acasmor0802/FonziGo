# Gua de Despliegue

##  Opciones de Despliegue

1. **VPS (Recomendado)** - Ubuntu 24.04 + Docker + Caddy con SSL automtico
   - [Ver gua completa](DEPLOYMENT_VPS.md)
   - Ventajas: Control total, SSL automtico, escalable, ms barato a largo plazo

2. **GitHub Pages** - Frontend esttico gratuito
   - Para el frontend esttico
   - Backend requiere servicio separado

3. **Render** - PaaS gratuito con limitaciones
   - Actual deployment activo
   - Tiempos de "cold start" (30-50s)

---

##  Comparacin de Plataformas

| Caracterstica | VPS | GitHub Pages | Render |
|--------------|------|-------------|---------|
| **Coste** | $5-20/mes | Gratis | Gratis/$7/mes |
| **Control** | Total | Limitado | Limitado |
| **SSL** | Automtico (Caddy) | Automtico | Automtico |
| **Cold Start** | No | No | S (30-50s) |
| **Escalabilidad** | Fcil | No | Pago |
| **Base de datos** | Incluida | No | Incluida |
| **Dificultad** | Media | Fcil | Fcil |

---

##  Despliegue VPS (Recomendado)

### Quick Start (5 minutos)

```bash
# 1. Conectarse al VPS
ssh root@your-vps-ip

# 2. Clonar y setup
cd /opt
git clone https://github.com/acasmor0802/FonziGo.git
cd FonziGo
sudo bash scripts/vps-setup.sh

# 3. Configurar variables
nano .env.prod
# Generar passwords: openssl rand -base64 32

# 4. Desplegar
./deploy.sh
```

** Documentacin completa:** [DEPLOYMENT_VPS.md](DEPLOYMENT_VPS.md)

---

##  Despliegue en GitHub Pages (Solo Frontend)

##  Despliegue del Frontend

### Opcin 1: Despliegue Automtico con GitHub Actions (Recomendado)

El proyecto est configurado para desplegarse automticamente en GitHub Pages cada vez que haces push a la rama `main`.

#### Configuracin inicial en GitHub:

1. **Activa GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings  Pages
   - Source: selecciona **GitHub Actions**

2. **Hacer push al repositorio:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Verifica el despliegue:**
   - Ve a la pestaa **Actions** en tu repositorio
   - Espera a que el workflow termine (cono verde )
   - Tu sitio estar disponible en: `https://acasmor0802.github.io/FonziGo/`

### Opcin 2: Despliegue Manual

Si prefieres desplegar manualmente:

```bash
# 1. Ve al directorio frontend
cd frontend

# 2. Instala angular-cli-ghpages (solo la primera vez)
npm install

# 3. Despliega
npm run deploy
```

##  URLs del Proyecto

- **Produccin:** https://acasmor0802.github.io/FonziGo/
- **Desarrollo local:** http://localhost:4200

##  Configuracin del Backend

 **IMPORTANTE:** GitHub Pages solo sirve contenido esttico. El backend de Spring Boot debe desplegarse en otro servicio:

### Opciones para el Backend:

#### 1. **Railway** (Recomendado - Gratis)
- Conecta tu repo de GitHub
- Railway detecta automticamente Spring Boot
- URL: `https://[tu-app].railway.app`

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. New Project  Deploy from GitHub
3. Selecciona el repositorio FonziGo
4. Selecciona la carpeta `backend`
5. Railway desplegar automticamente

#### 2. **Render** (Gratis con limitaciones)
- Servicio gratuito que duerme despus de 15 min sin uso
- URL: `https://[tu-app].onrender.com`

#### 3. **Heroku** (Ya no tiene plan gratuito)
- Opcin de pago ($7/mes)

### Configurar la URL del Backend en Angular

Despus de desplegar el backend, actualiza la URL en tu frontend:

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

##  Solucin de Problemas

### Error 404 en rutas de Angular

Si al navegar a `/productos` obtienes 404:
-  Verifica que el archivo `404.html` existe en `frontend/public/`
-  Asegrate de que `.nojekyll` est en `frontend/public/`

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

##  Monitoreo

- **Estado del despliegue:** https://github.com/acasmor0802/FonziGo/actions
- **Logs del backend:** Panel de tu servicio (Railway/Render)

##  Actualizar el Sitio

```bash
# Hacer cambios en el cdigo
git add .
git commit -m "Descripcin de cambios"
git push origin main

# GitHub Actions desplegar automticamente
```

##  Comandos tiles

```bash
# Desarrollo local
npm start

# Build de produccin
npm run build:prod

# Despliegue manual
npm run deploy

# Ver preview del build
cd dist/frontend/browser
npx http-server
```

##  Checklist de Despliegue

- [ ] GitHub Pages activado en Settings  Pages
- [ ] Workflow de GitHub Actions configurado (`.github/workflows/deploy.yml`)
- [ ] Base href configurado como `/FonziGo/`
- [ ] Archivos `.nojekyll` y `404.html` en `public/`
- [ ] Backend desplegado (Railway/Render/etc.)
- [ ] URL del backend actualizada en `environment.prod.ts`
- [ ] CORS configurado en el backend
- [ ] Primera build y push realizados

---