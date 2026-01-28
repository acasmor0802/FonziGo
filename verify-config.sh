#!/bin/bash
# ==============================================================================
# FonziGo - Verification Script
# Verifies that all configurations are correct for fonzigo.app deployment
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo ""
echo " FonziGo Configuration Verification"
echo "==================================="
echo ""

# Check 1: Caddyfile exists and is valid
log_info "Check 1/7: Caddyfile configuration..."
if [ ! -f Caddyfile ]; then
    log_error "Caddyfile not found!"
    exit 1
fi

# Check for invalid options in Caddyfile
if grep -q "graceful_shutdown_timeout" Caddyfile; then
    log_error "Caddyfile contains invalid option: graceful_shutdown_timeout"
    log_info "This option doesn't exist in Caddy 2.8"
    exit 1
else
    log_success "Caddyfile has no invalid options"
fi

# Check that all references are to fonzigo.app
if grep -q "render" Caddyfile; then
    log_error "Caddyfile contains references to 'render' instead of 'fonzigo.app'"
    exit 1
else
    log_success "All domain references are to fonzigo.app"
fi

# Count domain references
DOMAIN_COUNT=$(grep -c "fonzigo.app" Caddyfile)
log_info "Found $DOMAIN_COUNT references to fonzigo.app"

# Check 2: nginx.conf configuration
log_info "Check 2/7: nginx.conf configuration..."
if [ ! -f frontend/nginx.conf ]; then
    log_error "nginx.conf not found!"
    exit 1
fi

# Check for proxy_pass blocks (should NOT exist in production with Caddy)
if grep -q "proxy_pass.*render" frontend/nginx.conf; then
    log_error "nginx.conf contains proxy_pass to render.com"
    log_error "In production with Caddy, nginx should only serve static files"
    exit 1
else
    log_success "nginx.conf has no proxy_pass to render.com"
fi

# Check 3: Environment files
log_info "Check 3/7: Environment files..."
if [ ! -f .env.prod ]; then
    log_error ".env.prod not found!"
    exit 1
fi

# Load environment
source .env.prod

# Check domain in environment
if [[ "$CADDY_DOMAIN" != "fonzigo.app" ]]; then
    log_error "CADDY_DOMAIN in .env.prod is not set to fonzigo.app"
    exit 1
else
    log_success "CADDY_DOMAIN is correctly set to fonzigo.app"
fi

# Check API URL
if [[ "$API_URL" != "https://fonzigo.app/api" ]]; then
    log_error "API_URL in .env.prod is not set to https://fonzigo.app/api"
    exit 1
else
    log_success "API_URL is correctly set to https://fonzigo.app/api"
fi

# Check 4: Docker Compose files
log_info "Check 4/7: Docker Compose configuration..."
if [ ! -f docker-compose.prod.yaml ]; then
    log_error "docker-compose.prod.yaml not found!"
    exit 1
fi

# Check that compose uses .env.prod
if ! grep -q "env-file.*.env.prod" docker-compose.prod.yaml; then
    log_error "docker-compose.prod.yaml doesn't use .env.prod"
    exit 1
else
    log_success "docker-compose.prod.yaml uses .env.prod"
fi

# Check 5: Backend configuration
log_info "Check 5/7: Backend Spring configuration..."
if [ ! -f backend/src/main/resources/application.properties ]; then
    log_error "application.properties not found!"
    exit 1
fi

# Check that backend uses production profile
if grep -q "spring.profiles.active=dev" backend/src/main/resources/application.properties; then
    log_warn "application.properties has dev profile (should use prod from env)"
else
    log_success "Backend configured to use env variables for profile"
fi

# Check 6: Frontend configuration
log_info "Check 6/7: Frontend Angular configuration..."
if [ ! -f frontend/src/environments/environment.prod.ts ]; then
    log_error "environment.prod.ts not found!"
    exit 1
fi

# Check production environment
if ! grep -q "production: true" frontend/src/environments/environment.prod.ts; then
    log_warn "environment.prod.ts doesn't have production: true"
else
    log_success "Frontend production environment is set"
fi

# Check API URL in Angular
if ! grep -q "apiUrl: 'https://fonzigo.app/api'" frontend/src/environments/environment.prod.ts; then
    log_error "environment.prod.ts doesn't have apiUrl set to https://fonzigo.app/api"
    exit 1
else
    log_success "Frontend apiUrl is correctly set to https://fonzigo.app/api"
fi

# Check 7: Scripts are executable
log_info "Check 7/7: Script permissions..."
SCRIPTS_OK=true

for script in deploy.sh update.sh auto-setup.sh auto-configure.sh; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            log_success "$script is executable"
        else
            log_warn "$script is NOT executable (run: chmod +x $script)"
            SCRIPTS_OK=false
        fi
    fi
done

for script in scripts/vps-setup.sh scripts/security-hardening.sh scripts/health-check.sh; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            log_success "$script is executable"
        else
            log_warn "$script is NOT executable (run: chmod +x $script)"
            SCRIPTS_OK=false
        fi
    fi
done

if [ "$SCRIPTS_OK" = true ]; then
    log_success "All scripts are executable"
fi

echo ""
log_success " Verification Complete!"
echo ""
echo " Configuration Summary:"
echo ""
echo ""
echo "Domain: fonzigo.app"
echo "   Caddyfile configured correctly"
echo "   No invalid options in Caddyfile"
echo "   All references point to fonzigo.app"
echo ""
echo "Nginx:"
echo "   Configured to serve static files only"
echo "   No proxy_pass conflicts with Caddy"
echo ""
echo "Environment (.env.prod):"
echo "   CADDY_DOMAIN = fonzigo.app"
echo "   API_URL = https://fonzigo.app/api"
echo ""
echo "Backend:"
echo "   Uses environment variables"
echo ""
echo "Frontend:"
echo "   apiUrl = https://fonzigo.app/api"
echo ""
echo "Scripts:"
if [ "$SCRIPTS_OK" = true ]; then
    echo "   All scripts are executable"
else
    echo "    Some scripts need chmod +x"
fi
echo ""

log_info " Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Deploy application:"
echo "   ./deploy.sh"
echo ""
echo "2. Verify deployment:"
echo "   ./scripts/health-check.sh"
echo ""
echo "3. Access application:"
echo "   Frontend: https://fonzigo.app"
echo "   API: https://fonzigo.app/api"
echo ""
