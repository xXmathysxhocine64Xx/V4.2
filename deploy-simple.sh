#!/bin/bash

# ===============================================
# 🚀 GetYourSite - Déploiement Simple et Stable
# ===============================================

set -e  # Arrêter en cas d'erreur

# Variables
PROJECT_NAME="getyoursite"
PROJECT_DIR="$(pwd)"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Déploiement GetYourSite${NC}"
echo "================================="

# Vérification du répertoire de travail
if [[ ! -f "package.json" || ! -f "next.config.js" ]]; then
    echo -e "${RED}❌ Fichiers GetYourSite non trouvés dans le répertoire courant${NC}"
    echo "Assurez-vous d'exécuter ce script depuis le répertoire du projet GetYourSite"
    echo "Répertoire courant: $(pwd)"
    exit 1
fi

echo -e "${BLUE}📍 Répertoire du projet: ${PROJECT_DIR}${NC}"

# Vérification et installation des outils nécessaires
echo -e "${BLUE}🔍 Vérification des outils...${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js non installé${NC}"
    echo "Installation requise: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# Vérifier et installer Yarn si nécessaire
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}⚠️  Yarn non trouvé, installation...${NC}"
    npm install -g yarn
    if ! command -v yarn &> /dev/null; then
        echo -e "${RED}❌ Impossible d'installer Yarn, utilisation de npm${NC}"
        PACKAGE_MANAGER="npm"
    else
        echo -e "${GREEN}✅ Yarn installé avec succès${NC}"
        PACKAGE_MANAGER="yarn"
    fi
else
    echo -e "${GREEN}✅ Yarn trouvé${NC}"
    PACKAGE_MANAGER="yarn"
fi

# Vérifier et installer PM2 si nécessaire
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 non trouvé, installation...${NC}"
    npm install -g pm2
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}❌ Impossible d'installer PM2${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ PM2 installé avec succès${NC}"
    fi
else
    echo -e "${GREEN}✅ PM2 trouvé${NC}"
fi

# 1. Installer les dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
cd "$PROJECT_DIR"
yarn install --silent

# 2. Build de l'application
echo -e "${BLUE}🔨 Build de l'application...${NC}"
yarn build

# 3. Arrêter PM2 si nécessaire
echo -e "${BLUE}⏹️  Arrêt de l'application...${NC}"
pm2 delete "$PROJECT_NAME" 2>/dev/null || true

# 4. Démarrer avec PM2
echo -e "${BLUE}▶️  Démarrage de l'application...${NC}"
pm2 start ecosystem.config.js

# 5. Configuration du démarrage automatique
echo -e "${BLUE}🔄 Configuration démarrage automatique...${NC}"
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
pm2 save >/dev/null

# 6. Test rapide
sleep 3
if curl -s http://localhost:3000 >/dev/null; then
    echo -e "${GREEN}✅ Application déployée avec succès!${NC}"
    echo -e "${GREEN}🌐 Site accessible sur http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Problème de déploiement${NC}"
    echo "Logs PM2:"
    pm2 logs "$PROJECT_NAME" --lines 5
    exit 1
fi

echo -e "${BLUE}📊 Statut PM2:${NC}"
pm2 status

echo -e "\n${GREEN}🎉 Déploiement terminé avec succès!${NC}"
echo -e "${BLUE}Commandes utiles:${NC}"
echo "• pm2 status - Voir le statut"
echo "• pm2 logs getyoursite - Voir les logs"
echo "• pm2 restart getyoursite - Redémarrer"