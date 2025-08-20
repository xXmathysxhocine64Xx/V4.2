#!/bin/bash

# ===============================================
# 🔧 Fix Complet - Toutes erreurs Nginx (VERSION CORRIGÉE)
# ===============================================

set -e

# Couleurs CORRIGÉES
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 Correction complète de toutes les erreurs Nginx${NC}"
echo "================================================"

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Ce script doit être exécuté en tant que root${NC}"
   echo "Utilisez: sudo ./fix-nginx-condition-complete.sh"
   exit 1
fi

# Afficher l'erreur actuelle
echo -e "${BLUE}🔍 Analyse des erreurs actuelles...${NC}"
echo -e "${YELLOW}Erreurs détectées:${NC}"
nginx -t 2>&1 | head -10 || true

echo -e "\n${BLUE}🔧 Application des corrections...${NC}"

# 1. Corriger les zones de rate limiting
echo -e "${BLUE}1️⃣ Correction des zones de rate limiting...${NC}"
if ! grep -q "contact_limit" /etc/nginx/nginx.conf; then
    echo -e "${YELLOW}   Ajout des zones manquantes...${NC}"
    sed -i '/http {/a\\t# Rate limiting zones\n\tlimit_req_zone $binary_remote_addr zone=contact_limit:10m rate=5r/m;\n\tlimit_req_zone $binary_remote_addr zone=general_limit:10m rate=20r/m;' /etc/nginx/nginx.conf
    echo -e "${GREEN}   ✅ Zones ajoutées${NC}"
else
    echo -e "${GREEN}   ✅ Zones déjà présentes${NC}"
fi

# 2. Corriger toutes les configurations de sites
echo -e "${BLUE}2️⃣ Correction des configurations de sites...${NC}"

# Sites à vérifier
SITES=("/etc/nginx/sites-enabled/getyoursite.fr" "/etc/nginx/sites-available/getyoursite.fr" "/etc/nginx/sites-enabled/pizza.getyoursite.fr" "/etc/nginx/sites-available/pizza.getyoursite.fr" "/etc/nginx/sites-enabled/mairie.getyoursite.fr" "/etc/nginx/sites-available/mairie.getyoursite.fr")

for site in "${SITES[@]}"; do
    if [[ -f "$site" ]]; then
        echo -e "${YELLOW}   Correction: $site${NC}"
        
        # Créer une sauvegarde
        cp "$site" "$site.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Corrections multiples
        # 1. Condition if avec guillemets
        sed -i 's/if ($host = pizza\.getyoursite\.fr)/if ($host = "pizza.getyoursite.fr")/' "$site"
        
        # 2. Corriger les variables non-escapées si nécessaires
        sed -i 's/\$http_upgrade/\\$http_upgrade/g' "$site"
        sed -i 's/\$host/\\$host/g' "$site"
        sed -i 's/\$remote_addr/\\$remote_addr/g' "$site"
        sed -i 's/\$proxy_add_x_forwarded_for/\\$proxy_add_x_forwarded_for/g' "$site"
        sed -i 's/\$scheme/\\$scheme/g' "$site"
        sed -i 's/\$server_name/\\$server_name/g' "$site"
        
        # Remettre les bonnes variables (celles qui doivent être escapées dans nginx)
        sed -i 's/\\\\$/\\$/g' "$site"
        
        echo -e "${GREEN}   ✅ Corrigé${NC}"
    fi
done

# 3. Supprimer les sites en double/problématiques
echo -e "${BLUE}3️⃣ Nettoyage des configurations en double...${NC}"
if [[ -f "/etc/nginx/sites-enabled/pizza.getyoursite.fr" ]]; then
    echo -e "${YELLOW}   Suppression du site pizza séparé (géré par site principal)${NC}"
    rm -f /etc/nginx/sites-enabled/pizza.getyoursite.fr
    rm -f /etc/nginx/sites-available/pizza.getyoursite.fr
    echo -e "${GREEN}   ✅ Site pizza séparé supprimé${NC}"
fi

# 4. Vérifier les permissions
echo -e "${BLUE}4️⃣ Vérification des permissions...${NC}"
chown -R root:root /etc/nginx/sites-available/
chown -R root:root /etc/nginx/sites-enabled/
chmod 644 /etc/nginx/sites-available/*
echo -e "${GREEN}   ✅ Permissions corrigées${NC}"

# 5. Test de la configuration
echo -e "\n${BLUE}🧪 Test final de la configuration Nginx...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Configuration Nginx entièrement corrigée!${NC}"
    
    # Redémarrer nginx
    echo -e "${BLUE}🔄 Redémarrage de Nginx...${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✅ Nginx redémarré avec succès${NC}"
    
    echo -e "\n${GREEN}🎉 SUCCÈS COMPLET!${NC}"
    echo -e "${BLUE}Toutes les erreurs Nginx ont été corrigées${NC}"
    
    # Afficher les sites actifs
    echo -e "\n${BLUE}📋 Sites Nginx actifs:${NC}"
    ls -la /etc/nginx/sites-enabled/ | grep -v "total\|default" || echo "Aucun site actif trouvé"
    
    # Statut des services
    echo -e "\n${BLUE}📊 Statut des services:${NC}"
    systemctl is-active nginx && echo -e "${GREEN}✅ Nginx: Actif${NC}" || echo -e "${RED}❌ Nginx: Inactif${NC}"
    
    # Test de connectivité
    echo -e "\n${BLUE}🔍 Test de connectivité locale...${NC}"
    if curl -s http://localhost > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Site accessible localement${NC}"
    else
        echo -e "${YELLOW}⚠️  Site non accessible - vérifiez PM2${NC}"
        pm2 status 2>/dev/null || echo -e "${RED}PM2 non démarré${NC}"
    fi
    
else
    echo -e "${RED}❌ Erreurs persistantes dans la configuration${NC}"
    echo -e "${YELLOW}Détail des erreurs restantes:${NC}"
    nginx -t
    
    echo -e "\n${BLUE}🔧 Actions suggérées:${NC}"
    echo "1. Vérifiez manuellement les fichiers de configuration"
    echo "2. Consultez les logs: tail -f /var/log/nginx/error.log"
    echo "3. Relancez avec le script de déploiement corrigé"
    
    exit 1
fi