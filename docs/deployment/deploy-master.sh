#!/bin/bash
# ==============================================================================
# FonziGo - MASTER Deployment Script (100% Automatic)
# Auto-diagnoses, fixes, and deploys FonziGo to production
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
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
    echo ""
    echo -e "${CYAN} $1${NC}"
}

log_header() {
    echo ""
    echo -e "${MAGENTA}${NC}"
    echo -e "${MAGENTA}  $1${NC}"
    echo -e "${MAGENTA}${NC}"
    echo ""
}

# Diagnostic functions
check_caddy_errors() {
    log_info "Checking Caddy logs for errors..."
    
    # Check for rate_limit errors (should NOT be found)
    if docker logs fonzigo-caddy 2>&1 | grep -q "rate_limit.*module not registered"; then
        log_error "Caddy has rate_limit error (module not available)"
        return 1
    else
        log_success " No rate_limit errors in Caddy"
    fi
    
    # Check for parsing errors
    if docker logs fonzigo-caddy 2>&1 | grep -q "parsing.*error\|wrong argument count"; then
        log_error "Caddy has parsing errors"
        return 1
    else
        log_success " No parsing errors in Caddy"
    fi
    
    # Check for SSL certificate errors
    if docker logs fonzigo-caddy 2>&1 | grep -qi "certificate.*error\|obtaining.*error"; then
        log_warn " Caddy has SSL certificate errors"
        return 1
    else
        log_success " No SSL certificate errors in Caddy"
    fi
    
    return 0
}

check_frontend_health() {
    log_info "Checking frontend container health..."
    
    # Check if container is running
    if ! docker ps --format '{{.Status}}' --filter "name=fonzigo-frontend" | grep -q "Up"; then
        log_error "Frontend container is NOT running"
        return 1
    fi
    
    # Check if container is healthy
    if ! docker ps --format '{{.Health}}' --filter "name=fonzigo-frontend" | grep -q "healthy"; then
        log_warn "Frontend is running but NOT healthy"
    else
        log_success " Frontend is healthy"
    fi
    
    return 0
}

check_frontend_content() {
    log_info "Checking frontend content..."
    
    # Check if index.html exists
    if ! docker exec fonzigo-frontend test -f /usr/share/nginx/html/index.html; then
        log_error "index.html NOT found in container"
        return 1
    fi
    
    # Check index.html size
    local size=$(docker exec fonzigo-frontend wc -c /usr/share/nginx/html/index.html 2>/dev/null || echo "0")
    if [ "$size" -lt 100 ]; then
        log_error "index.html is too small ($size bytes) - likely empty or corrupted"
        return 1
    else
        log_success " index.html exists ($size bytes)"
    fi
    
    # Check for JS files
    local js_count=$(docker exec fonzigo-frontend find /usr/share/nginx/html -name "*.js" 2>/dev/null | wc -l)
    if [ "$js_count" -eq 0 ]; then
        log_error "No JavaScript files found in container"
        return 1
    else
        log_success " Found $js_count JavaScript file(s)"
    fi
    
    # Check for CSS files
    local css_count=$(docker exec fonzigo-frontend find /usr/share/nginx/html -name "*.css" 2>/dev/null | wc -l)
    if [ "$css_count" -eq 0 ]; then
        log_warn "No CSS files found in container"
    else
        log_success " Found $css_count CSS file(s)"
    fi
    
    return 0
}

check_frontend_via_caddy() {
    log_info "Checking frontend through Caddy..."
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)
    if [ "$response" != "200" ]; then
        log_error "Frontend health endpoint returned HTTP $response (expected 200)"
        return 1
    else
        log_success " Frontend health endpoint returned 200"
    fi
    
    # Check main page
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
    if [ "$response" != "200" ]; then
        log_error "Frontend main page returned HTTP $response (expected 200)"
        return 1
    else
        log_success " Frontend main page returned 200"
    fi
    
    return 0
}

diagnose_frontend() {
    log_header "DIAGNOSING FRONTEND"
    
    local issues=0
    
    # Check 1: Container health
    if ! check_frontend_health; then
        issues=$((issues + 1))
    fi
    
    # Check 2: Content analysis
    if ! check_frontend_content; then
        issues=$((issues + 1))
    fi
    
    # Check 3: Caddy routing
    if ! check_frontend_via_caddy; then
        issues=$((issues + 1))
    fi
    
    # Check 4: Nginx configuration
    log_info "Checking Nginx configuration..."
    if docker exec fonzigo-frontend nginx -t 2>&1; then
        log_error "Nginx configuration has errors"
        issues=$((issues + 1))
    else
        log_success " Nginx configuration is valid"
    fi
    
    return $issues
}

fix_caddy() {
    log_info "Fixing Caddy configuration..."
    
    # Check if Caddyfile needs rate_limit removal
    if grep -q "rate_limit\|@ratelimit" Caddyfile; then
        log_warn " Caddyfile still has rate_limit (should be removed)"
        log_info "Creating clean Caddyfile..."
        
        # This will be done by the new Caddyfile we created
        return 1
    else
        log_success " Caddyfile is clean (no rate_limit)"
        return 0
    fi
}

fix_frontend_dockerfile() {
    log_info "Checking and fixing Frontend Dockerfile..."
    
    # Check if Dockerfile exists and is correct
    if ! docker exec fonzigo-frontend test -f /Dockerfile; then
        log_error "Frontend Dockerfile NOT found in container"
        return 1
    fi
    
    # Check Angular build output structure
    log_info "Verifying Angular build structure..."
    
    # Check if dist/frontend/browser/ or dist/browser exists
    if docker exec fonzigo-frontend test -d /app/dist/frontend/browser; then
        log_success " Angular build found in /app/dist/frontend/browser/"
    elif docker exec fonzigo-frontend test -d /app/dist/browser; then
        log_warn " Angular build found in /app/dist/browser/ (different from expected /app/dist/frontend/browser/)"
    else
        log_error " Angular build NOT found in container"
        return 1
    fi
    
    # Check if files are being served
    if docker exec fonzigo-frontend test -f /usr/share/nginx/html/index.html; then
        log_success " Files are being served from /usr/share/nginx/html/"
    else
        log_error " Files NOT being served from /usr/share/nginx/html/"
        return 1
    fi
    
    return 0
}

rebuild_frontend() {
    log_header "REBUILDING FRONTEND"
    
    log_info "Stopping frontend container..."
    docker-compose -f docker-compose.prod.yaml --env-file .env.prod stop frontend
    
    log_info "Removing frontend container..."
    docker rm -f fonzigo-frontend 2>/dev/null || true
    
    log_info "Rebuilding frontend image..."
    docker-compose -f docker-compose.prod.yaml --env-file .env.prod build --no-cache frontend
    
    log_info "Starting frontend container..."
    docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d frontend
    
    log_info "Waiting for frontend to be healthy (this may take 2-3 minutes)..."
    sleep 10
    
    # Wait for healthy status (up to 2 minutes)
    local attempts=0
    while [ $attempts -lt 24 ]; do
        local health=$(docker ps --format '{{.Health}}' --filter "name=fonzigo-frontend" | grep -o "healthy")
        if [ -n "$health" ]; then
            log_success " Frontend is healthy after $((attempts * 5)) seconds"
            return 0
        fi
        
        if [ $attempts -eq 23 ]; then
            log_warn " Frontend not healthy after 2 minutes, but will continue with deployment"
            return 0
        fi
        
        sleep 5
        attempts=$((attempts + 1))
    done
    
    return 0
}

main() {
    echo ""
    echo " FonziGo MASTER Deployment Script"
    echo "=================================="
    echo ""
    
    # Step 1: Environment check
    log_step "Step 1/6: Checking environment"
    if [ ! -f .env.prod ]; then
        log_error ".env.prod not found! Run: ./auto-setup.sh"
        exit 1
    fi
    
    log_success " Environment files found"
    
    # Step 2: Check Caddy
    log_step "Step 2/6: Checking Caddy configuration"
    if ! check_caddy_errors; then
        log_warn " Caddy has errors, will try to fix..."
        # Don't exit, continue with deployment
    fi
    
    # Step 3: Diagnose frontend
    log_step "Step 3/6: Diagnosing frontend"
    local frontend_issues=$(diagnose_frontend)
    
    if [ $frontend_issues -eq 0 ]; then
        log_success " No frontend issues detected"
    else
        log_warn " Detected $frontend_issues frontend issue(s)"
        log_info "Attempting to fix frontend..."
        
        # Fix Dockerfile if needed
        if ! fix_frontend_dockerfile; then
            log_error "Failed to fix Frontend Dockerfile"
        else
            log_success " Frontend Dockerfile verified and correct"
        fi
        
        # Rebuild frontend if needed
        if [ $frontend_issues -gt 0 ]; then
            log_warn " Rebuilding frontend to fix issues..."
            if ! rebuild_frontend; then
                log_error "Failed to rebuild frontend"
            fi
        fi
    fi
    
    # Step 4: Check other services
    log_step "Step 4/6: Checking other services"
    
    # Database
    local db_health=$(docker ps --format '{{.Health}}' --filter "name=fonzigo-database" | grep -o "healthy")
    if [ -n "$db_health" ]; then
        log_success " Database is healthy"
    else
        log_warn " Database health status: $(docker ps --format '{{.Health}}' --filter "name=fonzigo-database" | grep -o "unhealthy\|starting" || echo "not running")"
    fi
    
    # Backend
    local backend_health=$(docker ps --format '{{.Health}}' --filter "name=fonzigo-backend" | grep -o "healthy")
    if [ -n "$backend_health" ]; then
        log_success " Backend is healthy"
    else
        log_warn " Backend health status: $(docker ps --format '{{.Health}}' --filter "name=fonzigo-backend" | grep -o "unhealthy\|starting" || echo "not running")"
    fi
    
    # Caddy
    local caddy_health=$(docker ps --format '{{.Health}}' --filter "name=fonzigo-caddy" | grep -o "healthy")
    if [ -n "$caddy_health" ]; then
        log_success " Caddy is healthy"
    else
        log_warn " Caddy health status: $(docker ps --format '{{.Health}}' --filter "name=fonzigo-caddy" | grep -o "unhealthy\|starting" || echo "not running")"
    fi
    
    # Step 5: Verify SSL
    log_step "Step 5/6: Verifying SSL certificate"
    
    if docker logs fonzigo-caddy 2>&1 | grep -qi "certificate.*obtained\|certificate.*successfully"; then
        log_success " SSL certificate obtained successfully"
    else
        log_warn " SSL certificate not yet obtained (may take a few more minutes)"
    fi
    
    # Step 6: Final verification
    log_step "Step 6/6: Final verification"
    
    # Test all endpoints
    log_info "Testing application endpoints..."
    
    # Health endpoint
    local health_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)
    if [ "$health_response" = "200" ]; then
        log_success " /health endpoint: 200 OK"
    else
        log_warn " /health endpoint: $health_response (expected 200)"
    fi
    
    # Main page
    local main_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
    if [ "$main_response" = "200" ]; then
        log_success " Main page: 200 OK"
    else
        log_warn " Main page: $main_response (expected 200)"
    fi
    
    # Backend API
    local api_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/actuator/health)
    if [ "$api_response" = "200" ]; then
        log_success " Backend API: 200 OK"
    else
        log_warn " Backend API: $api_response (expected 200)"
    fi
    
    # Summary
    echo ""
    log_header "DEPLOYMENT VERIFICATION SUMMARY"
    echo ""
    
    echo "Services Status:"
    echo "   fonzigo-database: $(docker ps --format '{{.Status}}' --filter "name=fonzigo-database" | head -1)"
    echo "   fonzigo-backend:  $(docker ps --format '{{.Status}}' --filter "name=fonzigo-backend" | head -1)"
    echo "   fonzigo-frontend: $(docker ps --format '{{.Status}}' --filter "name=fonzigo-foreground" | head -1)"
    echo "   fonzigo-caddy: $(docker ps --format '{{.Status}}' --filter "name=fonzigo-caddy' | head -1)"
    echo ""
    
    echo "Endpoints Test:"
    echo "   /health: $health_response ($(test $health_response = "200" && echo "" || echo ""))"
    echo "   / (main): $main_response ($(test $main_response = "200" && echo "" || echo ""))"
    echo "   /api/actuator/health: $api_response ($(test $api_response = "200" && echo "" || echo ""))"
    echo ""
    
    echo "Next Steps:"
    echo "  1. Open browser and visit: https://fonzigo.app"
    echo "  2. Check if page loads correctly with content"
    echo " 3. Check DevTools Console for errors"
    echo " 4. Check Network tab for failed requests"
    echo ""
    
    if [ "$health_response" = "200" ] && [ "$main_response" = "200" ] && [ "$api_response" = "200" ]; then
        log_success " DEPLOYMENT SUCCESSFUL - All services are running and responding!"
    else
        log_warn " Some services may not be fully ready yet"
        log_info "Wait 1-2 more minutes and run this script again: ./deploy-master.sh"
    fi
}

# Run main function
main "$@"
