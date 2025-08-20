# 🚀 Guide de Déploiement - GetYourSite + Pizza Demo

## ⚠️ Si vous avez l'erreur Nginx

Si vous obtenez l'erreur :
```
"limit_req_zone" directive is not allowed here
```

**Première étape : Corriger Nginx**
```bash
sudo ./fix-nginx.sh
```

Ce script va :
- Nettoyer les configurations problématiques
- Ajouter les zones de rate limiting au bon endroit
- Redémarrer Nginx proprement

## 🚀 Déploiement Standard

**Lancer le déploiement :**
```bash
sudo ./deploy-vps.sh
```

Le script va maintenant :

### 1️⃣ **Site Principal (Obligatoire)**
- Déployer automatiquement `getyoursite.fr`
- Configuration Nginx sécurisée
- SSL avec Let's Encrypt

### 2️⃣ **Site Pizza (Optionnel)**  
Le script vous demandera :
```
➕ Souhaitez-vous également déployer la démo pizzeria sur pizza.getyoursite.fr ?
Déployer aussi pizza.getyoursite.fr ? (o/n):
```

- **Répondre `o`** : Déploie les deux sites
- **Répondre `n`** : Site principal uniquement

## 📂 Structure de Déploiement

### Site Principal Seul
```
getyoursite.fr        → Site vitrine GetYourSite
www.getyoursite.fr    → Redirection vers getyoursite.fr
```

### Avec Site Pizza
```
getyoursite.fr        → Site vitrine GetYourSite  
pizza.getyoursite.fr  → Démo pizzeria
www.getyoursite.fr    → Redirection vers getyoursite.fr
```

## 🛠️ Gestion PM2

**Une seule instance PM2** gère les deux sites :
```bash
pm2 status                    # Voir le statut
pm2 logs getyoursite         # Logs de l'application
pm2 restart getyoursite      # Redémarrer
```

## 🔐 SSL Automatique

Le script configure SSL pour :
- Site principal : `getyoursite.fr` + `www.getyoursite.fr`
- Si pizza : ajoute `pizza.getyoursite.fr`

## 🌐 Accès aux Sites

### Développement Local
```
http://localhost:3000/       → Site GetYourSite
http://localhost:3000/pizza  → Site Pizza
```

### Production
```
https://getyoursite.fr/       → Site GetYourSite
https://pizza.getyoursite.fr/ → Site Pizza
```

## 🔧 Dépannage

### Vérifier Nginx
```bash
nginx -t                    # Tester la config
systemctl status nginx     # Statut du service
systemctl reload nginx     # Recharger la config
```

### Vérifier PM2
```bash
pm2 status                 # Applications en cours
pm2 logs --lines 50       # Logs récents
```

### Vérifier les Domaines
```bash
curl -H "Host: getyoursite.fr" http://localhost/
curl -H "Host: pizza.getyoursite.fr" http://localhost/
```

## 📊 Avantages de cette Architecture

✅ **Performance** : Une seule instance Node.js pour les deux sites
✅ **Sécurité** : Configuration Nginx centralisée  
✅ **Maintenance** : Déploiement unifié
✅ **Flexibilité** : Pizza optionnel selon les besoins
✅ **SSL** : Certificats automatiques pour tous les domaines

## 🎯 Usage Commercial

Cette démo Pizza illustre parfaitement les capacités GetYourSite :
- **Sites e-commerce** avec panier fonctionnel
- **Design professionnel** responsive
- **Formulaires sécurisés** avec validation
- **Déploiement simple** en un clic

---

*Guide créé pour GetYourSite.fr - Votre partenaire web professionnel*