#!/bin/bash
# ==============================================================================
# FonziGo - Quick Update Script
# Run this to pull latest changes and redeploy
# Usage: ./update.sh
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
echo " FonziGo Quick Update Script"
echo "=============================="
echo ""

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    log_error ".env.prod not found!"
    exit 1
fi

# Pull latest changes from git
log_info "Pulling latest code from GitHub..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    log_info "Current branch: $CURRENT_BRANCH"
    
    git fetch origin
    
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/$CURRENT_BRANCH 2>/dev/null || echo $LOCAL)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        log_info "New changes detected, pulling..."
        git pull origin $CURRENT_BRANCH
        log_success "Latest changes pulled"
        
        # Rebuild and restart
        log_info "Rebuilding and restarting containers..."
        docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d --build
        
        log_success "Update complete!"
        log_info "Check logs: docker-compose -f docker-compose.prod.yaml logs -f"
    else
        log_info "Already up to date"
        log_info "No changes to deploy"
    fi
else
    log_error "Not in a git repository"
    exit 1
fi

echo ""
