#!/bin/bash
# ==============================================================================
# FonziGo - VPS Initial Setup Script (Ubuntu 24.04)
# Run this ONCE after spinning up a fresh VPS
# Usage: sudo bash vps-setup.sh
# ==============================================================================

set -e  # Exit on error

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

echo "🚀 FonziGo VPS Setup Script"
echo "============================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root (use sudo)"
    exit 1
fi

# Check Ubuntu version
UBUNTU_VERSION=$(lsb_release -rs)
if [ "$UBUNTU_VERSION" != "24.04" ]; then
    log_warn "This script is designed for Ubuntu 24.04. You're running Ubuntu $UBUNTU_VERSION"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
log_info "Updating system packages..."
apt update && apt upgrade -y
log_success "System updated"

# Install required packages
log_info "Installing required packages..."
apt install -y \
    curl \
    wget \
    git \
    docker.io \
    docker-compose \
    ufw \
    fail2ban \
    htop \
    nano \
    vim \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release
log_success "Packages installed"

# Enable and start Docker
log_info "Starting Docker service..."
systemctl enable docker
systemctl start docker
log_success "Docker started"

# Add current user to docker group
log_info "Adding user to docker group..."
if [ -n "$SUDO_USER" ]; then
    usermod -aG docker "$SUDO_USER"
    log_success "User $SUDO_USER added to docker group"
    log_warn "You may need to log out and log back in for this to take effect"
fi

# Configure firewall
log_info "Configuring firewall (UFW)..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh/tcp
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
log_success "Firewall configured and enabled"

# Configure fail2ban
log_info "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = admin@fonzigo.app
sendername = Fail2Ban
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl restart fail2ban
log_success "Fail2ban configured and started"

# Setup project directory
log_info "Creating project directory..."
mkdir -p /opt/fonzigo
cd /opt/fonzigo

# Clone repository
log_info "Cloning FonziGo repository..."
if [ -d ".git" ]; then
    log_warn "Repository already exists, pulling latest changes..."
    git pull origin main
else
    git clone https://github.com/acasmor0802/FonziGo.git .
fi
log_success "Repository cloned/updated"

# Setup environment files
log_info "Setting up environment files..."
chmod +x .env.setup.sh
bash .env.setup.sh

# Create necessary directories
log_info "Creating data directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p backups
log_success "Directories created"

# Set permissions
log_info "Setting permissions..."
chown -R root:root /opt/fonzigo
chmod -R 755 /opt/fonzigo
chmod +x scripts/*.sh
chmod 600 /opt/fonzigo/.env.prod 2>/dev/null || true
log_success "Permissions set"

# Configure Docker daemon for security and logging
log_info "Configuring Docker daemon..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "icc": false,
  "userland-proxy": false,
  "no-new-privileges": true,
  "live-restore": true
}
EOF

systemctl restart docker
log_success "Docker daemon configured"

# Setup log rotation for system logs
log_info "Configuring log rotation..."
cat > /etc/logrotate.d/fonzigo <<EOF
/opt/fonzigo/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        docker-compose -f /opt/fonzigo/docker-compose.prod.yaml --env-file /opt/fonzigo/.env.prod exec -T frontend nginx -s reopen >/dev/null 2>&1 || true
    endscript
}
EOF
log_success "Log rotation configured"

# Install monitoring tools (optional)
log_info "Installing monitoring tools..."
apt install -y sysstat iotop
systemctl enable sysstat
systemctl start sysstat
log_success "Monitoring tools installed"

# Print summary
echo ""
log_success "🎉 VPS setup complete!"
echo ""
echo "📋 Setup Summary:"
echo "  - Docker and Docker Compose installed"
echo "  - Firewall configured (ports: 22, 80, 443)"
echo "  - Fail2ban configured for SSH protection"
echo "  - FonziGo repository cloned to /opt/fonzigo"
echo "  - Environment files created"
echo "  - Docker daemon configured for security"
echo "  - Log rotation configured"
echo ""
echo "📝 CRITICAL NEXT STEPS:"
echo ""
echo "1. Edit production environment file:"
echo "   nano /opt/fonzigo/.env.prod"
echo ""
echo "2. Generate and set these values in .env.prod:"
echo "   - POSTGRES_PASSWORD (run: openssl rand -base64 32)"
echo "   - SECURITY_JWT_SECRET_KEY (run: openssl rand -base64 64)"
echo "   - GOOGLE_CLIENT_ID (your production Google OAuth client ID)"
echo ""
echo "3. Point your DNS (fonzigo.app) to this VPS IP address:"
echo "   A record: fonzigo.app → $(curl -s ifconfig.me)"
echo ""
echo "4. Wait for DNS propagation (usually 5-30 minutes)"
echo ""
echo "5. Deploy the application:"
echo "   cd /opt/fonzigo"
echo "   ./deploy.sh"
echo ""
echo "🔍 Useful commands:"
echo "   - Check service status: docker-compose -f /opt/fonzigo/docker-compose.prod.yaml ps"
echo "   - View logs: docker-compose -f /opt/fonzigo/docker-compose.prod.yaml logs -f"
echo "   - Restart services: docker-compose -f /opt/fonzigo/docker-compose.prod.yaml restart"
echo "   - Check firewall: sudo ufw status"
echo "   - Check fail2ban: sudo fail2ban-client status"
echo ""
log_warn "Make sure to configure .env.prod before deploying!"
echo ""
