#!/bin/bash

# ===============================================
# 🔧 Correction spécifique - Erreur condition Nginx
# ===============================================

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 Correction de l'erreur de condition Nginx${NC}"
echo "=============================================="

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Ce script doit être exécuté en tant que root${NC}"
   echo "Utilisez: sudo ./fix-nginx-condition.sh"
   exit 1
fi

# Rechercher et afficher l'erreur actuelle
echo -e "${BLUE}🔍 Analyse de l'erreur actuelle...${NC}"
nginx -t 2>&1 | head -5 || true

# Corriger le fichier de configuration problématique
NGINX_SITE="/etc/nginx/sites-enabled/getyoursite.fr"

if [[ -f "$NGINX_SITE" ]]; then
    echo -e "${BLUE}🔧 Correction du fichier: $NGINX_SITE${NC}"
    
    # Créer une sauvegarde
    cp "$NGINX_SITE" "$NGINX_SITE.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Corriger la syntaxe de la condition if dans Nginx
    # Remplacer la condition problématique par une version corrigée
    sed -i 's/if ($host = pizza\.getyoursite\.fr)/if ($host = "pizza.getyoursite.fr")/' "$NGINX_SITE"
    
    echo -e "${GREEN}✅ Correction appliquée${NC}"
else
    echo -e "${YELLOW}⚠️  Fichier de configuration non trouvé: $NGINX_SITE${NC}"
fi

# Corriger aussi le fichier disponible si il existe
NGINX_AVAILABLE="/etc/nginx/sites-available/getyoursite.fr"
if [[ -f "$NGINX_AVAILABLE" ]]; then
    echo -e "${BLUE}🔧 Correction du fichier: $NGINX_AVAILABLE${NC}"
    cp "$NGINX_AVAILABLE" "$NGINX_AVAILABLE.backup.$(date +%Y%m%d_%H%M%S)"
    sed -i 's/if ($host = pizza\.getyoursite\.fr)/if ($host = "pizza.getyoursite.fr")/' "$NGINX_AVAILABLE"
    echo -e "${GREEN}✅ Correction appliquée${NC}"
fi

# Ajouter les zones de rate limiting si manquantes
echo -e "${BLUE}🔧 Vérification des zones de rate limiting...${NC}"
if ! grep -q "contact_limit" /etc/nginx/nginx.conf; then
    echo -e "${BLUE}➕ Ajout des zones de rate limiting...${NC}"
    sed -i '/http {/a\\t# Rate limiting zones\n\tlimit_req_zone $binary_remote_addr zone=contact_limit:10m rate=5r/m;\n\tlimit_req_zone $binary_remote_addr zone=general_limit:10m rate=20r/m;' /etc/nginx/nginx.conf
    echo -e "${GREEN}✅ Zones ajoutées${NC}"
else
    echo -e "${GREEN}✅ Zones déjà présentes${NC}"
fi

# Test de la configuration
echo -e "\n${BLUE}🧪 Test de la configuration Nginx corrigée...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Configuration Nginx corrigée avec succès!${NC}"
    
    # Redémarrer nginx
    echo -e "${BLUE}🔄 Redémarrage de Nginx...${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✅ Nginx redémarré${NC}"
    
    echo -e "\n${GREEN}🎉 SUCCÈS - Erreur de condition corrigée!${NC}"
    echo -e "${BLUE}Votre configuration Nginx fonctionne maintenant correctement${NC}"
    
    # Afficher le statut
    echo -e "\n${BLUE}📊 Statut des services:${NC}"
    systemctl is-active nginx && echo -e "${GREEN}✅ Nginx: Actif${NC}" || echo -e "${RED}❌ Nginx: Inactif${NC}"
    
else
    echo -e "${RED}❌ Des erreurs persistent dans la configuration${NC}"
    echo -e "${YELLOW}Détail de l'erreur:${NC}"
    nginx -t
    exit 1
fi