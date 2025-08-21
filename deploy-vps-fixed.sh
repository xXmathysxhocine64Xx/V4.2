#!/bin/bash

# ===============================================
# 🚀 GetYourSite - Déploiement VPS Complet (VERSION CORRIGÉE)
# ===============================================

set -e  # Arrêter en cas d'erreur

# Variables par défaut
PROJECT_NAME="getyoursite"
PROJECT_DIR="$(pwd)"
DEFAULT_DOMAIN="getyoursite.fr"
APP_PORT="3000"

# Couleurs CORRIGÉES
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Déploiement GetYourSite sur VPS (VERSION CORRIGÉE)${NC}"
echo "========================================="

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Ce script doit être exécuté en tant que root${NC}"
   echo "Utilisez: sudo ./deploy-vps-fixed.sh"
   exit 1
fi

# Vérification du répertoire de travail
if [[ ! -f "package.json" || ! -f "next.config.js" ]]; then
    echo -e "${RED}❌ Fichiers GetYourSite non trouvés dans le répertoire courant${NC}"
    echo "Assurez-vous d'exécuter ce script depuis le répertoire du projet GetYourSite"
    exit 1
fi

# Sélection du domaine
echo -e "${BLUE}🌐 Déploiement du site principal GetYourSite${NC}"
DOMAIN="getyoursite.fr"
DEPLOY_TYPE="main"
PROJECT_NAME="getyoursite"

echo ""
echo -e "${YELLOW}➕ Souhaitez-vous également déployer la démo pizzeria sur pizza.getyoursite.fr ?${NC}"
read -t 30 -p "Déployer aussi pizza.getyoursite.fr ? (o/n): " pizza_choice || pizza_choice="n"

echo ""
echo -e "${YELLOW}🏛️ Souhaitez-vous également déployer la démo mairie sur mairie.getyoursite.fr ?${NC}"
read -t 30 -p "Déployer aussi mairie.getyoursite.fr ? (o/n): " mairie_choice || mairie_choice="n"

DEPLOY_PIZZA="false"
DEPLOY_MAIRIE="false"

if [[ $pizza_choice =~ ^[Oo]$ ]]; then
    DEPLOY_PIZZA="true"
fi

if [[ $mairie_choice =~ ^[Oo]$ ]]; then
    DEPLOY_MAIRIE="true"
fi

# Configuration Stripe pour la pizzeria si déployée
CONFIGURE_STRIPE="false"
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo ""
    echo -e "${YELLOW}💳 Configuration Stripe pour la pizzeria Lucky Pizza${NC}"
    echo -e "${BLUE}La pizzeria inclut un système de commande avec paiement Stripe${NC}"
    read -t 30 -p "Souhaitez-vous configurer Stripe maintenant ? (o/n): " stripe_choice || stripe_choice="n"
    
    if [[ $stripe_choice =~ ^[Oo]$ ]]; then
        CONFIGURE_STRIPE="true"
        echo ""
        echo -e "${BLUE}📝 Configuration des clés Stripe${NC}"
        echo -e "${YELLOW}Vous pouvez obtenir ces clés sur: https://dashboard.stripe.com/apikeys${NC}"
        
        read -t 60 -p "Clé publique Stripe (pk_test_... ou pk_live_...): " STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY=""
        read -t 60 -p "Clé secrète Stripe (sk_test_... ou sk_live_...): " STRIPE_SECRET_KEY || STRIPE_SECRET_KEY=""
        
        echo ""
        echo -e "${BLUE}🔗 Configuration Webhook Stripe (optionnel)${NC}"
        echo -e "${YELLOW}URL du webhook: https://pizza.getyoursite.fr/api/webhook/stripe${NC}"
        read -t 60 -p "Secret webhook Stripe (whsec_... - optionnel): " STRIPE_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET=""
        
        # Validation basique des clés
        if [[ -n "$STRIPE_SECRET_KEY" && ! "$STRIPE_SECRET_KEY" =~ ^sk_[a-zA-Z0-9_]+ ]]; then
            echo -e "${YELLOW}⚠️  Attention: La clé secrète ne semble pas avoir le format attendu${NC}"
        fi
        
        if [[ -n "$STRIPE_PUBLISHABLE_KEY" && ! "$STRIPE_PUBLISHABLE_KEY" =~ ^pk_[a-zA-Z0-9_]+ ]]; then
            echo -e "${YELLOW}⚠️  Attention: La clé publique ne semble pas avoir le format attendu${NC}"
        fi
    fi
fi

if [[ "$DEPLOY_PIZZA" == "true" && "$DEPLOY_MAIRIE" == "true" ]]; then
    echo -e "${GREEN}✅ Déploiement du site principal + démo pizzeria + démo mairie${NC}"
elif [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo -e "${GREEN}✅ Déploiement du site principal + démo pizzeria${NC}"
elif [[ "$DEPLOY_MAIRIE" == "true" ]]; then
    echo -e "${GREEN}✅ Déploiement du site principal + démo mairie${NC}"
else
    echo -e "${GREEN}✅ Déploiement du site principal uniquement${NC}"
fi

if [[ "$CONFIGURE_STRIPE" == "true" ]]; then
    echo -e "${GREEN}✅ Configuration Stripe activée${NC}"
fi

echo -e "${BLUE}📍 Répertoire du projet: ${PROJECT_DIR}${NC}"
echo -e "${BLUE}🌐 Domaine de déploiement: ${DOMAIN}${NC}"
echo -e "${BLUE}🎯 Type de déploiement: ${DEPLOY_TYPE}${NC}"

# 1. Mise à jour du système
echo -e "${BLUE}🔄 Mise à jour du système...${NC}"
apt update -qq > /dev/null 2>&1

# 2. Installation des dépendances système
echo -e "${BLUE}📦 Installation des outils nécessaires...${NC}"
apt install -y curl nginx certbot python3-certbot-nginx ufw > /dev/null 2>&1

# 3. Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📥 Installation de Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs > /dev/null 2>&1
fi

# 4. Vérifier et installer Yarn
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}📥 Installation de Yarn...${NC}"
    npm install -g yarn > /dev/null 2>&1
fi

# 5. Vérifier et installer PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📥 Installation de PM2...${NC}"
    npm install -g pm2 > /dev/null 2>&1
fi

echo -e "${GREEN}✅ Tous les outils sont installés${NC}"

# 6. Configuration du firewall
echo -e "${BLUE}🔒 Configuration du firewall...${NC}"
ufw --force reset > /dev/null 2>&1
ufw default deny incoming > /dev/null 2>&1
ufw default allow outgoing > /dev/null 2>&1
ufw allow ssh > /dev/null 2>&1
ufw allow 'Nginx Full' > /dev/null 2>&1
echo "y" | ufw enable > /dev/null 2>&1

# 7. Installation des dépendances du projet
echo -e "${BLUE}📦 Installation des dépendances du projet...${NC}"
cd "$PROJECT_DIR"
yarn install --silent

# 8. Build de l'application
echo -e "${BLUE}🔨 Build de l'application...${NC}"

# Configuration du fichier .env avant le build
if [[ "$CONFIGURE_STRIPE" == "true" ]]; then
    echo -e "${BLUE}⚙️  Configuration des variables d'environnement Stripe...${NC}"
    
    # Backup du fichier .env actuel
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    # Mise à jour des clés Stripe
    if [[ -n "$STRIPE_SECRET_KEY" ]]; then
        # Suppression de l'ancienne clé s'il existe
        sed -i '/^STRIPE_API_KEY=/d' .env
        echo "STRIPE_API_KEY=${STRIPE_SECRET_KEY}" >> .env
        echo -e "${GREEN}✓ Clé secrète Stripe configurée${NC}"
    fi
    
    if [[ -n "$STRIPE_PUBLISHABLE_KEY" ]]; then
        # Suppression de l'ancienne clé s'il existe
        sed -i '/^NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=/d' .env
        echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}" >> .env
        echo -e "${GREEN}✓ Clé publique Stripe configurée${NC}"
    fi
    
    if [[ -n "$STRIPE_WEBHOOK_SECRET" ]]; then
        # Suppression de l'ancien secret s'il existe
        sed -i '/^STRIPE_WEBHOOK_SECRET=/d' .env
        echo "STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}" >> .env
        echo -e "${GREEN}✓ Secret webhook Stripe configuré${NC}"
    fi
    
    # Configuration MongoDB pour les transactions si pas déjà présent
    if ! grep -q "MONGO_URL=" .env; then
        echo "MONGO_URL=mongodb://localhost:27017" >> .env
        echo -e "${GREEN}✓ URL MongoDB configurée pour les transactions${NC}"
    fi
    
    echo -e "${BLUE}📋 Résumé de la configuration Stripe:${NC}"
    echo -e "${GREEN}• Clé secrète: ${STRIPE_SECRET_KEY:0:12}...${NC}"
    if [[ -n "$STRIPE_PUBLISHABLE_KEY" ]]; then
        echo -e "${GREEN}• Clé publique: ${STRIPE_PUBLISHABLE_KEY:0:12}...${NC}"
    fi
    if [[ -n "$STRIPE_WEBHOOK_SECRET" ]]; then
        echo -e "${GREEN}• Webhook configuré: ${STRIPE_WEBHOOK_SECRET:0:8}...${NC}"
    fi
fi

yarn build

# 9. Configuration PM2
echo -e "${BLUE}⚙️  Configuration PM2...${NC}"
pm2 delete "$PROJECT_NAME" 2>/dev/null || true

# Créer une configuration PM2 optimisée pour VPS
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${PROJECT_NAME}',
    script: 'yarn',
    args: 'start',
    cwd: '${PROJECT_DIR}',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: ${APP_PORT},
      HOSTNAME: '0.0.0.0'
    },
    error_file: '/var/log/pm2/${PROJECT_NAME}.err.log',
    out_file: '/var/log/pm2/${PROJECT_NAME}.out.log',
    log_file: '/var/log/pm2/${PROJECT_NAME}.log'
  }]
}
EOF

# Créer le répertoire de logs
mkdir -p /var/log/pm2

# 10. Démarrage de l'application
echo -e "${BLUE}▶️  Démarrage de l'application...${NC}"
pm2 start ecosystem.config.js
pm2 startup systemd -u root --hp /root > /dev/null 2>&1
pm2 save > /dev/null 2>&1

# 11. Configuration Nginx
echo -e "${BLUE}🌐 Configuration Nginx...${NC}"

# Ajouter les zones de rate limiting dans le contexte http principal
if ! grep -q "contact_limit" /etc/nginx/nginx.conf; then
    sed -i '/http {/a\\t# Rate limiting zones\n\tlimit_req_zone $binary_remote_addr zone=contact_limit:10m rate=5r/m;\n\tlimit_req_zone $binary_remote_addr zone=general_limit:10m rate=20r/m;' /etc/nginx/nginx.conf
fi

# Configuration différenciée selon le déploiement
SERVER_NAMES="${DOMAIN} www.${DOMAIN}"

if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    SERVER_NAMES="${SERVER_NAMES} pizza.getyoursite.fr"
fi

if [[ "$DEPLOY_MAIRIE" == "true" ]]; then
    SERVER_NAMES="${SERVER_NAMES} mairie.getyoursite.fr"
fi

cat > /etc/nginx/sites-available/${DOMAIN} << EOF
server {
    listen 80;
    server_name ${SERVER_NAMES};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;

    # Hide Nginx version
    server_tokens off;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Block common attacks
    location ~* \.(sql|bak|log|ini|conf|sh|bat|cmd)$ {
        deny all;
        return 404;
    }

    # API rate limiting
    location /api/contact {
        limit_req zone=contact_limit burst=3 nodelay;
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Additional security for API
        proxy_hide_header X-Powered-By;
        proxy_set_header X-Forwarded-Host \$server_name;
        
        # Timeout settings
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    location / {
        limit_req zone=general_limit burst=10 nodelay;
EOF

# Ajouter les redirections pour les sous-domaines activés
REDIRECTIONS=""

if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    REDIRECTIONS="${REDIRECTIONS}        # Redirection pour le sous-domaine pizza
        if (\$host = \"pizza.getyoursite.fr\") {
            rewrite ^/\$ /pizza last;
        }
"
fi

if [[ "$DEPLOY_MAIRIE" == "true" ]]; then
    REDIRECTIONS="${REDIRECTIONS}        # Redirection pour le sous-domaine mairie
        if (\$host = \"mairie.getyoursite.fr\") {
            rewrite ^/\$ /mairie last;
        }
"
fi

if [[ -n "$REDIRECTIONS" ]]; then
cat >> /etc/nginx/sites-available/${DOMAIN} << EOF
        
${REDIRECTIONS}
EOF
fi

cat >> /etc/nginx/sites-available/${DOMAIN} << EOF
        
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Optimisation pour les assets statiques
    location /_next/static {
        proxy_pass http://127.0.0.1:${APP_PORT};
        expires 365d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff" always;
    }

    # Gestion des erreurs
    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/html;
    }

    # Bloquer les scanners de vulnérabilités
    location ~ /\\.ht {
        deny all;
    }
    
    location ~ /\\.(git|svn) {
        deny all;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration nginx
echo -e "${BLUE}🧪 Test de la configuration Nginx...${NC}"
if ! nginx -t > /dev/null 2>&1; then
    echo -e "${RED}❌ Erreur de configuration Nginx${NC}"
    echo -e "${YELLOW}Détail de l'erreur:${NC}"
    nginx -t
    echo -e "\n${BLUE}🔧 Tentative de correction automatique...${NC}"
    
    # Correction automatique si possible
    if [[ -f "/app/fix-nginx-condition.sh" ]]; then
        ./fix-nginx-condition.sh
    else
        echo -e "${RED}❌ Impossible de corriger automatiquement${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Configuration Nginx valide${NC}"
fi

# Redémarrer nginx
systemctl reload nginx

# 12. Test de l'application
echo -e "${BLUE}🔍 Test de l'application...${NC}"
sleep 5

# Attendre que l'application soit prête
SUCCESS=false
for i in {1..30}; do
    if curl -s http://localhost:${APP_PORT} > /dev/null 2>&1; then
        SUCCESS=true
        break
    fi
    echo -e "${YELLOW}⏳ Tentative $i/30 - Attente du démarrage...${NC}"
    sleep 2
done

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}✅ Application démarrée avec succès!${NC}"
    
    # Test du domaine
    if curl -s -H "Host: ${DOMAIN}" http://localhost > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx configuré correctement${NC}"
    else
        echo -e "${YELLOW}⚠️  Nginx configuré mais test échoué${NC}"
    fi
    
    # Test pizza si déployé
    if [[ "$DEPLOY_PIZZA" == "true" ]]; then
        if curl -s -H "Host: pizza.getyoursite.fr" http://localhost > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Site pizza accessible${NC}"
            
            # Test de l'API de contact pour la pizza
            if curl -s -H "Host: pizza.getyoursite.fr" http://localhost/api/contact > /dev/null 2>&1; then
                echo -e "${GREEN}✅ API contact pizza fonctionnelle${NC}"
            else
                echo -e "${YELLOW}⚠️  API contact pizza non accessible${NC}"
            fi
            
            # Test de l'API de paiement si Stripe configuré
            if [[ "$CONFIGURE_STRIPE" == "true" && -n "$STRIPE_SECRET_KEY" ]]; then
                if curl -s -X POST -H "Host: pizza.getyoursite.fr" -H "Content-Type: application/json" \
                   -d '{"package_id":"margherita"}' http://localhost/api/payments/checkout > /dev/null 2>&1; then
                    echo -e "${GREEN}✅ API paiement pizza fonctionnelle${NC}"
                else
                    echo -e "${YELLOW}⚠️  API paiement pizza: vérifiez les clés Stripe${NC}"
                fi
            fi
        else
            echo -e "${YELLOW}⚠️  Site pizza configuré mais test échoué${NC}"
        fi
    fi
    
    # Test mairie si déployé
    if [[ "$DEPLOY_MAIRIE" == "true" ]]; then
        if curl -s -H "Host: mairie.getyoursite.fr" http://localhost > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Site mairie accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  Site mairie configuré mais test échoué${NC}"
        fi
    fi
else
    echo -e "${RED}❌ Problème de démarrage de l'application${NC}"
    echo "Logs PM2:"
    pm2 logs "$PROJECT_NAME" --lines 10 --raw 2>/dev/null || echo "Pas de logs disponibles"
    exit 1
fi

# 13. Configuration SSL (optionnelle)
echo -e "\n${BLUE}🔐 Configuration SSL avec Let's Encrypt...${NC}"
read -t 30 -p "Voulez-vous configurer SSL automatiquement ? (o/n): " -n 1 -r || REPLY="n"
echo

if [[ $REPLY =~ ^[Oo]$ ]]; then
    # Construire la liste des domaines pour SSL
    SSL_DOMAINS="-d ${DOMAIN} -d www.${DOMAIN}"
    
    if [[ "$DEPLOY_PIZZA" == "true" ]]; then
        SSL_DOMAINS="${SSL_DOMAINS} -d pizza.getyoursite.fr"
    fi
    
    if [[ "$DEPLOY_MAIRIE" == "true" ]]; then
        SSL_DOMAINS="${SSL_DOMAINS} -d mairie.getyoursite.fr"
    fi
    
    if certbot --nginx ${SSL_DOMAINS} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect; then
        echo -e "${GREEN}✅ SSL configuré pour tous les domaines sélectionnés${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL non configuré - vous pouvez le faire manuellement plus tard${NC}"
    fi
fi

# 14. Statut final
echo -e "\n${GREEN}🎉 Déploiement VPS terminé avec succès!${NC}"
echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}🌐 Site principal: http://${DOMAIN}${NC}"
if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo -e "${GREEN}🍕 Site pizza: http://pizza.getyoursite.fr${NC}"
    if [[ "$CONFIGURE_STRIPE" == "true" ]]; then
        echo -e "${GREEN}💳 Paiements Stripe: Configurés${NC}"
        echo -e "${BLUE}   • URL webhook: https://pizza.getyoursite.fr/api/webhook/stripe${NC}"
        echo -e "${BLUE}   • Menu pizzas: 6 pizzas prédéfinies avec paiement en ligne${NC}"
    fi
fi
if [[ "$DEPLOY_MAIRIE" == "true" ]]; then
    echo -e "${GREEN}🏛️ Site mairie: http://mairie.getyoursite.fr${NC}"
fi

if [[ -f /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ]]; then
    echo -e "${GREEN}🔒 SSL activé: https://${DOMAIN}${NC}"
    if [[ "$DEPLOY_PIZZA" == "true" ]]; then
        echo -e "${GREEN}🔒 SSL pizza: https://pizza.getyoursite.fr${NC}"
    fi
    if [[ "$DEPLOY_MAIRIE" == "true" ]]; then
        echo -e "${GREEN}🔒 SSL mairie: https://mairie.getyoursite.fr${NC}"
    fi
fi
echo -e "\n${BLUE}📊 Statut des services:${NC}"
echo "• Application PM2:"
pm2 status
echo -e "\n• Service Nginx:"
systemctl is-active nginx && echo -e "${GREEN}✅ Nginx actif${NC}" || echo -e "${RED}❌ Nginx inactif${NC}"
echo -e "\n• Firewall UFW:"
ufw status | head -5

echo -e "\n${BLUE}🛠️  Commandes utiles:${NC}"
echo "• pm2 status - Statut des applications"
echo "• pm2 logs ${PROJECT_NAME} - Logs du site principal"
if [[ "$DEPLOY_PIZZA" == "true" || "$DEPLOY_MAIRIE" == "true" ]]; then
    echo "• Sites démo accessibles via même instance PM2"
fi
echo "• pm2 restart ${PROJECT_NAME} - Redémarrer l'application"
echo "• systemctl status nginx - Statut Nginx"
echo "• nginx -t - Tester la configuration Nginx"
echo "• certbot renew --dry-run - Tester le renouvellement SSL"

echo -e "\n${GREEN}✅ Votre site GetYourSite est maintenant en ligne!${NC}"
if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo -e "${GREEN}✅ Votre démo Pizza Bella Vita est également disponible!${NC}"
fi
if [[ "$DEPLOY_MAIRIE" == "true" ]]; then
    echo -e "${GREEN}✅ Votre démo Mairie de Brest est également disponible!${NC}"
fi