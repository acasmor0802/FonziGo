#!/bin/bash
# ==============================================================================
# FonziGo - Auto-Configuration Script
# Automatically generates secure credentials and configures all environment files
# Usage: ./auto-configure.sh
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored messages
log_info() {
    echo -e "${BLUE}  $1${NC}"
}

log_success() {
    echo -e "${GREEN} $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}  $1${NC}"
}

log_error() {
    echo -e "${RED} $1${NC}"
}

log_step() {
    echo -e "${CYAN} $1${NC}"
}

echo ""
echo " FonziGo Auto-Configuration Script"
echo "=================================="
echo ""

# Function to generate secure random string in base64
generate_password() {
    local length=$1
    openssl rand -base64 $length | tr -d "=+/\n" | cut -c1-$(expr $length - 4)
}

# Step 1: Generate all secure credentials
log_step "Step 1/5: Generating secure credentials..."

# Generate database password (32 chars)
DB_PASSWORD=$(generate_password 32)
log_success "Generated database password"

# Generate JWT secret (64 chars)
JWT_SECRET=$(generate_password 64)
log_success "Generated JWT secret"

# Generate secret key for sessions (32 chars)
SESSION_SECRET=$(generate_password 32)
log_success "Generated session secret"

# Generate API key (optional, 32 chars)
API_KEY=$(generate_password 32)
log_success "Generated API key"

echo ""

# Step 2: Create .env (development)
log_step "Step 2/5: Creating .env (development)..."

cat > .env <<EOF
# ==============================================================================
# FonziGo - Development Environment Variables
# Auto-generated on $(date)
# ==============================================================================

# -----------------------------------------------------------------------------
# Database Configuration
# -----------------------------------------------------------------------------
POSTGRES_DB=fonzigo_dev
POSTGRES_USER=fonzi
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_HOST=database
POSTGRES_PORT=5432

# -----------------------------------------------------------------------------
# Backend Configuration
# -----------------------------------------------------------------------------
SPRING_PROFILES_ACTIVE=dev
SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/fonzigo_dev
SPRING_DATASOURCE_USERNAME=fonzi
SPRING_DATASOURCE_PASSWORD=$DB_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true

# JWT Configuration (DEV)
SECURITY_JWT_SECRET_KEY=$JWT_SECRET
SECURITY_JWT_EXPIRATION_TIME=86400000

# Session Configuration
SESSION_SECRET=$SESSION_SECRET

# Google OAuth (development)
GOOGLE_CLIENT_ID=952787149260-mktleu05ui8av17c06uj9so115na9utt.apps.googleusercontent.com

# Server Configuration
SERVER_PORT=8080
TZ=Europe/Madrid

# Frontend Configuration
FRONTEND_PORT=4200
API_URL=http://localhost:8080/api

# CORS Configuration (Development URLs)
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:80,http://127.0.0.1:4200

# File Upload Configuration
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB

# API Configuration
API_KEY=$API_KEY

# Database Connection Pool
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=2
SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=30000
EOF

log_success "Created .env (development)"

# Step 3: Create .env.prod (production)
log_step "Step 3/5: Creating .env.prod (production)..."

cat > .env.prod <<EOF
# ==============================================================================
# FonziGo - Production Environment Variables
# Auto-generated on $(date)
#   SECURITY WARNING: Keep this file secure!
# ==============================================================================

# -----------------------------------------------------------------------------
# Database Configuration
# -----------------------------------------------------------------------------
POSTGRES_DB=fonzigo_prod
POSTGRES_USER=fonzi
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_HOST=database
POSTGRES_PORT=5432

# -----------------------------------------------------------------------------
# Backend Configuration
# -----------------------------------------------------------------------------
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/fonzigo_prod
SPRING_DATASOURCE_USERNAME=fonzi
SPRING_DATASOURCE_PASSWORD=$DB_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false

# JWT Configuration (PROD - MUST be strong!)
SECURITY_JWT_SECRET_KEY=$JWT_SECRET
SECURITY_JWT_EXPIRATION_TIME=86400000

# Session Configuration
SESSION_SECRET=$SESSION_SECRET

# Google OAuth (PRODUCTION)
GOOGLE_CLIENT_ID=952787149260-mktleu05ui8av17c06uj9so115na9utt.apps.googleusercontent.com

# Server Configuration
SERVER_PORT=8080
TZ=Europe/Madrid

# Frontend Configuration
FRONTEND_PORT=3000
API_URL=https://fonzigo.app/api

# Caddy Configuration
CADDY_EMAIL=admin@fonzigo.app
CADDY_DOMAIN=fonzigo.app

# CORS Configuration (Production URLs)
ALLOWED_ORIGINS=https://fonzigo.app,https://www.fonzigo.app

# File Upload Configuration
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB

# API Configuration
API_KEY=$API_KEY

# Database Connection Pool
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=2
SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=30000

# Security Settings
SECURITY_CORS_ENABLED=true
SECURITY_CORS_MAX_AGE=3600
SECURITY_CORS_ALLOW_CREDENTIALS=true
EOF

log_success "Created .env.prod (production)"

# Step 4: Set secure permissions
log_step "Step 4/5: Setting secure permissions..."

chmod 600 .env
chmod 600 .env.prod
log_success "Set permissions to 600 (read/write owner only)"

# Step 5: Save credentials to backup file
log_step "Step 5/5: Saving credentials backup..."

cat > .credentials-backup.txt <<EOF
# ==============================================================================
# FonziGo - Credentials Backup
# Auto-generated on $(date)
#   SECURITY WARNING: Keep this file secure! Delete after storing securely!
# ==============================================================================

# IMPORTANT: Save these credentials in a secure password manager!
# After storing securely, DELETE this file!

# -----------------------------------------------------------------------------
# Database Credentials
# -----------------------------------------------------------------------------
Database Name: fonzigo_prod (production) / fonzigo_dev (development)
Database User: fonzi
Database Password: $DB_PASSWORD

# -----------------------------------------------------------------------------
# JWT Secret (for authentication)
# -----------------------------------------------------------------------------
JWT Secret: $JWT_SECRET

# -----------------------------------------------------------------------------
# Session Secret
# -----------------------------------------------------------------------------
Session Secret: $SESSION_SECRET

# -----------------------------------------------------------------------------
# API Key (optional)
# -----------------------------------------------------------------------------
API Key: $API_KEY

# -----------------------------------------------------------------------------
# Important Notes
# -----------------------------------------------------------------------------
- Keep these credentials secure and never commit them to Git
- Use a password manager like LastPass, 1Password, or Bitwarden
- Rotate these passwords regularly (every 90 days recommended)
- Never share these credentials via email or chat
- Delete this file after storing credentials securely

# -----------------------------------------------------------------------------
# Generated On
# -----------------------------------------------------------------------------
Date: $(date)
Hostname: $(hostname)
User: $(whoami)
EOF

chmod 600 .credentials-backup.txt
log_success "Saved credentials to .credentials-backup.txt"

echo ""
log_success " Auto-configuration complete!"
echo ""

# Display summary
echo " Configuration Summary:"
echo ""
echo ""
echo " .env created (development)"
echo " .env.prod created (production)"
echo " .credentials-backup.txt created"
echo " All files secured with chmod 600"
echo ""

# Display what was generated (for verification, not full passwords)
log_info "Generated Credentials:"
echo "   Database password: ${DB_PASSWORD:0:10}... (stored in backup)"
echo "   JWT secret: ${JWT_SECRET:0:10}... (stored in backup)"
echo "   Session secret: ${SESSION_SECRET:0:10}... (stored in backup)"
echo "   API key: ${API_KEY:0:10}... (stored in backup)"
echo ""

log_warn "  IMPORTANT SECURITY NOTES:"
echo ""
echo "1. All credentials have been generated and stored in .credentials-backup.txt"
echo "2. Open .credentials-backup.txt to view all credentials"
echo "3. Save the credentials in a secure password manager"
echo "4. After saving securely, delete .credentials-backup.txt:"
echo "   rm .credentials-backup.txt"
echo ""

log_info " Next Steps:"
echo ""
echo "1. Update Google Client ID in both .env files if needed:"
echo "   nano .env"
echo "   nano .env.prod"
echo ""
echo "2. Review and customize other settings:"
echo "   - Timezone (TZ)"
echo "   - Email for SSL (CADDY_EMAIL)"
echo "   - Domain name (CADDY_DOMAIN)"
echo ""
echo "3. Deploy the application:"
echo "   ./deploy.sh"
echo ""

log_warn "  BACKUP YOUR CREDENTIALS:"
echo ""
echo "Before deploying, make sure to save the credentials from:"
echo "   .credentials-backup.txt"
echo ""
echo "Use a secure password manager to store them."
echo ""

log_info " File Permissions:"
echo ""
echo "  .env              - 600 (owner read/write only)"
echo "  .env.prod         - 600 (owner read/write only)"
echo "  .credentials-backup.txt - 600 (owner read/write only)"
echo ""

log_success " All environment files are now configured automatically!"
echo ""
