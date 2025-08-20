#!/bin/bash

echo "🚀 Script de Maintenance GetYourSite"
echo "=================================="

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 n'est pas installé. Installation..."
    npm install -g pm2
fi

# Fonction pour rebuild et redémarrer
rebuild_and_restart() {
    echo "🔨 Reconstruction du build production..."
    cd /app
    
    # Nettoyer l'ancien build
    rm -rf .next
    
    # Rebuild
    if yarn build; then
        echo "✅ Build réussi"
        
        # Redémarrer PM2
        echo "🔄 Redémarrage de l'application..."
        pm2 restart getyoursite
        
        echo "⏳ Vérification du démarrage..."
        sleep 10
        
        if curl -f http://localhost:3000 >/dev/null 2>&1; then
            echo "✅ Application démarrée avec succès!"
            echo "🌐 Site accessible sur: https://deploy-script-fix.preview.emergentagent.com"
        else
            echo "❌ Erreur de démarrage, vérifiez les logs PM2"
            pm2 logs getyoursite --lines 10
        fi
    else
        echo "❌ Erreur lors du build"
        exit 1
    fi
}

# Fonction restart simple
simple_restart() {
    echo "🔄 Redémarrage simple..."
    pm2 restart getyoursite
    echo "✅ Redémarrage effectué"
}

# Menu
echo ""
echo "Choisissez une action:"
echo "1) Restart simple (recommandé)"  
echo "2) Rebuild complet + restart (si problèmes)"
echo "3) Statut PM2"
echo "4) Logs PM2"
read -p "Votre choix (1-4): " choice

case $choice in
    1)
        simple_restart
        ;;
    2) 
        rebuild_and_restart
        ;;
    3)
        pm2 status
        ;;
    4)
        pm2 logs getyoursite --lines 20
        ;;
    *)
        echo "Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "🎉 Opération terminée!"