#!/bin/bash

# ===============================================
# 🔧 Fix Nginx Configuration - GetYourSite
# ===============================================

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 Correction de la configuration Nginx${NC}"
echo "=================================="

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Ce script doit être exécuté en tant que root${NC}"
   echo "Utilisez: sudo ./fix-nginx.sh"
   exit 1
fi

# Supprimer les configurations qui causent des problèmes
echo -e "${BLUE}🗑️  Nettoyage des configurations Nginx problématiques...${NC}"

# Supprimer les sites qui ont des erreurs
rm -f /etc/nginx/sites-enabled/pizza.getyoursite.fr
rm -f /etc/nginx/sites-available/pizza.getyoursite.fr

# Ajouter les zones de rate limiting dans nginx.conf si pas déjà présentes
if ! grep -q "contact_limit" /etc/nginx/nginx.conf; then
    echo -e "${BLUE}➕ Ajout des zones de rate limiting dans nginx.conf${NC}"
    sed -i '/http {/a\\t# Rate limiting zones\n\tlimit_req_zone $binary_remote_addr zone=contact_limit:10m rate=5r/m;\n\tlimit_req_zone $binary_remote_addr zone=general_limit:10m rate=20r/m;' /etc/nginx/nginx.conf
fi

# Tester la configuration
echo -e "${BLUE}🧪 Test de la configuration Nginx...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Configuration Nginx corrigée avec succès${NC}"
    
    # Redémarrer nginx
    echo -e "${BLUE}🔄 Redémarrage de Nginx...${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✅ Nginx redémarré${NC}"
    
    echo -e "\n${GREEN}🎉 Correction terminée avec succès!${NC}"
    echo -e "${BLUE}Vous pouvez maintenant relancer le script de déploiement${NC}"
else
    echo -e "${RED}❌ Il reste des erreurs dans la configuration Nginx${NC}"
    echo -e "${YELLOW}Vérifiez manuellement avec: nginx -t${NC}"
    exit 1
fi