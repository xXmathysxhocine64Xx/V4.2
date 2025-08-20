# 🚀 GetYourSite - Guide d'Utilisation Simplifié

## Installation Complète

```bash
# Clonez ou téléchargez les fichiers du projet
# Puis exécutez l'installation :
sudo ./install-getyoursite.sh
```

Le script d'installation va :
- ✅ Installer Node.js, Yarn, PM2 automatiquement
- ✅ Configurer Nginx (optionnel)
- ✅ Déployer l'application avec PM2
- ✅ Configurer Gmail (optionnel)
- ✅ Tester le fonctionnement

## Déploiement Rapide (si déjà installé)

```bash
./deploy-simple.sh
```

## Commandes Essentielles

### Gestion de l'application
```bash
# Voir le statut
pm2 status

# Voir les logs en temps réel
pm2 logs getyoursite

# Redémarrer l'application
pm2 restart getyoursite

# Arrêter l'application
pm2 stop getyoursite

# Démarrer l'application
pm2 start getyoursite
```

### Développement local
```bash
# Mode développement
yarn dev

# Build de production
yarn build

# Démarrer en production
yarn start
```

## Configuration Gmail

1. **Obtenir un mot de passe d'application Gmail :**
   - Allez sur [myaccount.google.com](https://myaccount.google.com)
   - Sécurité → Vérification en 2 étapes (activez-la si nécessaire)
   - Sécurité → Mots de passe des applications
   - Générez un mot de passe pour "Courrier"

2. **Configurer dans le fichier `.env` :**
   ```bash
   GMAIL_USER=votre-email@gmail.com
   GMAIL_APP_PASSWORD=votre-mot-de-passe-app-16-caracteres
   GMAIL_RECIPIENT=votre-email@gmail.com
   ```

3. **Redémarrer l'application :**
   ```bash
   pm2 restart getyoursite
   ```

## Structure du Projet Simplifiée

```
/var/www/getyoursite/
├── app/
│   ├── page.js              # Site vitrine complet
│   ├── layout.js            # Layout principal
│   ├── globals.css          # Styles CSS
│   └── api/
│       └── contact/
│           └── route.js     # API de contact
├── package.json             # Dépendances minimales
├── next.config.js           # Configuration Next.js
├── ecosystem.config.js      # Configuration PM2
├── deploy-simple.sh         # Script de déploiement
├── install-getyoursite.sh   # Script d'installation
└── .env                     # Variables d'environnement
```

## Résolution de Problèmes

### L'application ne démarre pas
```bash
# Vérifier les logs
pm2 logs getyoursite

# Redémarrer PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Erreur 404 
```bash
# Vérifier que l'app est bien démarrée
pm2 status

# Tester l'API directement
curl http://localhost:3000/api/contact
```

### Problème de build
```bash
# Nettoyer et rebuilder
rm -rf .next/
yarn build
pm2 restart getyoursite
```

### Nginx ne redirige pas
```bash
# Tester la config Nginx
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

## URLs d'Accès

- **Site principal :** http://localhost:3000
- **API de contact :** http://localhost:3000/api/contact
- **Avec Nginx :** http://votre-ip-serveur

## Fonctionnalités

✅ **Site vitrine complet** avec sections Hero, Services, Portfolio, Contact  
✅ **Formulaire de contact** avec validation et envoi d'emails  
✅ **Design responsive** adaptatif mobile/desktop  
✅ **Code ultra-simplifié** et stable  
✅ **Déploiement PM2** robuste et fiable  
✅ **Configuration minimale** facile à maintenir  

## Support

Le code a été volontairement simplifié pour :
- ❌ **Supprimer** toute la complexité inutile
- ✅ **Garder** seulement les fonctionnalités essentielles  
- ✅ **Assurer** une stabilité maximale
- ✅ **Faciliter** la maintenance et le débogage

**Aucun script de maintenance complexe, aucun fichier de debug - juste l'essentiel qui fonctionne !**