#!/bin/bash

# ===============================================
# 🚀 GetYourSite - Déploiement VPS Complet
# ===============================================

set -e  # Arrêter en cas d'erreur

# Variables par défaut
PROJECT_NAME="getyoursite"
PROJECT_DIR="$(pwd)"
DEFAULT_DOMAIN="getyoursite.fr"
APP_PORT="3000"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Déploiement GetYourSite sur VPS${NC}"
echo "========================================="

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Ce script doit être exécuté en tant que root${NC}"
   echo "Utilisez: sudo ./deploy-vps.sh"
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
read -p "Déployer aussi pizza.getyoursite.fr ? (o/n): " pizza_choice

if [[ $pizza_choice =~ ^[Oo]$ ]]; then
    DEPLOY_PIZZA="true"
    echo -e "${GREEN}✅ Déploiement du site principal + démo pizzeria${NC}"
else
    DEPLOY_PIZZA="false"
    echo -e "${GREEN}✅ Déploiement du site principal uniquement${NC}"
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

cat > /etc/nginx/sites-available/${DOMAIN} << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

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
        
        # Redirection interne vers /pizza pour le sous-domaine pizza
        if ($host = pizza.getyoursite.fr) {
            rewrite ^/$ /pizza last;
        }
        
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
if ! nginx -t > /dev/null 2>&1; then
    echo -e "${RED}❌ Erreur de configuration Nginx${NC}"
    nginx -t
    exit 1
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
else
    echo -e "${RED}❌ Problème de démarrage de l'application${NC}"
    echo "Logs PM2:"
    pm2 logs "$PROJECT_NAME" --lines 10 --raw 2>/dev/null || echo "Pas de logs disponibles"
    exit 1
fi

# 13. Déploiement optionnel du site Pizza
if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo -e "\n${BLUE}🍕 Configuration du site Pizza Bella Vita...${NC}"
    
    PIZZA_DOMAIN="pizza.getyoursite.fr"
    PIZZA_PROJECT_NAME="pizza-getyoursite"
    
    # Configuration Nginx pour le site pizza
    cat > /etc/nginx/sites-available/${PIZZA_DOMAIN} << EOF
server {
    listen 80;
    server_name ${PIZZA_DOMAIN};

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

    # Activer le site pizza
    ln -sf /etc/nginx/sites-available/${PIZZA_DOMAIN} /etc/nginx/sites-enabled/
    
    echo -e "${GREEN}✅ Configuration Pizza déployée${NC}"
fi

# 14. Configuration SSL (optionnelle)
echo -e "\n${BLUE}🔐 Configuration SSL avec Let's Encrypt...${NC}"
read -p "Voulez-vous configurer SSL automatiquement ? (o/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    if [[ "$DEPLOY_PIZZA" == "true" ]]; then
        # SSL pour les deux domaines
        if certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -d pizza.getyoursite.fr --non-interactive --agree-tos --email admin@${DOMAIN} --redirect; then
            echo -e "${GREEN}✅ SSL configuré pour les deux sites${NC}"
        else
            echo -e "${YELLOW}⚠️  SSL non configuré - vous pouvez le faire manuellement plus tard${NC}"
        fi
    else
        # SSL pour le site principal uniquement
        if certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect; then
            echo -e "${GREEN}✅ SSL configuré avec succès${NC}"
        else
            echo -e "${YELLOW}⚠️  SSL non configuré - vous pouvez le faire manuellement plus tard${NC}"
        fi
    fi
fi

# 15. Statut final
echo -e "\n${GREEN}🎉 Déploiement VPS terminé avec succès!${NC}"
echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}🌐 Site principal: http://${DOMAIN}${NC}"
if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo -e "${GREEN}🍕 Site pizza: http://pizza.getyoursite.fr${NC}"
fi
if [[ -f /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ]]; then
    echo -e "${GREEN}🔒 SSL activé: https://${DOMAIN}${NC}"
    if [[ "$DEPLOY_PIZZA" == "true" ]]; then
        echo -e "${GREEN}🔒 SSL pizza: https://pizza.getyoursite.fr${NC}"
    fi
fi
echo -e "\n${BLUE}📊 Statut des services:${NC}"
echo "• Application PM2:"
pm2 status
echo -e "\n• Service Nginx:"
systemctl is-active nginx && echo "✅ Nginx actif" || echo "❌ Nginx inactif"
echo -e "\n• Firewall UFW:"
ufw status | head -5

echo -e "\n${BLUE}🛠️  Commandes utiles:${NC}"
echo "• pm2 status - Statut des applications"
echo "• pm2 logs ${PROJECT_NAME} - Logs du site principal"
if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo "• pm2 logs pizza-getyoursite - Logs du site pizza (même instance)"
fi
echo "• pm2 restart ${PROJECT_NAME} - Redémarrer l'application"
echo "• systemctl status nginx - Statut Nginx"
echo "• nginx -t - Tester la configuration Nginx"
echo "• certbot renew --dry-run - Tester le renouvellement SSL"

echo -e "\n${GREEN}✅ Votre site GetYourSite est maintenant en ligne!${NC}"
if [[ "$DEPLOY_PIZZA" == "true" ]]; then
    echo -e "${GREEN}✅ Votre démo Pizza Bella Vita est également disponible!${NC}"
fi