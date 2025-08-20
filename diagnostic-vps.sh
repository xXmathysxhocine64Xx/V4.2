#!/bin/bash

# ===============================================
# 🔍 GetYourSite - Diagnostic VPS
# ===============================================

# Variables
PROJECT_NAME="getyoursite"
DOMAIN="getyoursite.fr"
APP_PORT="3000"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 Diagnostic GetYourSite VPS${NC}"
echo "================================="

# 1. Vérification système
echo -e "\n${BLUE}💻 INFORMATIONS SYSTÈME${NC}"
echo "OS: $(lsb_release -d 2>/dev/null | cut -f2 || echo "Non disponible")"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo "Load average: $(cat /proc/loadavg | cut -d' ' -f1-3)"

# 2. Vérification des services
echo -e "\n${BLUE}🔧 ÉTAT DES SERVICES${NC}"

# PM2
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 installé${NC} ($(pm2 --version))"
    
    if pm2 list | grep -q "$PROJECT_NAME"; then
        PM2_STATUS=$(pm2 jlist | jq -r ".[] | select(.name==\"$PROJECT_NAME\") | .pm2_env.status" 2>/dev/null || echo "unknown")
        case $PM2_STATUS in
            "online")
                echo -e "${GREEN}✅ Application PM2 en ligne${NC}"
                ;;
            "stopped")
                echo -e "${RED}❌ Application PM2 arrêtée${NC}"
                ;;
            *)
                echo -e "${YELLOW}⚠️  Application PM2 état: $PM2_STATUS${NC}"
                ;;
        esac
    else
        echo -e "${RED}❌ Application $PROJECT_NAME non trouvée dans PM2${NC}"
    fi
else
    echo -e "${RED}❌ PM2 non installé${NC}"
fi

# Nginx
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx installé${NC} ($(nginx -v 2>&1 | cut -d' ' -f3))"
    
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx actif${NC}"
    else
        echo -e "${RED}❌ Nginx inactif${NC}"
    fi
    
    # Test de la configuration
    if nginx -t &> /dev/null; then
        echo -e "${GREEN}✅ Configuration Nginx valide${NC}"
    else
        echo -e "${RED}❌ Erreur de configuration Nginx${NC}"
        nginx -t 2>&1
    fi
else
    echo -e "${RED}❌ Nginx non installé${NC}"
fi

# Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js installé${NC} ($(node --version))"
else
    echo -e "${RED}❌ Node.js non installé${NC}"
fi

# 3. Vérification des ports
echo -e "\n${BLUE}🌐 VÉRIFICATION DES PORTS${NC}"

# Port 80
if netstat -tuln 2>/dev/null | grep -q ":80 "; then
    echo -e "${GREEN}✅ Port 80 en écoute${NC}"
else
    echo -e "${RED}❌ Port 80 non accessible${NC}"
fi

# Port 443
if netstat -tuln 2>/dev/null | grep -q ":443 "; then
    echo -e "${GREEN}✅ Port 443 en écoute (HTTPS)${NC}"
else
    echo -e "${YELLOW}⚠️  Port 443 non en écoute${NC}"
fi

# Port de l'application
if netstat -tuln 2>/dev/null | grep -q ":$APP_PORT "; then
    echo -e "${GREEN}✅ Port $APP_PORT en écoute (Application)${NC}"
else
    echo -e "${RED}❌ Port $APP_PORT non accessible${NC}"
fi

# 4. Tests de connectivité
echo -e "\n${BLUE}🔗 TESTS DE CONNECTIVITÉ${NC}"

# Test local
if curl -s --connect-timeout 5 http://localhost:$APP_PORT > /dev/null; then
    echo -e "${GREEN}✅ Application accessible localement${NC}"
else
    echo -e "${RED}❌ Application non accessible localement${NC}"
fi

# Test via Nginx local
if curl -s --connect-timeout 5 -H "Host: $DOMAIN" http://localhost > /dev/null; then
    echo -e "${GREEN}✅ Nginx proxy fonctionne${NC}"
else
    echo -e "${RED}❌ Nginx proxy ne fonctionne pas${NC}"
fi

# Test du domaine
if curl -s --connect-timeout 5 http://$DOMAIN > /dev/null; then
    echo -e "${GREEN}✅ Site accessible via le domaine${NC}"
else
    echo -e "${RED}❌ Site non accessible via le domaine${NC}"
fi

# 5. Vérification DNS
echo -e "\n${BLUE}🌍 VÉRIFICATION DNS${NC}"

# IP du serveur
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "Non disponible")
echo "IP du serveur: $SERVER_IP"

# Résolution DNS
DOMAIN_IP=$(dig +short $DOMAIN 2>/dev/null || nslookup $DOMAIN 2>/dev/null | grep "Address" | tail -1 | cut -d' ' -f2 || echo "Non résolu")
echo "IP du domaine $DOMAIN: $DOMAIN_IP"

if [[ "$SERVER_IP" == "$DOMAIN_IP" ]]; then
    echo -e "${GREEN}✅ DNS correctement configuré${NC}"
else
    echo -e "${RED}❌ DNS mal configuré ou propagation en cours${NC}"
fi

# 6. Vérification SSL
echo -e "\n${BLUE}🔐 VÉRIFICATION SSL${NC}"

if [[ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
    echo -e "${GREEN}✅ Certificat SSL présent${NC}"
    
    # Date d'expiration
    EXPIRY=$(openssl x509 -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" -text -noout | grep "Not After" | cut -d: -f2-)
    echo "Expiration SSL: $EXPIRY"
    
    # Test HTTPS
    if curl -s --connect-timeout 5 https://$DOMAIN > /dev/null; then
        echo -e "${GREEN}✅ HTTPS fonctionne${NC}"
    else
        echo -e "${YELLOW}⚠️  Certificat présent mais HTTPS ne fonctionne pas${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Pas de certificat SSL${NC}"
fi

# 7. Vérification des logs
echo -e "\n${BLUE}📋 LOGS RÉCENTS${NC}"

echo -e "\n${YELLOW}Logs PM2 (5 dernières lignes):${NC}"
pm2 logs $PROJECT_NAME --lines 5 --raw 2>/dev/null || echo "Pas de logs PM2 disponibles"

echo -e "\n${YELLOW}Logs Nginx erreur (5 dernières lignes):${NC}"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "Pas de logs Nginx disponibles"

# 8. Espace disque
echo -e "\n${BLUE}💾 ESPACE DISQUE${NC}"
df -h / | tail -1 | while read filesystem size used avail use mountpoint; do
    echo "Utilisé: $used/$size ($use)"
    if [[ ${use%?} -gt 90 ]]; then
        echo -e "${RED}❌ Espace disque critique${NC}"
    elif [[ ${use%?} -gt 80 ]]; then
        echo -e "${YELLOW}⚠️  Espace disque faible${NC}"
    else
        echo -e "${GREEN}✅ Espace disque OK${NC}"
    fi
done

# 9. Mémoire
echo -e "\n${BLUE}🧠 UTILISATION MÉMOIRE${NC}"
free -h | grep "Mem:" | while read mem total used free shared buffer available; do
    echo "Mémoire: $used/$total utilisée"
done

# 10. Processus
echo -e "\n${BLUE}⚙️  PROCESSUS${NC}"
echo "Processus actifs liés au site:"
ps aux | grep -E "(node|nginx|pm2)" | grep -v grep | head -5

# 11. Firewall
echo -e "\n${BLUE}🔒 FIREWALL${NC}"
if command -v ufw &> /dev/null; then
    if ufw status | grep -q "Status: active"; then
        echo -e "${GREEN}✅ UFW actif${NC}"
        echo "Règles autorisées:"
        ufw status | grep "ALLOW" | head -5
    else
        echo -e "${YELLOW}⚠️  UFW inactif${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  UFW non installé${NC}"
fi

# 12. Résumé et recommandations
echo -e "\n${BLUE}📝 RÉSUMÉ ET RECOMMANDATIONS${NC}"
echo "================================="

# Collecte des problèmes
PROBLEMS=()

# Vérifications
if ! systemctl is-active --quiet nginx; then
    PROBLEMS+=("Nginx n'est pas actif - Exécuter: systemctl start nginx")
fi

if ! pm2 list | grep -q "$PROJECT_NAME"; then
    PROBLEMS+=("Application PM2 non démarrée - Exécuter: pm2 start ecosystem.config.js")
fi

if [[ "$SERVER_IP" != "$DOMAIN_IP" ]]; then
    PROBLEMS+=("DNS mal configuré - Vérifier les enregistrements DNS")
fi

if ! curl -s --connect-timeout 5 http://localhost:$APP_PORT > /dev/null; then
    PROBLEMS+=("Application non accessible - Vérifier les logs PM2")
fi

if ! netstat -tuln 2>/dev/null | grep -q ":80 "; then
    PROBLEMS+=("Port 80 non ouvert - Vérifier Nginx et le firewall")
fi

# Affichage des problèmes
if [[ ${#PROBLEMS[@]} -eq 0 ]]; then
    echo -e "${GREEN}✅ Aucun problème détecté - Votre site devrait fonctionner!${NC}"
else
    echo -e "${RED}❌ Problèmes détectés:${NC}"
    for problem in "${PROBLEMS[@]}"; do
        echo -e "  • $problem"
    done
fi

echo -e "\n${BLUE}🔧 ACTIONS SUGGÉRÉES:${NC}"
if [[ ${#PROBLEMS[@]} -gt 0 ]]; then
    echo "1. Corriger les problèmes listés ci-dessus"
    echo "2. Redémarrer les services: systemctl restart nginx && pm2 restart $PROJECT_NAME"
    echo "3. Vérifier les logs: pm2 logs $PROJECT_NAME"
    echo "4. Tester à nouveau: curl -I http://$DOMAIN"
else
    echo "1. Vérifier que le domaine $DOMAIN pointe vers IP $SERVER_IP"
    echo "2. Attendre la propagation DNS (jusqu'à 48h)"
    echo "3. Tester avec: curl -I http://$DOMAIN"
fi

echo -e "\n${GREEN}Diagnostic terminé!${NC}"