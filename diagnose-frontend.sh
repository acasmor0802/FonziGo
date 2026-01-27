#!/bin/bash
echo "=== DIAGNÓSTICO COMPLETO DEL FRONTEND ==="
echo ""

echo "1. Verificando archivos en el build de Docker..."
docker exec fonzigo-frontend sh -c "ls -la /usr/share/nginx/html/" 2>&1
echo ""

echo "2. Verificando archivos JS..."
docker exec fonzigo-frontend sh -c "ls -la /usr/share/nginx/html/*.js" 2>&1
echo ""

echo "3. Verificando index.html completo..."
docker exec fonzigo-frontend sh -c "cat /usr/share/nginx/html/index.html" 2>&1
echo ""

echo "4. Verificando si hay archivos en assets..."
docker exec fonzigo-frontend sh -c "ls -la /usr/share/nginx/html/assets/" 2>&1
echo ""

echo "5. Verificando tamaño total del directorio..."
docker exec fonzigo-frontend sh -c "du -sh /usr/share/nginx/html/" 2>&1
echo ""

echo "6. Logs recientes del frontend..."
docker logs fonzigo-frontend 2>&1 | tail -20
echo ""

echo "7. Verificando error.log de nginx si existe..."
docker exec fonzigo-frontend sh -c "cat /var/log/nginx/error.log" 2>&1 | tail -10
echo ""

echo "=== FIN ==="
