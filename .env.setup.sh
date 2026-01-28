#!/bin/bash
# ==============================================================================
# FonziGo - Environment Setup Script
# Run this to create .env files from templates
# ==============================================================================

echo " Setting up FonziGo environment files..."

# Create development .env from example
if [ ! -f .env ]; then
    cp .env.example .env
    echo " Created .env (development)"
else
    echo "  .env already exists, skipping"
fi

# Create production .env from example
if [ ! -f .env.prod ]; then
    cp .env.prod.example .env.prod
    echo " Created .env.prod (production)"
    echo "  IMPORTANT: Update values in .env.prod before deploying!"
else
    echo "  .env.prod already exists, skipping"
fi

echo ""
echo " Next steps:"
echo "1. Edit .env for local development (optional)"
echo "2. Edit .env.prod for production deployment (REQUIRED!)"
echo "3. Generate a strong JWT secret: openssl rand -base64 64"
echo "4. Generate a strong database password: openssl rand -base64 32"
echo ""
echo "  Run: chmod +x .env.setup.sh to make this script executable"
