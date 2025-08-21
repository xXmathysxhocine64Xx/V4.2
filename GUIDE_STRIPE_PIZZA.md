# 🍕💳 Guide Configuration Stripe pour Lucky Pizza

Ce guide vous aide à configurer complètement le système de paiement Stripe pour votre site de démonstration pizzeria.

## 📋 Prérequis

1. **Compte Stripe** : Créez un compte sur [stripe.com](https://stripe.com)
2. **Domaine configuré** : Assurez-vous que `pizza.getyoursite.fr` pointe vers votre serveur
3. **SSL activé** : Les paiements Stripe nécessitent HTTPS

## 🔑 Obtenir les Clés Stripe

### 1. Clés API
1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Allez dans **Développeurs** → **Clés API**
3. Notez :
   - **Clé publique** : Commence par `pk_test_...` (mode test) ou `pk_live_...` (mode production)
   - **Clé secrète** : Commence par `sk_test_...` (mode test) ou `sk_live_...` (mode production)

### 2. Webhook (Optionnel mais recommandé)
1. Dans le Dashboard Stripe → **Développeurs** → **Webhooks**
2. Cliquez **Ajouter un point de terminaison**
3. URL du webhook : `https://pizza.getyoursite.fr/api/webhook/stripe`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Notez le **Secret de signature** (`whsec_...`)

## ⚙️ Configuration Automatique

### Utilisation du Script de Déploiement
```bash
sudo ./deploy-vps-fixed.sh
```

Quand le script vous demande :
1. **Déployer pizza** : Répondez `o` (oui)
2. **Configurer Stripe** : Répondez `o` (oui)
3. Entrez vos clés Stripe quand demandé

### Configuration Manuelle

Si vous préférez configurer manuellement, éditez le fichier `.env` :

```bash
# Clés Stripe (remplacez par vos vraies clés)
STRIPE_API_KEY=sk_test_votre_cle_secrete_ici
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_ici

# Base de données pour les transactions
MONGO_URL=mongodb://localhost:27017
```

Puis redémarrez l'application :
```bash
pm2 restart getyoursite
```

## 🧪 Tests et Validation

### 1. Script de Validation Automatique
```bash
cd /app
./validate-pizza-config.sh
```

### 2. Tests Manuels

#### Test API Contact
```bash
curl https://pizza.getyoursite.fr/api/contact
```
Devrait retourner : `{"message":"API Contact GetYourSite","status":"active"}`

#### Test API Paiement
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"package_id":"margherita"}' \
  https://pizza.getyoursite.fr/api/payments/checkout
```

#### Test depuis le Site
1. Visitez `https://pizza.getyoursite.fr/pizza/menu`
2. Ajoutez une pizza au panier
3. Testez le processus de commande

## 🍕 Produits Prédéfinis

Le système inclut 6 pizzas avec prix fixes :
- **Margherita** : 12,90 €
- **Napoletana** : 15,90 €
- **Quattro Formaggi** : 18,90 €
- **Diavola** : 17,90 €
- **Vegetariana** : 16,90 €
- **Prosciutto** : 19,90 €

Les prix sont définis côté serveur pour la sécurité.

## 🔐 Sécurité

### Mode Test vs Production
- **Mode Test** : Utilisez les clés `pk_test_...` et `sk_test_...`
- **Mode Production** : Utilisez les clés `pk_live_...` et `sk_live_...`

### Cartes de Test Stripe
En mode test, utilisez ces numéros de carte :
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`

## 📊 Monitoring

### Logs des Paiements
```bash
# Logs généraux
pm2 logs getyoursite

# Logs spécifiques aux paiements
grep "payment" /var/log/pm2/getyoursite.log

# Logs en temps réel
tail -f /var/log/pm2/getyoursite.log | grep payment
```

### Dashboard Stripe
- Consultez vos transactions dans le Dashboard Stripe
- Configurez des alertes email pour les paiements échoués

## 🛠️ Dépannage

### Problèmes Courants

#### 1. "Clé API non trouvée"
- Vérifiez que `STRIPE_API_KEY` est dans `.env`
- Redémarrez l'application : `pm2 restart getyoursite`

#### 2. "Webhook signature invalide"
- Vérifiez l'URL du webhook dans Stripe : `https://pizza.getyoursite.fr/api/webhook/stripe`
- Vérifiez que `STRIPE_WEBHOOK_SECRET` correspond

#### 3. Paiements non traités
- Vérifiez les logs : `pm2 logs getyoursite`
- Testez avec une carte valide en mode test
- Vérifiez la connectivité MongoDB

### Support

Pour plus d'aide :
1. Consultez la [documentation Stripe](https://stripe.com/docs)
2. Vérifiez les logs de l'application
3. Utilisez le script de validation : `./validate-pizza-config.sh`

---

## 🎯 Configuration Prête pour Démo

Une fois configuré, votre site pizza démontre :
- ✅ Catalogue produits interactif
- ✅ Panier d'achat fonctionnel  
- ✅ Paiements sécurisés Stripe
- ✅ Formulaire de contact
- ✅ Design responsive moderne
- ✅ Gestion des transactions en base

Parfait pour présenter une solution e-commerce complète à vos prospects !