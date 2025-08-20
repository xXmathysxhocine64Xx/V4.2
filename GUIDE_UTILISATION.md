# 🚀 GetYourSite - Guide d'Utilisation

## 📋 Présentation

GetYourSite est un site web professionnel de présentation des services de création, déploiement et refonte de sites web. L'application est construite avec Next.js et utilise PM2 pour le déploiement.

## 🛠️ Installation et Déploiement

### Prérequis
- Node.js (version 16 ou supérieure)
- Yarn (gestionnaire de paquets)
- PM2 (gestionnaire de processus)
- Nginx (pour VPS en production)

## 🖥️ Déploiement Local/Développement

### Déploiement Simple
```bash
# Rendre le script exécutable
chmod +x deploy-simple.sh

# Lancer le déploiement
./deploy-simple.sh
```

Le script effectue automatiquement :
- ✅ Vérification des outils (Node.js, Yarn, PM2)
- ✅ Installation des dépendances
- ✅ Build de l'application Next.js
- ✅ Configuration et démarrage PM2
- ✅ Test de fonctionnement
- ✅ Configuration du démarrage automatique

## 🌐 Déploiement VPS Production

### Déploiement VPS Complet
```bash
# Rendre le script exécutable
chmod +x deploy-vps.sh

# Lancer le déploiement (en root)
sudo ./deploy-vps.sh
```

Le script VPS effectue automatiquement :
- ✅ Mise à jour système et installation des outils
- ✅ Configuration du firewall (UFW)
- ✅ Installation et build de l'application
- ✅ Configuration PM2 optimisée
- ✅ Configuration Nginx avec reverse proxy
- ✅ Configuration SSL optionnelle (Let's Encrypt)
- ✅ Tests complets de fonctionnement

### Diagnostic VPS
```bash
# Diagnostiquer les problèmes
chmod +x diagnostic-vps.sh
./diagnostic-vps.sh
```

Le diagnostic vérifie :
- ✅ État des services (PM2, Nginx, Node.js)
- ✅ Ports ouverts et connectivité
- ✅ Configuration DNS
- ✅ Certificats SSL
- ✅ Logs et performances
- ✅ Recommandations de correction

## 🔧 Configuration VPS

### Structure de déploiement VPS
```
Utilisateur → Domaine (getyoursite.fr)
    ↓
Nginx (Port 80/443)
    ↓
Application Next.js via PM2 (Port 3000)
```

### Fichiers de configuration créés
- `/etc/nginx/sites-available/getyoursite.fr` - Configuration Nginx
- `/var/log/pm2/getyoursite.*` - Logs PM2
- `/etc/letsencrypt/live/getyoursite.fr/` - Certificats SSL

## 🌐 Accès au Site

### Développement Local
- **URL locale** : http://localhost:3000
- **API Contact** : http://localhost:3000/api/contact

### Production VPS
- **URL publique** : http://getyoursite.fr
- **URL sécurisée** : https://getyoursite.fr (si SSL configuré)
- **API Contact** : http://getyoursite.fr/api/contact

## 📊 Gestion avec PM2

### Commandes utiles
```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs getyoursite

# Redémarrer
pm2 restart getyoursite

# Arrêter
pm2 stop getyoursite

# Supprimer
pm2 delete getyoursite

# Logs en temps réel
pm2 logs getyoursite --follow
```

## 🔧 Gestion Nginx (VPS)

### Commandes utiles
```bash
# Statut Nginx
systemctl status nginx

# Redémarrer Nginx
systemctl restart nginx

# Tester la configuration
nginx -t

# Recharger la configuration
systemctl reload nginx

# Logs Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## 🔒 Gestion SSL (VPS)

### Renouvellement automatique
```bash
# Tester le renouvellement
certbot renew --dry-run

# Forcer le renouvellement
certbot renew --force-renewal

# Voir les certificats
certbot certificates
```

## 🔧 Structure du Projet

```
/
├── app/                    # Application Next.js
│   ├── page.js            # Page principale
│   ├── layout.js          # Layout global
│   ├── globals.css        # Styles globaux
│   └── api/
│       └── contact/
│           └── route.js   # API de contact
├── deploy-simple.sh       # Script déploiement local
├── deploy-vps.sh          # Script déploiement VPS
├── diagnostic-vps.sh      # Script diagnostic VPS
├── validate-getyoursite.sh # Script de validation
├── ecosystem.config.js    # Configuration PM2
├── package.json           # Dépendances du projet
├── next.config.js         # Configuration Next.js
└── README.md             # Documentation
```

## 🎨 Fonctionnalités

### Page Principale
- **Section Hero** : Présentation des services
- **Section Services** : Conception, Déploiement, Refonte
- **Section Portfolio** : Exemples de réalisations
- **Section Contact** : Formulaire de contact

### API de Contact
- **GET** `/api/contact` : Vérification du statut de l'API
- **POST** `/api/contact` : Envoi de messages de contact

## 🔄 Maintenance

### Mise à jour Local
```bash
# Arrêter l'application
pm2 stop getyoursite

# Mettre à jour le code
git pull origin main

# Réinstaller les dépendances
yarn install

# Rebuild
yarn build

# Redémarrer
pm2 start getyoursite
```

### Mise à jour VPS
```bash
# Se connecter au VPS
ssh root@votre-serveur

# Aller dans le répertoire du projet
cd /path/to/getyoursite

# Suivre les étapes de mise à jour locale
# Puis redémarrer Nginx si nécessaire
systemctl reload nginx
```

## ⚠️ Dépannage

### Problèmes courants VPS

#### Site non accessible depuis l'extérieur
1. Exécuter le diagnostic : `./diagnostic-vps.sh`
2. Vérifier le DNS : Le domaine pointe-t-il vers votre IP ?
3. Vérifier le firewall : `ufw status`
4. Vérifier Nginx : `systemctl status nginx`

#### Application ne démarre pas
```bash
# Vérifier PM2
pm2 status

# Voir les erreurs
pm2 logs getyoursite --lines 50

# Redémarrer si nécessaire
pm2 restart getyoursite
```

#### Nginx erreur 502 Bad Gateway
```bash
# Vérifier que l'application répond sur le port 3000
curl http://localhost:3000

# Vérifier la configuration Nginx
nginx -t

# Voir les logs Nginx
tail -f /var/log/nginx/error.log
```

#### Certificat SSL expiré
```bash
# Renouveler manuellement
certbot renew --force-renewal

# Redémarrer Nginx
systemctl restart nginx
```

### Outils de debug
```bash
# Vérifier tous les ports ouverts
netstat -tuln

# Vérifier les processus Node.js
ps aux | grep node

# Tester la connectivité
curl -I http://getyoursite.fr
curl -I https://getyoursite.fr

# Vérifier l'utilisation des ressources
top
df -h
free -h
```

## 📞 Support

En cas de problème, consultez dans l'ordre :
1. **Script de diagnostic** : `./diagnostic-vps.sh`
2. **Logs PM2** : `pm2 logs getyoursite`
3. **Logs Nginx** : `/var/log/nginx/error.log`
4. **Script de validation** : `./validate-getyoursite.sh`
5. **État des services** : `pm2 status` et `systemctl status nginx`

### Contacts d'urgence pour le VPS
- Vérifier la connectivité réseau du serveur
- Contacter l'hébergeur si problème d'infrastructure
- Vérifier les paramètres DNS chez le registraire de domaine

---

**GetYourSite** - Solution simple et stable pour votre présence web professionnelle, maintenant optimisée pour VPS en production !