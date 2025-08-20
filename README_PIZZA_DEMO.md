# 🍕 Pizza Bella Vita - Site de Démonstration

## Vue d'ensemble

Ce projet contient maintenant deux sites web :

1. **GetYourSite** (site principal) - accessible via `getyoursite.fr`
2. **Pizza Bella Vita** (site de démonstration) - accessible via `pizza.getyoursite.fr`

## 🚀 Utilisation

### Accès aux sites

- **Site principal** : https://getyoursite.fr/
- **Démo pizzeria** : https://pizza.getyoursite.fr/ ou https://getyoursite.fr/pizza

### Fonctionnalités de la démo Pizza

#### ✨ Pages principales
- **Accueil** : Présentation de la pizzeria avec hero section attrayante
- **Menu** : Catalogue interactif de pizzas avec système de panier
- **À Propos** : Histoire de la pizzeria et valeurs
- **Contact** : Formulaire de commande avec coordonnées

#### 🛒 Système de panier
- Ajout/suppression de pizzas
- Modification des quantités
- Calcul automatique du total
- Interface modale intuitive

#### 📱 Design responsive
- Compatible mobile, tablette et desktop
- Images haute qualité optimisées
- Animations et transitions fluides

## 🛠️ Déploiement

### Script de déploiement amélioré

Le script `deploy-vps.sh` a été mis à jour pour gérer plusieurs domaines :

```bash
sudo ./deploy-vps.sh
```

Le script vous proposera :
1. **getyoursite.fr** (site principal)
2. **pizza.getyoursite.fr** (démo pizzeria)
3. **Domaine personnalisé** (votre choix)

### Configuration automatique

Pour chaque domaine, le script configure automatiquement :
- **Nginx** avec la configuration appropriée
- **PM2** avec un nom de projet unique
- **SSL** avec Let's Encrypt (optionnel)
- **Sécurité** headers et rate limiting

## 🔧 Configuration technique

### Structure des fichiers
```
/app/
├── app/
│   ├── page.js              # Site principal GetYourSite
│   ├── pizza-page.js        # Composant Pizza (réutilisable)
│   └── pizza/
│       └── page.js          # Route /pizza
├── middleware.js            # Routing et sécurité
├── deploy-vps.sh            # Script de déploiement multi-domaine
└── .env                     # Variables d'environnement
```

### Variables d'environnement

Les domaines autorisés sont configurés dans `.env` :
```
TRUSTED_ORIGINS=https://getyoursite.fr,https://pizza.getyoursite.fr,http://localhost:3000
```

### Sécurité

Toutes les mesures de sécurité sont maintenues :
- **CSP** (Content Security Policy) avec sources d'images autorisées
- **Rate limiting** sur l'API de contact
- **Headers de sécurité** (HSTS, XSS Protection, etc.)
- **Validation** et sanitisation des formulaires

## 🎯 Objectif de la démo

Cette démonstration illustre les capacités de GetYourSite pour créer :

### ✅ Sites e-commerce
- Catalogue produits avec images
- Système de panier fonctionnel
- Formulaires de commande

### ✅ Sites vitrines
- Design moderne et attractif
- Navigation intuitive
- Optimisation mobile

### ✅ Fonctionnalités avancées
- Animations CSS fluides
- Gestion d'état React
- API sécurisées

## 📊 Utilisation pour investisseurs

Cette démo permet de montrer concrètement :

1. **Qualité technique** : Code propre, sécurisé, performant
2. **Design moderne** : Interface attrayante et professionnelle
3. **Fonctionnalités complètes** : E-commerce, formulaires, navigation
4. **Adaptabilité** : Facile à personnaliser pour tout secteur
5. **Déploiement simple** : Script automatisé pour mise en production

## 🔄 Développement local

```bash
# Installation des dépendances
yarn install

# Développement
yarn dev

# Build de production
yarn build

# Démarrage en production
yarn start
```

## 📞 Support

- **Site principal** : contact@getyoursite.fr
- **Démo** : Formulaire fonctionnel avec même API
- **Documentation** : README.md principal

---

*Cette démonstration Pizza Bella Vita a été créée pour illustrer le savoir-faire de GetYourSite dans la création de sites web professionnels et fonctionnels.*