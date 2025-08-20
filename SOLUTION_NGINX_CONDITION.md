# 🚨 SOLUTION RAPIDE - Erreur Condition Nginx

## Problème rencontré
```
❌ Erreur de configuration Nginx
2025/08/20 23:02:54 [emerg] 3144#3144: invalid condition "=" in /etc/nginx/sites-enabled/getyoursite.fr:54
nginx: configuration file /etc/nginx/nginx.conf test failed
```

## 🔧 Solution Immédiate

Exécutez ce script pour corriger l'erreur automatiquement :

```bash
sudo ./fix-nginx-condition.sh
```

## 📋 Que fait ce script ?

1. **Corrige la syntaxe de condition Nginx**
   - Remplace `if ($host = pizza.getyoursite.fr)` 
   - Par `if ($host = "pizza.getyoursite.fr")`

2. **Ajoute les zones de rate limiting manquantes**
   - `contact_limit` et `general_limit` dans nginx.conf

3. **Teste et redémarre Nginx**
   - Valide la configuration
   - Redémarre le service automatiquement

## 🎯 Après la correction

Une fois le script exécuté avec succès, vous pouvez :

1. **Relancer le déploiement complet :**
   ```bash
   sudo ./deploy-vps.sh
   ```

2. **Ou vérifier que tout fonctionne :**
   ```bash
   nginx -t
   systemctl status nginx
   ```

## 🔍 Vérification manuelle

Si vous préférez corriger manuellement, éditez le fichier :
```bash
nano /etc/nginx/sites-enabled/getyoursite.fr
```

Et changez la ligne ~54 :
```nginx
# AVANT (incorrect)
if ($host = pizza.getyoursite.fr) {

# APRÈS (correct)  
if ($host = "pizza.getyoursite.fr") {
```

## ✅ Résultat attendu

Après correction, vous devriez voir :
```
✅ Configuration Nginx corrigée avec succès!
✅ Nginx redémarré
🎉 SUCCÈS - Erreur de condition corrigée!
```

---
**Note :** Cette erreur était causée par une syntaxe Nginx incorrecte dans la condition de redirection pour le sous-domaine pizza. Le script de déploiement a maintenant été corrigé pour éviter ce problème à l'avenir.