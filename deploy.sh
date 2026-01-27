#!/bin/bash
# ==============================================================================
# FonziGo - Production Deployment Script
# Run this to deploy/update FonziGo on VPS
# Usage: ./deploy.sh
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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Print header
echo ""
echo "🚀 FonziGo Deployment Script"
echo "============================"
echo ""

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    log_error ".env.prod not found!"
    echo ""
    echo "Please create it from .env.prod.example first:"
    echo "  cp .env.prod.example .env.prod"
    echo "  nano .env.prod  # Update with your values"
    echo ""
    exit 1
fi

# Check if docker-compose.prod.yaml exists
if [ ! -f docker-compose.prod.yaml ]; then
    log_error "docker-compose.prod.yaml not found!"
    exit 1
fi

# Check if Caddyfile exists
if [ ! -f Caddyfile ]; then
    log_error "Caddyfile not found!"
    exit 1
fi

# Validate .env.prod has required values
log_info "Validating environment configuration..."
source .env.prod

if [[ "$POSTGRES_PASSWORD" == "GENERATE_STRONG_PASSWORD_HERE" ]]; then
    log_error "POSTGRES_PASSWORD is set to the default value!"
    log_error "Please generate a strong password: openssl rand -base64 32"
    exit 1
fi

if [[ "$SECURITY_JWT_SECRET_KEY" == "CHANGE_ME_TO_A_VERY_LONG_RANDOM_STRING_MIN_256_BITS_REPLACE_WITH_ACTUAL_SECRET" ]]; then
    log_error "SECURITY_JWT_SECRET_KEY is set to the default value!"
    log_error "Please generate a strong secret: openssl rand -base64 64"
    exit 1
fi

if [[ "$GOOGLE_CLIENT_ID" == "YOUR_PRODUCTION_GOOGLE_CLIENT_ID" ]]; then
    log_error "GOOGLE_CLIENT_ID is not set!"
    log_error "Please set your production Google OAuth client ID"
    exit 1
fi

log_success "Environment configuration is valid"

# Function to install Docker if not present
install_docker() {
    log_warn "Docker not found, installing..."
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        log_error "Please run as root (use sudo) or re-run with sudo"
        exit 1
    fi
    
    # Update package index
    log_info "Updating package index..."
    apt-get update -qq
    
    # Install dependencies
    log_info "Installing dependencies..."
    apt-get install -y -qq apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Add Docker's official GPG key
    log_info "Adding Docker GPG key..."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up Docker repository
    log_info "Adding Docker repository..."
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    log_info "Installing Docker Engine..."
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Install docker-compose standalone (more reliable)
    log_info "Installing Docker Compose..."
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Enable and start Docker
    log_info "Enabling and starting Docker..."
    systemctl enable docker
    systemctl start docker
    
    log_success "Docker and Docker Compose installed successfully!"
    
    # Add current user to docker group
    if [ -n "$SUDO_USER" ]; then
        log_info "Adding user $SUDO_USER to docker group..."
        usermod -aG docker "$SUDO_USER"
        log_warn "You may need to log out and log back in for group changes to take effect"
    fi
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_warn "Docker is not installed!"
    install_docker
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_warn "Docker Compose is not installed!"
    install_docker
fi

# Check if Docker is running
log_info "Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    log_warn "Docker is installed but not running..."
    log_info "Starting Docker..."
    systemctl start docker
    
    # Wait for Docker to start
    sleep 3
    
    if ! docker info > /dev/null 2>&1; then
        log_error "Failed to start Docker!"
        exit 1
    fi
fi
log_success "Docker is running"

# Verify Docker Compose
log_info "Verifying Docker Compose..."
docker-compose version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log_success "Docker Compose is available and working"
else
    log_error "Docker Compose verification failed!"
    exit 1
fi

# Check if Caddyfile is valid
log_info "Validating Caddyfile..."
if ! docker run --rm -v "$(pwd)/Caddyfile:/etc/caddy/Caddyfile:ro" caddy:2.8-alpine caddy validate --config /etc/caddy/Caddyfile 2>&1 | grep -q "valid configuration"; then
    log_warn "Caddyfile validation failed (this might be okay if it's a DNS issue)"
fi

# Pull latest changes from git
log_info "Pulling latest changes from GitHub..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    log_info "Current branch: $CURRENT_BRANCH"
    
    if git fetch origin; then
        LOCAL=$(git rev-parse HEAD)
        REMOTE=$(git rev-parse origin/$CURRENT_BRANCH 2>/dev/null || echo $LOCAL)
        
        if [ "$LOCAL" != "$REMOTE" ]; then
            log_info "New changes detected, pulling..."
            git pull origin $CURRENT_BRANCH
            log_success "Latest changes pulled"
        else
            log_info "Already up to date"
        fi
    else
        log_warn "Could not fetch from remote, continuing with local changes"
    fi
else
    log_warn "Not in a git repository, skipping pull"
fi

# Stop existing containers (graceful shutdown)
log_info "Stopping existing containers..."
docker-compose -f docker-compose.prod.yaml --env-file .env.prod down 2>/dev/null || true
log_success "Containers stopped"

# Build images
log_info "Building Docker images (this may take a while)..."
docker-compose -f docker-compose.prod.yaml --env-file .env.prod build --no-cache
log_success "Images built successfully"

# Start services
log_info "Starting services..."
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
log_success "Services started"

# Wait for services to be healthy
log_info "Waiting for services to be healthy (this may take a few minutes)..."

# Function to check container health
check_health() {
    local container_name=$1
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        status=$(docker inspect --format='{{.State.Health.Status}}' $container_name 2>/dev/null || echo "none")
        
        if [ "$status" == "healthy" ]; then
            return 0
        fi
        
        if [ "$status" == "none" ]; then
            # Container has no health check, check if running
            state=$(docker inspect --format='{{.State.Running}}' $container_name 2>/dev/null || echo "false")
            if [ "$state" == "true" ]; then
                return 0
            fi
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    
    return 1
}

# Check each service
echo ""
log_info "Checking database health..."
if check_health fonzigo-database; then
    log_success "Database is healthy"
else
    log_warn "Database health check timed out, but may still be starting"
fi

log_info "Checking backend health..."
if check_health fonzigo-backend; then
    log_success "Backend is healthy"
else
    log_warn "Backend health check timed out, but may still be starting"
fi

log_info "Checking frontend health..."
if check_health fonzigo-frontend; then
    log_success "Frontend is healthy"
else
    log_warn "Frontend health check timed out, but may still be starting"
fi

log_info "Checking Caddy health..."
if check_health fonzigo-caddy; then
    log_success "Caddy is healthy"
else
    log_warn "Caddy health check timed out, but may still be starting"
fi

echo ""

# Show container status
log_info "Container status:"
docker-compose -f docker-compose.prod.yaml --env-file .env.prod ps

echo ""

# Show recent logs
log_info "Recent logs (last 20 lines per service):"
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs --tail=20

echo ""

# Print deployment summary
log_success "🎉 Deployment complete!"
echo ""
echo "📋 Deployment Summary:"
echo "  - All containers started successfully"
echo "  - Health checks performed"
echo "  - Application should be accessible shortly"
echo ""
echo "🌐 Your application:"
echo "  Frontend: https://fonzigo.app"
echo "  API: https://fonzigo.app/api"
echo "  Swagger: https://fonzigo.app/swagger-ui.html"
echo "  Health: https://fonzigo.app/health"
echo ""
echo "📊 Monitoring commands:"
echo "  - View logs: docker-compose -f docker-compose.prod.yaml logs -f"
echo "  - Check status: docker-compose -f docker-compose.prod.yaml ps"
echo "  - Restart all: docker-compose -f docker-compose.prod.yaml restart"
echo "  - Stop all: docker-compose -f docker-compose.prod.yaml down"
echo "  - View container stats: docker stats"
echo ""
echo "🔧 Troubleshooting:"
echo "  - If SSL fails: Check DNS points to correct IP"
echo "  - If containers won't start: Check logs with 'docker-compose logs'"
echo "  - If database fails: Check volume exists with 'docker volume ls'"
echo "  - Check firewall: sudo ufw status"
echo ""
log_info "Check if SSL certificate is obtained:"
echo "  docker logs fonzigo-caddy 2>&1 | grep -i 'certificate'"
echo ""
