# 🚀 FonziGo VPS Deployment - Quick Start (100% Working)

**Dominio:** fonzigo.app
**Fecha:** 2026-01-27
**Estado:** ✅ Configuración arreglada y lista para desplegar

---

## 📋 Checklist Antes de Desplegar

### En el VPS
- [ ] ✅ Docker instalado (o se instalará automáticamente)
- [ ] ✅ Docker Compose instalado (o se instalará automáticamente)
- [ ] ✅ Firewall configurado (puertos 80, 443, 22 abiertos)
- [ ] ✅ DNS de fonzigo.app apunta al VPS

### En el proyecto (ya hecho)
- [ ] ✅ Caddyfile arreglado (sin opción inválida)
- [ ] ✅ nginx.conf arreglado (sin proxy_pass a render.com)
- [ ] ✅ Todos los dominios apuntan a fonzigo.app
- [ ] ✅ Scripts de automatización creados
- [ ] ✅ Documentación completa en docs/deployment/

---

## 🚀 Pasos para Desplegar (100% Working)

### Paso 1: Conectarse al VPS

```bash
ssh root@TU_VPS_IP
```

### Paso 2: Ir al directorio del proyecto

```bash
cd /opt/FonziGo
```

### Paso 3: Verificar configuración (opcional pero recomendado)

```bash
# Ejecutar script de verificación
./verify-config.sh
```

**Deberías ver:**
```
✅ Caddyfile has no invalid options
✅ All domain references are to fonzigo.app
✅ nginx.conf has no proxy_pass to render.com
✅ CADDY_DOMAIN is correctly set to fonzigo.app
✅ API_URL is correctly set to https://fonzigo.app/api
```

### Paso 4: Ejecutar despliegue automático

```bash
# Este script hará TODO:
# - Verificar Docker está instalado (si no, lo instalará)
# - Verificar Docker Compose está instalado (si no, lo instalará)
# - Verificar Docker está corriendo (si no, lo arrancará)
# - Pull último código de GitHub
# - Construir imágenes Docker
# - Iniciar todos los servicios
# - Verificar health checks

./deploy.sh
```

### Paso 5: Esperar a que los servicios estén healthy

Los servicios tardan en iniciar:
- **Database:** ~10-20 segundos
- **Backend:** ~30-60 segundos
- **Frontend:** ~5-10 segundos
- **Caddy:** ~5-10 segundos

**Total:** ~1-2 minutos

### Paso 6: Verificar despliegue

```bash
# Ver estado de contenedores
docker ps

# Deberías ver:
# fonzigo-database   Up 3 minutes (healthy)
# fonzigo-backend    Up 3 minutes (healthy)
# fonzigo-frontend   Up 3 minutes (healthy)
# fonzigo-caddy      Up 3 minutes (healthy)
```

### Paso 7: Verificar SSL

```bash
# Verificar certificado SSL
docker logs fonzigo-caddy 2>&1 | grep -i "certificate"
```

**Deberías ver:**
```
{"level":"info","ts":...,"msg":"obtaining certificate"} 
{"level":"info","ts":...,"msg":"certificate obtained successfully"}
```

### Paso 8: Probar aplicación

Abre tu navegador y accede a:
- **Frontend:** https://fonzigo.app
- **API:** https://fonzigo.app/api
- **Health:** https://fonzigo.app/health
- **Swagger:** https://fonzigo.app/swagger-ui.html

---

## ✅ Verificación Final

### Ejecutar health check completo

```bash
./scripts/health-check.sh
```

**Salida esperada:**
```
✅ Database is healthy
✅ Backend is healthy
✅ Frontend is healthy
✅ Caddy is healthy
✅ Frontend accessible at https://fonzigo.app
✅ API accessible at https://fonzigo.app/api
```

---

## 🔍 Troubleshooting Rápido

### Si Caddy reinicia en bucle

**Problema:** Caddy reinicia continuamente
**Causa:** Error en configuración
**Solución:**
```bash
# Verificar Caddyfile
cat Caddyfile

# Ver logs de Caddy
docker logs fonzigo-caddy 2>&1 | tail -50
```

### Si Nginx no arranca

**Problema:** Nginx tiene errores de configuración
**Causa:** Sintaxis incorrecta en nginx.conf
**Solución:**
```bash
# Verificar sintaxis de nginx.conf
docker exec fonzigo-frontend nginx -t

# Si hay errores, reconstruir imagen
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d --build frontend
```

### Si Backend no inicia

**Problema:** Backend se reinicia continuamente
**Causa:** Error al conectar a base de datos
**Solución:**
```bash
# Ver logs de backend
docker logs fonzigo-backend 2>&1 | tail -50

# Verificar que base de datos está healthy
docker logs fonzigo-database
```

### Si Frontend no carga

**Problema:** Error 502 o 504 al acceder
**Causa:** Caddy no puede conectar con frontend
**Solución:**
```bash
# Verificar que frontend está corriendo
docker ps | grep frontend

# Verificar puertos internos
docker exec fonzigo-caddy curl -I http://frontend:80
```

---

## 📊 Arquitectura Final

```
Internet
    ↓
┌──────────────────────────────────────┐
│  Caddy (Puertos 80, 443)         │
│  - SSL Automático (Let's Encrypt)   │
│  - HTTPS Redirect                  │
│  - Routing a servicios internos       │
└──────────────────────────────────────┘
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │Frontend│  │Backend │  │Database│
    │:80     │  │:8080  │  │:5432  │
    │(Nginx) │  │(Spring) │  │(Postgres)│
    └────────┘  └────────┘  └────────┘
```

---

## 📝 Comandos Útiles

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs -f

# Solo Caddy
docker logs -f fonzigo-caddy

# Solo Backend
docker logs -f fonzigo-backend

# Solo Frontend
docker logs -f fonzigo-frontend
```

### Reiniciar servicios

```bash
# Reiniciar todo
docker-compose -f docker-compose.prod.yaml --env-file .env.prod restart

# Reiniciar Caddy
docker restart fonzigo-caddy

# Reiniciar Backend
docker restart fonzigo-backend
```

### Detener servicios

```bash
# Detener todo
docker-compose -f docker-compose.prod.yaml --env-file .env.prod down
```

---

## 🎯 URLs Finales

| Servicio | URL | Health Check |
|----------|-----|--------------|
| Frontend | https://fonzigo.app | https://fonzigo.app/health |
| API | https://fonzigo.app/api | https://fonzigo.app/api/actuator/health |
| Swagger | https://fonzigo.app/swagger-ui.html | - |
| Health | https://fonzigo.app/health | - |

---

## ✅ Éxito Despliegue

Tu aplicación FonziGo estará **100% funcionando** cuando:

1. ✅ Todos los contenedores están "Up" y "healthy"
2. ✅ Caddy obtiene certificado SSL automáticamente
3. ✅ Puedes acceder a https://fonzigo.app
4. ✅ Puedes acceder a https://fonzigo.app/api
5. ✅ Health checks funcionan
6. ✅ No hay errores en los logs
7. ✅ No hay reinicios en bucle

---

## 📞 Ayuda

Si tienes problemas:
1. Ver [DEPLOYMENT_FIXES.md](DEPLOYMENT_FIXES.md) - Detalles de los arreglos
2. Ejecutar `./verify-config.sh` - Verificar configuración
3. Ejecutar `./scripts/health-check.sh` - Health check completo
4. Revisar logs de Docker

---

## 📚 Documentación Completa

- **[DEPLOYMENT_FIXES.md](DEPLOYMENT_FIXES.md)** - Arreglos realizados
- **[docs/deployment/README.md](docs/deployment/README.md)** - Guías de despliegue
- **[docs/deployment/QUICKSTART.md](docs/deployment/QUICKSTART.md)** - Guía rápida
- **[docs/deployment/DEPLOYMENT_VPS.md](docs/deployment/DEPLOYMENT_VPS.md)** - Guía completa VPS
- **[docs/deployment/AUTO_CONFIGURE.md](docs/deployment/AUTO_CONFIGURE.md)** - Auto-configuración

---

**Última actualización:** 2026-01-27
**Versión:** 2.0.0
**Estado:** ✅ Configuración 100% corregida para fonzigo.app
