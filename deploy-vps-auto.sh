#!/bin/bash

# Version automatique du script de déploiement (sans questions interactives)
# Usage: ./deploy-vps-auto.sh [pizza] [mairie]
# Exemples:
# ./deploy-vps-auto.sh                    # Site principal seulement
# ./deploy-vps-auto.sh pizza              # Site principal + pizza
# ./deploy-vps-auto.sh pizza mairie       # Site principal + pizza + mairie
# ./deploy-vps-auto.sh mairie             # Site principal + mairie

# Configuration automatique basée sur les paramètres
DEPLOY_PIZZA="false"
DEPLOY_MAIRIE="false"
AUTO_SSL="true"  # SSL automatique activé par défaut

# Analyse des paramètres
for arg in "$@"; do
    case $arg in
        pizza)
            DEPLOY_PIZZA="true"
            ;;
        mairie)
            DEPLOY_MAIRIE="true"
            ;;
        no-ssl)
            AUTO_SSL="false"
            ;;
    esac
done

# Export des variables pour le script principal
export DEPLOY_PIZZA
export DEPLOY_MAIRIE
export REPLY="o"  # Auto-accepter SSL si AUTO_SSL=true

echo "🤖 Mode automatique activé"
echo "   - Site principal: ✅ toujours déployé"
echo "   - Pizza demo: $([ "$DEPLOY_PIZZA" = "true" ] && echo "✅ activé" || echo "❌ désactivé")"
echo "   - Mairie demo: $([ "$DEPLOY_MAIRIE" = "true" ] && echo "✅ activé" || echo "❌ désactivé")"
echo "   - SSL automatique: $([ "$AUTO_SSL" = "true" ] && echo "✅ activé" || echo "❌ désactivé")"
echo ""

# Simuler les réponses pour le script principal
if [ "$AUTO_SSL" = "true" ]; then
    # Avec SSL
    echo -e "$([ "$DEPLOY_PIZZA" = "true" ] && echo "o" || echo "n")\n$([ "$DEPLOY_MAIRIE" = "true" ] && echo "o" || echo "n")\no" | bash deploy-vps-fixed.sh
else
    # Sans SSL
    echo -e "$([ "$DEPLOY_PIZZA" = "true" ] && echo "o" || echo "n")\n$([ "$DEPLOY_MAIRIE" = "true" ] && echo "o" || echo "n")\nn" | bash deploy-vps-fixed.sh
fi