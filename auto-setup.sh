#!/bin/bash
# ==============================================================================
# FonziGo - One-Click Auto Configuration
# Generates ALL credentials automatically and configures everything
# Usage: ./auto-setup.sh
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 FonziGo One-Click Auto Setup${NC}"
echo "=================================="
echo ""

# Generate all credentials
echo "🔐 Generating secure credentials..."

DB_PASS=$(openssl rand -base64 32 | tr -d "=+/\n" | cut -c1-28)
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/\n" | cut -c1-60)
SESSION_SECRET=$(openssl rand -base64 32 | tr -d "=+/\n" | cut -c1-28)
API_KEY=$(openssl rand -base64 32 | tr -d "=+/\n" | cut -c1-28)

echo -e "${GREEN}✅ All credentials generated${NC}"
echo ""

# Create .env (development)
cat > .env <<EOF
POSTGRES_DB=fonzigo_dev
POSTGRES_USER=fonzi
POSTGRES_PASSWORD=$DB_PASS
SPRING_PROFILES_ACTIVE=dev
SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/fonzigo_dev
SPRING_DATASOURCE_USERNAME=fonzi
SPRING_DATASOURCE_PASSWORD=$DB_PASS
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
SECURITY_JWT_SECRET_KEY=$JWT_SECRET
SECURITY_JWT_EXPIRATION_TIME=86400000
SESSION_SECRET=$SESSION_SECRET
GOOGLE_CLIENT_ID=952787149260-mktleu05ui8av17c06uj9so115na9utt.apps.googleusercontent.com
SERVER_PORT=8080
TZ=Europe/Madrid
FRONTEND_PORT=4200
API_URL=http://localhost:8080/api
CADDY_EMAIL=admin@fonzigo.app
CADDY_DOMAIN=fonzigo.app
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:80
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB
API_KEY=$API_KEY
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=2
SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=30000
EOF

# Create .env.prod (production)
cat > .env.prod <<EOF
POSTGRES_DB=fonzigo_prod
POSTGRES_USER=fonzi
POSTGRES_PASSWORD=$DB_PASS
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/fonzigo_prod
SPRING_DATASOURCE_USERNAME=fonzi
SPRING_DATASOURCE_PASSWORD=$DB_PASS
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
SECURITY_JWT_SECRET_KEY=$JWT_SECRET
SECURITY_JWT_EXPIRATION_TIME=86400000
SESSION_SECRET=$SESSION_SECRET
GOOGLE_CLIENT_ID=952787149260-mktleu05ui8av17c06uj9so115na9utt.apps.googleusercontent.com
SERVER_PORT=8080
TZ=Europe/Madrid
FRONTEND_PORT=3000
API_URL=https://fonzigo.app/api
CADDY_EMAIL=admin@fonzigo.app
CADDY_DOMAIN=fonzigo.app
ALLOWED_ORIGINS=https://fonzigo.app,https://www.fonzigo.app
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB
API_KEY=$API_KEY
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=2
SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=30000
SECURITY_CORS_ENABLED=true
SECURITY_CORS_MAX_AGE=3600
SECURITY_CORS_ALLOW_CREDENTIALS=true
EOF

# Create credentials backup
cat > .credentials-backup.txt <<EOF
FonziGo Credentials - Generated $(date)
====================================

DATABASE PASSWORD: $DB_PASS
JWT SECRET: $JWT_SECRET
SESSION SECRET: $SESSION_SECRET
API KEY: $API_KEY

⚠️  SAVE THESE CREDENTIALS SECURELY!
After saving, delete this file with: rm .credentials-backup.txt
EOF

# Set secure permissions
chmod 600 .env .env.prod .credentials-backup.txt

echo -e "${GREEN}✅ All files created and secured!${NC}"
echo ""
echo "📁 Files created:"
echo "  ✅ .env (development)"
echo "  ✅ .env.prod (production)"
echo "  ✅ .credentials-backup.txt (credentials backup)"
echo ""
echo "📋 Credentials saved in .credentials-backup.txt"
echo -e "${BLUE}ℹ️  Open it to view: cat .credentials-backup.txt${NC}"
echo ""
echo -e "${GREEN}🎉 Ready to deploy! Run: ./deploy.sh${NC}"
