# 🔧 Auto-Configuration Scripts

Two scripts to automatically generate secure credentials and configure all environment files.

---

## 🚀 Quick Start

### Option 1: One-Click Setup (Simple)
```bash
./auto-setup.sh
```
This script:
- ✅ Generates ALL credentials automatically
- ✅ Creates `.env` (development)
- ✅ Creates `.env.prod` (production)
- ✅ Creates `.credentials-backup.txt`
- ✅ Sets secure permissions (600)
- ✅ Ready to deploy immediately

### Option 2: Interactive Setup (Detailed)
```bash
./auto-configure.sh
```
This script:
- ✅ Generates ALL credentials automatically
- ✅ Creates `.env` (development)
- ✅ Creates `.env.prod` (production)
- ✅ Creates `.credentials-backup.txt`
- ✅ Shows detailed step-by-step progress
- ✅ Provides security warnings
- ✅ Next steps guidance

---

## 📋 What Gets Generated

| Credential | Length | Usage |
|------------|---------|--------|
| **Database Password** | 28 chars (base64) | PostgreSQL authentication |
| **JWT Secret** | 60 chars (base64) | JWT token signing |
| **Session Secret** | 28 chars (base64) | Session encryption |
| **API Key** | 28 chars (base64) | Optional API authentication |

All generated using OpenSSL with base64 encoding.

---

## 🔐 Security Features

### Auto-Generated Credentials
- ✅ Strong random passwords
- ✅ Base64 encoding for compatibility
- ✅ No predictable patterns
- ✅ No default values

### File Permissions
- ✅ `.env` - 600 (owner read/write only)
- ✅ `.env.prod` - 600 (owner read/write only)
- ✅ `.credentials-backup.txt` - 600 (owner read/write only)

### Backup File
- ✅ All credentials saved to `.credentials-backup.txt`
- ✅ Includes generation timestamp
- ✅ Includes hostname and user
- ⚠️ **Must be deleted after saving to password manager**

---

## 📁 Files Created

```
FonziGo/
├── .env                       # Development environment (auto-generated)
├── .env.prod                  # Production environment (auto-generated)
├── .credentials-backup.txt     # Credentials backup (delete after saving)
├── auto-setup.sh               # ⭐ One-click setup script
└── auto-configure.sh          # Interactive setup script
```

---

## 🎯 Usage Examples

### Development Setup
```bash
# 1. Run auto-setup
./auto-setup.sh

# 2. Check credentials backup
cat .credentials-backup.txt

# 3. Start development
docker-compose -f docker-compose.dev.yaml --env-file .env up -d
```

### Production Setup
```bash
# 1. On VPS, clone repo
cd /opt/FonziGo

# 2. Run auto-setup
./auto-setup.sh

# 3. Deploy
./deploy.sh
```

---

## 📋 Environment Variables Created

### Database
```bash
POSTGRES_DB=fonzigo_dev    (development)
POSTGRES_DB=fonzigo_prod   (production)
POSTGRES_USER=fonzi
POSTGRES_PASSWORD=GENERATED
POSTGRES_HOST=database
POSTGRES_PORT=5432
```

### Backend
```bash
SPRING_PROFILES_ACTIVE=dev/prod
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=fonzi
SPRING_DATASOURCE_PASSWORD=GENERATED
SPRING_JPA_HIBERNATE_DDL_AUTO=update/validate
SPRING_JPA_SHOW_SQL=true/false
```

### Security
```bash
SECURITY_JWT_SECRET_KEY=GENERATED
SECURITY_JWT_EXPIRATION_TIME=86400000
SESSION_SECRET=GENERATED
API_KEY=GENERATED
```

### Server
```bash
SERVER_PORT=8080
TZ=Europe/Madrid
FRONTEND_PORT=4200/3000
API_URL=http://localhost:8080/api
```

### Caddy
```bash
CADDY_EMAIL=admin@fonzigo.app
CADDY_DOMAIN=fonzigo.app
```

### CORS
```bash
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:80    (dev)
ALLOWED_ORIGINS=https://fonzigo.app,https://www.fonzigo.app  (prod)
```

---

## 🔄 Regenerating Credentials

If you need to regenerate credentials:

```bash
# Option 1: Delete and recreate
rm .env .env.prod .credentials-backup.txt
./auto-setup.sh

# Option 2: Just regenerate (manual)
openssl rand -base64 32  # for database
openssl rand -base64 64  # for JWT
```

---

## ⚠️ Security Best Practices

### DO
- ✅ Run auto-setup before first deployment
- ✅ Save credentials to a password manager
- ✅ Delete `.credentials-backup.txt` after saving
- ✅ Keep `.env.prod` in `.gitignore`
- ✅ Use environment-specific files
- ✅ Rotate credentials regularly

### DON'T
- ❌ Commit `.env` or `.env.prod` to Git
- ❌ Share credentials via email or chat
- ❌ Use default/weak passwords
- ❌ Store credentials in plain text files
- ❌ Forget to delete backup files

---

## 📝 Customization

After running auto-setup, you may want to customize:

### Change Timezone
```bash
nano .env.prod
# Edit TZ=Europe/Madrid to your timezone
```

### Change Email
```bash
nano .env.prod
# Edit CADDY_EMAIL to your email
```

### Change Domain
```bash
nano .env.prod
# Edit CADDY_DOMAIN to your domain
```

### Update Google Client ID
```bash
nano .env.prod
# Edit GOOGLE_CLIENT_ID with your production client ID
```

---

## 🔍 Verification

### Check files exist
```bash
ls -la .env .env.prod .credentials-backup.txt
```

### Check permissions
```bash
stat -c "%a %n" .env .env.prod .credentials-backup.txt
# Should show: 600 for all files
```

### View credentials
```bash
cat .credentials-backup.txt
```

### Test environment
```bash
# Development
docker-compose -f docker-compose.dev.yaml --env-file .env config

# Production
docker-compose -f docker-compose.prod.yaml --env-file .env.prod config
```

---

## 🚨 Troubleshooting

### Script fails to run
```bash
# Check permissions
ls -la auto-setup.sh
# Should be executable: rwxr-xr-x

# If not, make executable
chmod +x auto-setup.sh
```

### Credentials not generated
```bash
# Check if openssl is installed
which openssl

# If not, install it
sudo apt install openssl  # Ubuntu/Debian
sudo yum install openssl  # CentOS/RHEL
brew install openssl     # macOS
```

### Permission denied
```bash
# Check file ownership
ls -la .env .env.prod

# If wrong owner, fix it
chown $USER:$USER .env .env.prod
```

### Files not found
```bash
# Check they were created
ls -la | grep -E "env|backup"

# If not, check script output for errors
./auto-setup.sh 2>&1 | tee setup.log
```

---

## 📊 Comparison: auto-setup.sh vs auto-configure.sh

| Feature | auto-setup.sh | auto-configure.sh |
|---------|---------------|-------------------|
| **Complexity** | Simple | Detailed |
| **Output** | Minimal | Verbose |
| **Steps Shown** | Yes | Yes (detailed) |
| **Warnings** | Basic | Detailed |
| **Next Steps** | Basic | Comprehensive |
| **Best For** | Quick setup | First-time users |

---

## ✅ Checklist After Running

- [ ] Script executed successfully
- [ ] `.env` created
- [ ] `.env.prod` created
- [ ] `.credentials-backup.txt` created
- [ ] Permissions set to 600
- [ ] Credentials saved to password manager
- [ ] `.credentials-backup.txt` deleted
- [ ] Custom settings updated (timezone, email, domain)
- [ ] Ready to deploy

---

## 📞 Support

For issues:
1. Check [QUICKSTART.md](docs/deployment/QUICKSTART.md)
2. Check [DEPLOYMENT_VPS.md](docs/deployment/DEPLOYMENT_VPS.md)
3. GitHub Issues: https://github.com/acasmor0802/FonziGo/issues

---

**Last Updated:** 2026-01-27
