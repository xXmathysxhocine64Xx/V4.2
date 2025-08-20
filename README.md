# GetYourSite - Version Simplifiée

Site vitrine professionnel simplifié et stable.

## Déploiement

```bash
sudo ./deploy-simple.sh
```

## Commandes utiles

- `pm2 status` - Voir le statut
- `pm2 logs getyoursite` - Voir les logs
- `pm2 restart getyoursite` - Redémarrer
- `pm2 stop getyoursite` - Arrêter

## Configuration Gmail

Modifiez le fichier `.env` avec vos informations Gmail:

```
GMAIL_USER=votre-email@gmail.com
GMAIL_APP_PASSWORD=votre-mot-de-passe-app
GMAIL_RECIPIENT=votre-email@gmail.com
```

Puis redémarrez: `pm2 restart getyoursite`