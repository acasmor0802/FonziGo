#!/bin/bash
# Script para corregir el problema de contraseña de la base de datos

echo "🔧 Fixing database password issue..."

# 1. Detener todos los contenedores
echo "📦 Stopping containers..."
docker-compose -f docker-compose.prod.yaml --env-file .env.prod down

# 2. Eliminar el volumen de la base de datos (esto borra los datos pero reinicia con la nueva contraseña)
echo "🗑️  Removing database volume..."
docker volume rm fonzigo-db-data 2>/dev/null || echo "Volume already removed or doesn't exist"

# 3. Iniciar los servicios de nuevo
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d

# 4. Esperar a que los servicios estén saludables
echo "⏳ Waiting for services to be healthy..."
sleep 10

# 5. Mostrar estado
echo ""
echo "✅ Services started! Checking status..."
docker-compose -f docker-compose.prod.yaml --env-file .env.prod ps

echo ""
echo "📋 Check logs with: docker-compose -f docker-compose.prod.yaml logs -f"
