#!/bin/bash

# ===============================================
# 🚀 GetYourSite - Installation Simplifiée
# ===============================================
# Version stable et minimale - Ubuntu/Debian
# Adapté pour la version simplifiée

set -e  # Arrêter en cas d'erreur

# Variables
PROJECT_NAME="getyoursite"
PROJECT_DIR="/var/www/${PROJECT_NAME}"
CURRENT_DIR="$(pwd)"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Installation GetYourSite - Version Simplifiée${NC}"
echo "================================================="

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}❌ Ce script doit être exécuté avec sudo${NC}"
    echo "Usage: sudo $0"
    exit 1
fi

echo -e "${YELLOW}⚠️  Cette installation va :${NC}"
echo "• Installer Node.js, Yarn, PM2"
echo "• Configurer Nginx (optionnel)"
echo "• Déployer GetYourSite dans $PROJECT_DIR"
echo
read -p "Continuer ? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation annulée."
    exit 0
fi

# 1. Mise à jour du système
echo -e "${BLUE}📦 Mise à jour du système...${NC}"
apt update -y
apt install -y curl wget git unzip nginx

# 2. Installation Node.js 18
echo -e "${BLUE}📦 Installation Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# 3. Installation Yarn et PM2
echo -e "${BLUE}📦 Installation Yarn et PM2...${NC}"
if ! command -v yarn &> /dev/null; then
    npm install -g yarn
fi
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ Yarn: $(yarn --version)${NC}"
echo -e "${GREEN}✅ PM2: $(pm2 --version)${NC}"

# 4. Création du répertoire projet
echo -e "${BLUE}📁 Préparation du projet...${NC}"
mkdir -p "$PROJECT_DIR"
rm -rf "${PROJECT_DIR:?}"/* 2>/dev/null || true

# 5. Copie des fichiers
echo -e "${BLUE}📋 Copie des fichiers...${NC}"
if [[ -f "$CURRENT_DIR/package.json" && -f "$CURRENT_DIR/app/page.js" ]]; then
    # Copier depuis le répertoire courant
    cp -r "$CURRENT_DIR"/* "$PROJECT_DIR/" 2>/dev/null || true
    cp -r "$CURRENT_DIR"/.[^.]* "$PROJECT_DIR/" 2>/dev/null || true
    echo -e "${GREEN}✅ Fichiers copiés depuis $CURRENT_DIR${NC}"
else
    echo -e "${RED}❌ Fichiers source non trouvés dans $CURRENT_DIR${NC}"
    echo "Assurez-vous d'exécuter ce script depuis le répertoire du projet GetYourSite"
    exit 1
fi

# 6. Installation et build
echo -e "${BLUE}🔨 Installation des dépendances...${NC}"
cd "$PROJECT_DIR"
yarn install --silent

echo -e "${BLUE}🔨 Build de l'application...${NC}"
yarn build

# 7. Configuration des permissions
echo -e "${BLUE}🔐 Configuration des permissions...${NC}"
chown -R www-data:www-data "$PROJECT_DIR"
chmod +x "$PROJECT_DIR/deploy-simple.sh" 2>/dev/null || true

# 8. Démarrage avec PM2
echo -e "${BLUE}🚀 Démarrage de l'application...${NC}"
pm2 delete "$PROJECT_NAME" 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
pm2 save >/dev/null

# 9. Configuration Nginx (optionnelle)
echo
read -p "Configurer Nginx comme proxy ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🌐 Configuration Nginx...${NC}"
    
    # Configuration Nginx simple
    cat > /etc/nginx/sites-available/$PROJECT_NAME << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # Activer le site
    ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    
    echo -e "${GREEN}✅ Nginx configuré${NC}"
fi

# 10. Configuration Gmail (optionnelle)
echo
read -p "Configurer Gmail pour le formulaire de contact ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Configuration Gmail :${NC}"
    echo "1. Allez sur myaccount.google.com"
    echo "2. Sécurité → Vérification en 2 étapes (activez-la)"
    echo "3. Sécurité → Mots de passe des applications"
    echo "4. Générez un mot de passe pour 'Courrier'"
    echo
    
    read -p "Votre adresse Gmail: " GMAIL_USER
    read -p "Mot de passe d'application (16 caractères): " GMAIL_APP_PASSWORD
    read -p "Email de réception [${GMAIL_USER}]: " GMAIL_RECIPIENT
    
    GMAIL_RECIPIENT=${GMAIL_RECIPIENT:-$GMAIL_USER}
    
    # Mise à jour du fichier .env
    cat > "$PROJECT_DIR/.env" << EOF
# Configuration Gmail pour le formulaire de contact
GMAIL_USER=$GMAIL_USER
GMAIL_APP_PASSWORD=$GMAIL_APP_PASSWORD
GMAIL_RECIPIENT=$GMAIL_RECIPIENT
EOF

    # Redémarrage pour prendre en compte les variables
    pm2 restart "$PROJECT_NAME"
    echo -e "${GREEN}✅ Gmail configuré${NC}"
fi

# 11. Tests finaux
echo -e "${BLUE}🔍 Tests de fonctionnement...${NC}"
sleep 3

# Test PM2
if pm2 list | grep -q "$PROJECT_NAME.*online"; then
    echo -e "${GREEN}✅ PM2: Application en ligne${NC}"
else
    echo -e "${RED}❌ PM2: Problème détecté${NC}"
    pm2 logs "$PROJECT_NAME" --lines 5
fi

# Test API
if curl -s http://localhost:3000/api/contact >/dev/null; then
    echo -e "${GREEN}✅ API: Fonctionnelle${NC}"
else
    echo -e "${YELLOW}⚠️  API: Attendre le démarrage complet${NC}"
fi

# Test site principal
if curl -s http://localhost:3000 >/dev/null; then
    echo -e "${GREEN}✅ Site: Accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Site: Attendre le démarrage complet${NC}"
fi

# 12. Informations finales
echo
echo -e "${GREEN}🎉 Installation terminée avec succès !${NC}"
echo "========================================="

# Obtenir l'IP du serveur
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | cut -d' ' -f1)

echo -e "${BLUE}📋 INFORMATIONS D'ACCÈS :${NC}"
echo "• Site local: http://localhost:3000"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "• Site externe: http://$SERVER_IP"
fi
echo "• API de test: http://localhost:3000/api/contact"
echo

echo -e "${BLUE}🛠️  COMMANDES UTILES :${NC}"
echo "• Statut: pm2 status"
echo "• Logs: pm2 logs $PROJECT_NAME"
echo "• Redémarrer: pm2 restart $PROJECT_NAME"
echo "• Arrêter: pm2 stop $PROJECT_NAME"
echo

echo -e "${BLUE}📁 FICHIERS IMPORTANTS :${NC}"
echo "• Projet: $PROJECT_DIR"
echo "• Configuration: $PROJECT_DIR/.env"
echo "• Script de déploiement: $PROJECT_DIR/deploy-simple.sh"
echo

if [[ ! "$GMAIL_USER" ]]; then
    echo -e "${YELLOW}⚠️  Pour configurer Gmail plus tard :${NC}"
    echo "1. Éditez le fichier: $PROJECT_DIR/.env"
    echo "2. Redémarrez: pm2 restart $PROJECT_NAME"
fi

echo
echo -e "${GREEN}✨ GetYourSite est maintenant installé et opérationnel !${NC}"