# 🍕 Solution Rapide - pizza.getyoursite.fr

## 🚨 Problème
`pizza.getyoursite.fr` redirige vers le site principal au lieu du site pizza.

## ✅ Solution Immédiate

### **Étape 1 : Corriger Nginx**
```bash
sudo ./fix-nginx.sh
```

### **Étape 2 : Déployer avec le script corrigé**
```bash
sudo ./deploy-vps.sh
```
- Choisir le déploiement du site principal (obligatoire)
- **Répondre `n`** à la question pizza (on va le configurer manuellement)

### **Étape 3 : Configurer manuellement le routage pizza**

Une fois le site principal déployé, ajouter cette règle dans la configuration Nginx :

```bash
sudo nano /etc/nginx/sites-available/getyoursite.fr
```

Dans la section `location /`, ajouter après `limit_req zone=general_limit burst=10 nodelay;` :

```nginx
# Redirection interne vers /pizza pour le sous-domaine pizza
if ($host = pizza.getyoursite.fr) {
    rewrite ^/$ /pizza last;
}
```

### **Étape 4 : Redémarrer Nginx**
```bash
sudo nginx -t    # Tester la configuration
sudo systemctl reload nginx
```

## 🌐 Test du Résultat

Après ces étapes :
- `getyoursite.fr` → Site principal GetYourSite ✅
- `pizza.getyoursite.fr` → Redirige automatiquement vers `/pizza` ✅
- `getyoursite.fr/pizza` → Site pizza directement ✅

## 📋 Configuration Nginx Finale

Voici à quoi doit ressembler votre section `location /` :

```nginx
location / {
    limit_req zone=general_limit burst=10 nodelay;
    
    # Redirection interne vers /pizza pour le sous-domaine pizza  
    if ($host = pizza.getyoursite.fr) {
        rewrite ^/$ /pizza last;
    }
    
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Timeout settings
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

## 🔧 Avantages de cette Solution

✅ **Simple** : Une seule configuration Nginx
✅ **Performant** : Une seule instance Node.js
✅ **Flexible** : Facile à modifier
✅ **Sécurisé** : Même configuration de sécurité partout

---

*Cette solution utilise la redirection Nginx interne pour router automatiquement `pizza.getyoursite.fr` vers `/pizza`*