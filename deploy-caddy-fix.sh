#!/bin/bash
# ==============================================================================
# FonziGo - Deployment Script (con navegacin automtica al proyecto)
# ==============================================================================

echo " FonziGo Deployment Script"
echo "=================================="
echo ""

# Funcin para encontrar y navegar al directorio del proyecto
find_and_cd_project() {
    # Buscar FonziGo en directorios comunes
    local project_dirs=("$HOME/FonziGo" "$HOME/Downloads/FonziGo" "/var/www/FonziGo" "/opt/FonziGo" "/home/*/FonziGo")
    
    for dir in "${project_dirs[@]}"; do
        if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
            echo " Directorio encontrado: $dir"
            cd "$dir"
            return 0
        fi
    done
    
    # Si no se encontr, buscar con find
    echo " Buscando directorio FonziGo..."
    local found_dir=$(find "$HOME" -maxdepth 4 -name "package.json" -path "*/FonziGo/*" 2>/dev/null | head -1 | cut -d'/' -f1)
    
    if [ -n "$found_dir" ] && [ -d "$found_dir" ]; then
        echo " Directorio encontrado: $found_dir"
        cd "$found_dir"
        return 0
    fi
    
    echo " No se pudo encontrar el directorio del proyecto"
    echo ""
    echo " Por favor, escribe la ruta completa al directorio FonziGo:"
    read -p "Ruta completa del proyecto: " project_path
    cd "$project_path"
    return 1
}

# Buscar y navegar al proyecto
find_and_cd_project
if [ $? -ne 0 ]; then
    echo " No se pudo continuar"
    exit 1
fi

echo ""
echo " Directorio actual: $(pwd)"
echo ""

# Obtener cambios
echo " Obteniendo cambios del repositorio..."
if [ -d ".git" ]; then
    git pull
    if [ $? -eq 0 ]; then
        echo " Cambios obtenidos"
    else
        echo "  Error al obtener cambios"
    fi
else
    echo "  No es un repositorio git, continuando..."
fi

echo ""
echo " Reconstruyendo y reiniciando Caddy..."
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d --force-recreate caddy

if [ $? -eq 0 ]; then
    echo " Caddy recreado"
else
    echo " Error al recrear Caddy"
    exit 1
fi

# Esperar a que Caddy arranque
echo " Esperando a que Caddy arranque (20 segundos)..."
sleep 20

# Verificar estado
echo ""
echo " Estado de los contenedores:"
docker ps

echo ""
echo " Logs recientes de Caddy:"
docker logs fonzigo-caddy 2>&1 | tail -10

echo ""
echo " Deployment completado!"
echo ""
echo " Accede a tu aplicacin:"
echo "   - Frontend: https://fonzigo.app"
echo "   - API: https://fonzigo.app/api"
echo "   - Health: https://fonzigo.app/health"
echo ""
echo "  Si la web no funciona:"
echo "   1. Abre el navegador en https://fonzigo.app"
echo "   2. Presiona F12 para ver la consola"
echo "   3. Presiona Ctrl+Shift+R para refrescar cache"
echo ""
