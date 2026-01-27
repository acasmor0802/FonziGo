# FonziGo VPS Deployment Guide

Complete guide to deploy FonziGo on Ubuntu 24.04 VPS with Docker, Caddy, and automatic SSL.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial VPS Setup](#initial-vps-setup)
3. [DNS Configuration](#dns-configuration)
4. [Environment Configuration](#environment-configuration)
5. [Deployment](#deployment)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required
- VPS with Ubuntu 24.04 (DigitalOcean, Linode, AWS, etc.)
- Domain name: `fonzigo.app`
- SSH access to VPS
- Root or sudo privileges
- At least 2GB RAM, 1 vCPU, 40GB disk (recommended: 4GB RAM, 2 vCPU)

### Local Development Machine
- Git installed
- SSH client
- Text editor (nano, vim, VS Code, etc.)

---

## Initial VPS Setup

### 1. Connect to VPS

```bash
ssh root@your-vps-ip-address
```

### 2. Run Setup Script

```bash
# Clone repository
cd /opt
git clone https://github.com/acasmor0802/FonziGo.git
cd FonziGo

# Run the setup script
sudo bash scripts/vps-setup.sh
```

**The setup script will:**
- Update system packages
- Install Docker and Docker Compose
- Configure firewall (UFW)
- Setup fail2ban for SSH protection
- Clone the FonziGo repository
- Create environment files
- Configure Docker daemon
- Setup log rotation

### 3. Reboot (Required)

After setup completes, reboot the VPS for all changes to take effect:

```bash
sudo reboot
```

Wait 2-3 minutes, then reconnect:

```bash
ssh root@your-vps-ip-address
```

---

## DNS Configuration

### 1. Get VPS IP Address

```bash
curl -s ifconfig.me
```

### 2. Configure DNS Records

Log into your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add these records:

```
Type: A
Name: @ (or fonzigo.app)
Value: YOUR_VPS_IP_ADDRESS
TTL: 300

Type: A
Name: www
Value: YOUR_VPS_IP_ADDRESS
TTL: 300
```

### 3. Verify DNS Propagation

```bash
# Check DNS resolution
nslookup fonzigo.app
dig fonzigo.app

# Check from external (after 5-30 minutes)
# Use online tool: https://www.whatsmydns.net/
```

DNS propagation typically takes 5-30 minutes, but can take up to 48 hours in rare cases.

---

## Environment Configuration

### 1. Generate Secure Credentials

```bash
cd /opt/FonziGo

# Generate strong database password
openssl rand -base64 32
# Save output, you'll need it

# Generate strong JWT secret (256+ bits)
openssl rand -base64 64
# Save output, you'll need it
```

### 2. Edit Production Environment File

```bash
nano .env.prod
```

Update these values:

```bash
# Database Configuration
POSTGRES_DB=fonzigo_prod
POSTGRES_USER=fonzi
POSTGRES_PASSWORD=PASTE_YOUR_GENERATED_PASSWORD_HERE

# Backend Configuration
SPRING_DATASOURCE_PASSWORD=PASTE_YOUR_GENERATED_PASSWORD_HERE
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false

# JWT Configuration
SECURITY_JWT_SECRET_KEY=PASTE_YOUR_GENERATED_JWT_SECRET_HERE

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_PRODUCTION_GOOGLE_CLIENT_ID

# Other settings
TZ=Europe/Madrid  # or your timezone
```

### 3. Verify Configuration

```bash
# Check file permissions
ls -la .env.prod
# Should be: -rw------- (600)

# If not, fix it:
chmod 600 .env.prod
```

---

## Deployment

### 1. Deploy Application

```bash
cd /opt/FonziGo

# Run deployment script
./deploy.sh
```

**The deployment script will:**
- Validate environment configuration
- Check Docker status
- Pull latest code from GitHub
- Build Docker images
- Start all services
- Perform health checks
- Display logs

### 2. Monitor Deployment

Watch the logs as services start:

```bash
# Watch all logs
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs -f

# Watch specific service
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs -f backend
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs -f frontend
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs -f database
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs -f caddy
```

### 3. Check Service Status

```bash
# Check all containers
docker-compose -f docker-compose.prod.yaml --env-file .env.prod ps

# Check specific container health
docker inspect fonzigo-database --format='{{.State.Health.Status}}'
docker inspect fonzigo-backend --format='{{.State.Health.Status}}'
docker inspect fonzigo-frontend --format='{{.State.Health.Status}}'
docker inspect fonzigo-caddy --format='{{.State.Health.Status}}'
```

### 4. Run Health Check

```bash
# Run comprehensive health check
./scripts/health-check.sh
```

---

## Post-Deployment Steps

### 1. Verify SSL Certificate

Caddy will automatically obtain SSL certificates from Let's Encrypt.

```bash
# Check Caddy logs for SSL
docker logs fonzigo-caddy 2>&1 | grep -i "certificate"

# Check SSL certificate details
openssl s_client -connect fonzigo.app:443 -servername fonzigo.app </dev/null | openssl x509 -noout -dates
```

If SSL fails, check:
- DNS is properly configured
- Ports 80 and 443 are open
- VPS firewall allows traffic
- Caddy can reach Let's Encrypt servers

### 2. Test Application

Open your browser and test:

- **Frontend**: https://fonzigo.app
- **API Health**: https://fonzigo.app/health
- **Backend API**: https://fonzigo.app/api/actuator/health
- **Swagger UI**: https://fonzigo.app/swagger-ui.html

### 3. Verify Database Connection

```bash
# Connect to database
docker exec -it fonzigo-database psql -U fonzi -d fonzigo_prod

# Check tables
\dt

# Check data
SELECT COUNT(*) FROM category;
SELECT COUNT(*) FROM product;
SELECT COUNT(*) FROM supermarket;

# Exit
\q
```

### 4. Security Hardening (Optional but Recommended)

```bash
cd /opt/FonziGo
sudo bash scripts/security-hardening.sh
```

**This script will:**
- Disable root SSH login
- Enforce key-based SSH authentication
- Harden kernel parameters
- Disable unused services
- Install AIDE (Intrusion Detection)
- Secure shared memory
- Configure automatic security updates
- Harden Docker daemon
- Strengthen fail2ban
- Install Rootkit Hunter

### 5. Add SSH Keys for Access (Recommended)

```bash
# On your local machine, generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy to VPS
ssh-copy-id root@your-vps-ip-address

# Test connection
ssh root@your-vps-ip-address
```

After adding SSH keys, the security hardening script will disable password authentication.

---

## Monitoring & Maintenance

### Daily Monitoring

```bash
# Run health check
cd /opt/FonziGo
./scripts/health-check.sh

# Check container status
docker-compose -f docker-compose.prod.yaml --env-file .env.prod ps

# View resource usage
docker stats
```

### Weekly Maintenance

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Pull latest code and update
cd /opt/FonziGo
./update.sh

# Check disk space
df -h

# Check logs for errors
docker logs fonzigo-backend 2>&1 | grep -i error
docker logs fonzigo-database 2>&1 | grep -i error
```

### Monthly Maintenance

```bash
# Clean up old Docker images
docker system prune -a

# Clean up unused volumes
docker volume prune

# Restart services
docker-compose -f docker-compose.prod.yaml --env-file .env.prod restart

# Check system integrity (if AIDE is installed)
aide --check

# Scan for rootkits (if rkhunter is installed)
rkhunter --check
```

### Check Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs

# View logs for specific service
docker logs fonzigo-database
docker logs fonzigo-backend
docker logs fonzigo-frontend
docker logs fonzigo-caddy

# View last 100 lines
docker logs --tail=100 fonzigo-backend

# Follow logs (real-time)
docker logs -f fonzigo-backend

# View logs with timestamps
docker logs -t fonzigo-backend
```

---

## Troubleshooting

### Container Won't Start

**Problem**: Container exits immediately or won't start.

**Solution**:
```bash
# Check container logs
docker logs fonzigo-backend

# Check detailed container status
docker inspect fonzigo-backend

# Check Docker logs
journalctl -u docker.service
```

### SSL Certificate Not Obtained

**Problem**: Caddy fails to obtain SSL certificate.

**Solution**:
```bash
# Check Caddy logs
docker logs fonzigo-caddy 2>&1 | grep -i "error\|certificate"

# Check DNS
nslookup fonzigo.app

# Check firewall
sudo ufw status

# Ensure ports 80 and 443 are open
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check if port 80/443 are accessible from outside
telnet fonzigo.app 80
telnet fonzigo.app 443
```

### Database Connection Failed

**Problem**: Backend can't connect to database.

**Solution**:
```bash
# Check database is running
docker ps | grep database

# Check database logs
docker logs fonzigo-database

# Test database connection
docker exec -it fonzigo-database psql -U fonzi -d fonzigo_prod -c "SELECT 1"

# Check environment variables in backend
docker exec fonzigo-backend env | grep POSTGRES

# Restart services
docker-compose -f docker-compose.prod.yaml --env-file .env.prod restart backend database
```

### Application Not Accessible

**Problem**: Can't access application from browser.

**Solution**:
```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yaml --env-file .env.prod ps

# Check Caddy is running
docker ps | grep caddy

# Check Caddy configuration
docker exec fonzigo-caddy caddy validate --config /etc/caddy/Caddyfile

# Check firewall
sudo ufw status

# Check DNS
nslookup fonzigo.app

# Test connectivity from VPS
curl -I https://fonzigo.app
```

### High Memory/CPU Usage

**Problem**: VPS is slow or services are killed.

**Solution**:
```bash
# Check resource usage
docker stats

# Check system resources
free -h
top

# Increase swap space (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to /etc/fstab to make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Adjust swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### Permission Denied Errors

**Problem**: Permission denied when accessing files or running scripts.

**Solution**:
```bash
# Fix script permissions
chmod +x scripts/*.sh
chmod +x deploy.sh
chmod +x update.sh

# Fix environment file permissions
chmod 600 .env.prod

# Fix directory permissions
chown -R $USER:$USER /opt/FonziGo
chmod -R 755 /opt/FonziGo
```

### Git Pull Fails

**Problem**: Can't pull latest code from GitHub.

**Solution**:
```bash
# Check git status
git status

# Discard local changes
git reset --hard HEAD
git pull origin main

# Or stash changes
git stash
git pull origin main
git stash pop
```

---

## Rollback Procedures

### Rollback to Previous Commit

```bash
cd /opt/FonziGo

# View commit history
git log --oneline

# Checkout previous commit
git checkout <commit-hash>

# Redeploy
./deploy.sh
```

### Restore Database Backup

```bash
# If you have database backups
docker exec -i fonzigo-database psql -U fonzi -d fonzigo_prod < backup.sql

# Or use pg_restore for custom format
docker exec -i fonzigo-database pg_restore -U fonzi -d fonzigo_prod < backup.dump
```

### Restart All Services

```bash
cd /opt/FonziGo

# Stop all services
docker-compose -f docker-compose.prod.yaml --env-file .env.prod down

# Start all services
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d

# Or restart without downtime
docker-compose -f docker-compose.prod.yaml --env-file .env.prod restart
```

---

## Useful Commands Reference

### Docker Commands

```bash
# List containers
docker ps
docker ps -a  # all containers

# View logs
docker logs <container-name>
docker logs -f <container-name>  # follow
docker logs --tail=100 <container-name>

# Execute command in container
docker exec -it <container-name> /bin/bash
docker exec -it <container-name> psql -U fonzi -d fonzigo_prod

# Restart container
docker restart <container-name>

# Stop container
docker stop <container-name>

# Remove container
docker rm <container-name>

# View container stats
docker stats
```

### Docker Compose Commands

```bash
# Start services
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d

# Stop services
docker-compose -f docker-compose.prod.yaml --env-file .env.prod down

# Restart services
docker-compose -f docker-compose.prod.yaml --env-file .env.prod restart

# View logs
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs
docker-compose -f docker-compose.prod.yaml --env-file .env.prod logs -f

# Rebuild and start
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d --build
```

### System Commands

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
htop

# Check processes
ps aux
```

### Firewall Commands

```bash
# Check firewall status
sudo ufw status

# Enable firewall
sudo ufw enable

# Allow port
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny port
sudo ufw deny 22/tcp
```

### Log Commands

```bash
# View system logs
journalctl -u docker.service
journalctl -f  # follow

# View auth logs
sudo tail -f /var/log/auth.log

# View specific time range
journalctl --since "1 hour ago"
journalctl --since yesterday
```

---

## Security Best Practices

1. **Keep System Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use Strong Passwords**
   - Generate with: `openssl rand -base64 32`
   - Change passwords regularly
   - Never share passwords

3. **Use SSH Keys Instead of Passwords**
   - Generate SSH keys on your local machine
   - Disable password authentication in SSH

4. **Monitor Logs Regularly**
   - Check for failed login attempts
   - Look for unusual activity
   - Review error logs

5. **Back Up Your Data**
   - Regular database backups
   - Backup environment files
   - Test restore procedures

6. **Limit Access**
   - Only expose necessary ports (80, 443, 22)
   - Use firewall to restrict access
   - Consider VPN access for admin tasks

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs: `./scripts/health-check.sh`
3. Check GitHub Issues: https://github.com/acasmor0802/FonziGo/issues
4. Create a new issue with details and logs

---

## Next Steps

After successful deployment:

1. ✅ Configure Google OAuth
2. ✅ Test all application features
3. ✅ Set up monitoring and alerts
4. ✅ Configure backups
5. ✅ Set up CI/CD pipeline
6. ✅ Document your deployment process

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
