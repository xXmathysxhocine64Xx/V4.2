# 📧 Guide de Dépannage - Formulaire de Contact

Ce guide vous aide à résoudre les problèmes courants avec les formulaires de contact.

## 🔍 Diagnostic Rapide

### 1. Test automatique
```bash
cd /app
./validate-pizza-config.sh
```

### 2. Test API direct
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}' \
  http://localhost:3000/api/contact
```

**Résultat attendu :** 
```json
{"success":true,"message":"Message reçu avec succès!","requestId":"..."}
```

## ❌ Problèmes Courants et Solutions

### Problème 1 : "Erreur lors de l'envoi du message"

**Cause :** Problème CORS ou configuration email

**Solutions :**

1. **Vérifier la configuration CORS** :
   ```bash
   # L'origine doit être autorisée
   grep "TRUSTED_ORIGINS" /app/.env
   ```

2. **Tester depuis localhost** :
   ```bash
   curl -H "Origin: http://localhost:3000" \
        -X POST -H "Content-Type: application/json" \
        -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test"}' \
        http://localhost:3000/api/contact
   ```

3. **Redémarrer l'application** :
   ```bash
   pm2 restart getyoursite
   # ou en développement :
   yarn dev
   ```

### Problème 2 : Email non envoyé (mais formulaire fonctionne)

**Cause :** Configuration Gmail incorrecte

**Solutions :**

1. **Configurer Gmail correctement** :
   ```bash
   # Éditer .env
   GMAIL_USER=votre-email@gmail.com
   GMAIL_APP_PASSWORD=votre-mot-de-passe-app
   GMAIL_RECIPIENT=votre-email@gmail.com
   ```

2. **Générer un mot de passe d'application Gmail** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Activez la validation en 2 étapes si nécessaire
   - Générez un mot de passe pour "Autre (nom personnalisé)"
   - Utilisez ce mot de passe dans `GMAIL_APP_PASSWORD`

3. **Tester la configuration email** :
   ```bash
   # Le message doit indiquer "Message envoyé avec succès!"
   curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test Gmail","email":"test@example.com","subject":"Test Email","message":"Test configuration Gmail"}' \
     http://localhost:3000/api/contact
   ```

### Problème 3 : CORS Error dans le navigateur

**Cause :** Origine non autorisée

**Solutions :**

1. **Vérifier les domaines autorisés** :
   ```javascript
   // Dans /app/middleware.js
   const ALLOWED_ORIGINS = [
     'https://getyoursite.fr',
     'https://pizza.getyoursite.fr',
     'https://mairie.getyoursite.fr',
     'http://localhost:3000'  // <- Doit être présent pour le dev
   ];
   ```

2. **Vérifier TRUSTED_ORIGINS dans .env** :
   ```bash
   TRUSTED_ORIGINS=https://getyoursite.fr,https://pizza.getyoursite.fr,https://mairie.getyoursite.fr,http://localhost:3000
   ```

### Problème 4 : Rate Limiting (Trop de tentatives)

**Cause :** Protection anti-spam activée

**Solutions :**

1. **Vérifier les limites** :
   ```bash
   grep "RATE_LIMIT" /app/.env
   # RATE_LIMIT_MAX=10 (10 tentatives)
   # RATE_LIMIT_WINDOW=900000 (15 minutes)
   ```

2. **Attendre ou ajuster les limites** :
   ```bash
   # Augmenter temporairement pour les tests
   RATE_LIMIT_MAX=50
   ```

## ⚙️ Configuration Automatique via Script

Utilisez le script de déploiement pour configurer automatiquement :

```bash
sudo ./deploy-vps-fixed.sh
```

Le script vous demandera :
- ✅ Configuration email Gmail
- ✅ Configuration Stripe (pour pizza)
- ✅ Tests automatiques

## 🧪 Tests de Validation

### Test complet du formulaire
```bash
# 1. API accessible
curl http://localhost:3000/api/contact

# 2. Formulaire fonctionnel
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test Complet","email":"test@example.com","subject":"Validation","message":"Test validation complète du formulaire"}' \
  http://localhost:3000/api/contact

# 3. Vérification configuration
./validate-pizza-config.sh
```

### Test depuis l'interface web
1. Ouvrir `http://localhost:3000/pizza/contact`
2. Remplir le formulaire
3. Vérifier le message de succès/erreur
4. Vérifier la réception d'email (si configuré)

## 📊 Logs et Debugging

### Consulter les logs
```bash
# Logs PM2
pm2 logs getyoursite

# Logs spécifiques aux contacts
pm2 logs getyoursite | grep -i "contact\|email\|rate"

# Logs en temps réel
tail -f /var/log/pm2/getyoursite.log
```

### Informations de debug utiles
- **Request ID** : Chaque requête a un ID unique pour le traçage
- **Rate Limiting** : Compteurs affichés dans les headers
- **CORS** : Vérifier l'origine dans les headers
- **Email** : Succès/échec de l'envoi logué

## 🔧 Configuration Avancée

### Variables d'environnement complètes
```bash
# Configuration email
GMAIL_USER=votre-email@gmail.com
GMAIL_APP_PASSWORD=mot-de-passe-app-16-caracteres
GMAIL_RECIPIENT=destinataire@gmail.com

# Sécurité
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=900000
TRUSTED_ORIGINS=https://getyoursite.fr,https://pizza.getyoursite.fr,https://mairie.getyoursite.fr

# MongoDB (pour les logs)
MONGO_URL=mongodb://localhost:27017
```

### Redémarrage après modification
```bash
# Recharger les variables d'environnement
pm2 restart getyoursite --update-env

# Ou redémarrage complet
pm2 delete getyoursite
pm2 start ecosystem.config.js
```

## 📞 Support

Si le problème persiste :
1. Exécuter `./validate-pizza-config.sh` et partager le résultat
2. Vérifier les logs : `pm2 logs getyoursite`
3. Tester l'API directement avec curl
4. Vérifier la configuration des domaines et CORS

---

✅ **Formulaire fonctionnel = Message "success":true**
📧 **Email configuré = Message "Message envoyé avec succès!"**
🛡️ **Sécurité active = Rate limiting et CORS fonctionnels**