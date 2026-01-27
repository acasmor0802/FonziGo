# FonziGo Quick Start Guide

Quick reference guide for deploying FonziGo on VPS.

---

## 🚀 Quick Deployment (5 minutes)

```bash
# 1. Connect to VPS
ssh root@your-vps-ip

# 2. Clone and setup
cd /opt
git clone https://github.com/acasmor0802/FonziGo.git
cd FonziGo
sudo bash scripts/vps-setup.sh

# 3. Configure environment
nano .env.prod
# Update:
#   POSTGRES_PASSWORD (generate: openssl rand -base64 32)
#   SECURITY_JWT_SECRET_KEY (generate: openssl rand -base64 64)
#   GOOGLE_CLIENT_ID
#   TZ=Europe/Madrid

# 4. Deploy
./deploy.sh

# 5. Verify
# Visit https://fonzigo.app
```

---

## 🔧 Configuration Steps

### Generate Secure Passwords

```bash
# Database password
openssl rand -base64 32

# JWT secret
openssl rand -base64 64
```

### DNS Configuration

Add A records in your domain registrar:

```
Type: A
Name: @ (or fonzigo.app)
Value: YOUR_VPS_IP

Type: A
Name: www
Value: YOUR_VPS_IP
```

---

## 📊 Monitoring Commands

```bash
# Health check
./scripts/health-check.sh

# Container status
docker-compose -f docker-compose.prod.yaml --env-file .env.prod ps

# View logs
docker logs -f fonzigo-backend

# Resource usage
docker stats
```

---

## 🔄 Update Application

```bash
cd /opt/FonziGo
./update.sh
```

---

## 🛠️ Troubleshooting

### Container won't start
```bash
docker logs fonzigo-backend
docker-compose -f docker-compose.prod.yaml --env-file .env.prod restart
```

### SSL not working
```bash
# Check DNS
nslookup fonzigo.app

# Check firewall
sudo ufw status

# Check Caddy logs
docker logs fonzigo-caddy 2>&1 | grep -i certificate
```

### Database connection failed
```bash
docker logs fonzigo-database
docker exec -it fonzigo-database psql -U fonzi -d fonzigo_prod -c "SELECT 1"
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.prod` | Production environment variables |
| `docker-compose.prod.yaml` | Production Docker services |
| `Caddyfile` | Reverse proxy + SSL config |
| `deploy.sh` | Deployment script |
| `update.sh` | Update script |
| `DEPLOYMENT_VPS.md` | Full deployment guide |

---

## 🔐 Security Checklist

- [ ] Changed POSTGRES_PASSWORD from default
- [ ] Changed SECURITY_JWT_SECRET_KEY from default
- [ ] Set GOOGLE_CLIENT_ID
- [ ] Configured DNS to point to VPS
- [ ] Ports 80, 443 open in firewall
- [ ] SSH keys configured
- [ ] Security hardening script run

---

## 🌐 Access URLs

After deployment, access at:

- **Frontend**: https://fonzigo.app
- **API**: https://fonzigo.app/api
- **Health**: https://fonzigo.app/health
- **Swagger**: https://fonzigo.app/swagger-ui.html

---

## 📞 Support

- Full guide: [DEPLOYMENT_VPS.md](DEPLOYMENT_VPS.md)
- Issues: https://github.com/acasmor0802/FonziGo/issues

---

**Last Updated**: 2026-01-27
