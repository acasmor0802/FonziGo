#!/bin/bash
# ==============================================================================
# FonziGo - Security Hardening Script
# Run this after initial VPS setup to harden security
# Usage: sudo bash scripts/security-hardening.sh
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

echo ""
echo "🔒 FonziGo Security Hardening Script"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root (use sudo)"
    exit 1
fi

log_info "Starting security hardening..."
echo ""

# 1. SSH Hardening
log_info "1. SSH Hardening..."
SSHD_CONFIG="/etc/ssh/sshd_config"

# Backup original config
cp $SSHD_CONFIG ${SSHD_CONFIG}.bak

# Disable root login
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' $SSHD_CONFIG
log_success "  - Root login disabled"

# Disable password authentication (key-based only)
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' $SSHD_CONFIG
log_success "  - Password authentication disabled (key-based only)"

# Set login grace time
sed -i 's/^#*LoginGraceTime.*/LoginGraceTime 60/' $SSHD_CONFIG
log_success "  - Login grace time set to 60s"

# Set max auth tries
sed -i 's/^#*MaxAuthTries.*/MaxAuthTries 3/' $SSHD_CONFIG
log_success "  - Max auth tries set to 3"

# Restart SSH
systemctl restart sshd
log_success "SSH configuration updated and service restarted"
echo ""

# 2. Kernel Hardening
log_info "2. Kernel Hardening..."
SYSCTL_CONF="/etc/sysctl.d/99-security.conf"

cat > $SYSCTL_CONF <<EOF
# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0

# Block SYN attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Log Martians
net.ipv4.conf.all.log_martians = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Ignore Directed Pings
net.ipv4.icmp_echo_ignore_all = 0

# System hardening
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.perf_event_paranoid = 2

# File system hardening
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
EOF

# Apply sysctl settings
sysctl -p $SYSCTL_CONF > /dev/null 2>&1
log_success "Kernel security parameters applied"
echo ""

# 3. Disable unused services
log_info "3. Disabling unused services..."

# List of services to disable
DISABLED_SERVICES=("cups" "avahi-daemon" "bluetooth" "cups-browsed")

for service in "${DISABLED_SERVICES[@]}"; do
    if systemctl list-unit-files | grep -q "^${service}.service"; then
        systemctl disable $service 2>/dev/null || true
        systemctl stop $service 2>/dev/null || true
        log_success "  - $service disabled"
    fi
done
echo ""

# 4. Configure AIDE (Advanced Intrusion Detection)
log_info "4. Installing AIDE..."
if ! dpkg -l | grep -q aide; then
    apt install -y aide
    aide --init
    mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
    log_success "AIDE installed and initialized"
    log_warn "  Run 'aide --check' to verify system integrity"
else
    log_info "AIDE already installed"
fi
echo ""

# 5. Secure shared memory
log_info "5. Securing shared memory..."
if ! grep -q "^tmpfs /run/shm" /etc/fstab; then
    echo "tmpfs /run/shm tmpfs defaults,noexec,nosuid,size=1G 0 0" >> /etc/fstab
    mount -o remount /run/shm
    log_success "Shared memory secured (noexec, nosuid)"
else
    log_info "Shared memory already secured"
fi
echo ""

# 6. Configure automatic security updates
log_info "6. Configuring automatic security updates..."
if ! dpkg -l | grep -q unattended-upgrades; then
    apt install -y unattended-upgrades
fi

cat > /etc/apt/apt.conf.d/50unattended-upgrades <<EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}";
    "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

dpkg-reconfigure --priority=low unattended-upgrades
log_success "Automatic security updates configured"
echo ""

# 7. Docker Security
log_info "7. Docker Security Hardening..."

# Create Docker daemon config if it doesn't exist
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
  "live-restore": true,
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "default-runtime": "runc",
  "storage-driver": "overlay2",
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 5
}
EOF

systemctl restart docker
log_success "Docker security hardening applied"
echo ""

# 8. Configure fail2ban
log_info "8. Strengthening Fail2ban..."

cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = admin@fonzigo.app
sendername = Fail2Ban
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

systemctl restart fail2ban
log_success "Fail2ban strengthened"
echo ""

# 9. System file permissions
log_info "9. Securing system files..."

# Secure critical files
chmod 600 /etc/ssh/sshd_config
chmod 644 /etc/sysctl.d/99-security.conf
chmod 644 /etc/fail2ban/jail.local

log_success "System file permissions secured"
echo ""

# 10. Install and configure rkhunter (rootkit hunter)
log_info "10. Installing Rootkit Hunter..."
if ! dpkg -l | grep -q rkhunter; then
    apt install -y rkhunter
    rkhunter --update
    rkhunter --propupd
    log_success "Rootkit Hunter installed"
    log_warn "  Run 'rkhunter --check' to scan for rootkits"
else
    log_info "Rootkit Hunter already installed"
fi
echo ""

# Print summary
log_success "🎉 Security hardening complete!"
echo ""
echo "📋 Security hardening summary:"
echo "  ✅ SSH hardened (root login disabled, key-based auth only)"
echo "  ✅ Kernel security parameters applied"
echo "  ✅ Unused services disabled"
echo "  ✅ AIDE (Intrusion Detection) installed"
echo "  ✅ Shared memory secured"
echo "  ✅ Automatic security updates configured"
echo "  ✅ Docker hardened"
echo "  ✅ Fail2ban strengthened"
echo "  ✅ System file permissions secured"
echo "  ✅ Rootkit Hunter installed"
echo ""
echo "📝 Important notes:"
echo "  - SSH root login is disabled"
echo "  - SSH password authentication is disabled (use SSH keys only)"
echo "  - Fail2ban will ban IPs after 3 failed attempts"
echo "  - Security updates will be installed automatically"
echo ""
echo "🔍 Security audit commands:"
echo "  - Check system integrity: aide --check"
echo "  - Scan for rootkits: rkhunter --check"
echo "  - View fail2ban status: fail2ban-client status"
echo "  - View firewall status: ufw status"
echo ""
log_warn "Remember to keep the system updated with: apt update && apt upgrade"
echo ""
