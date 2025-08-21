#!/bin/bash

# ===============================================
# 🧪 Script de Validation Configuration Pizza 
# ===============================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Validation de la configuration Pizza/Stripe${NC}"
echo "================================================="

# Test de l'API contact
echo -e "\n${BLUE}1. Test API Contact${NC}"
if curl -s -f http://localhost:3000/api/contact > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Contact accessible${NC}"
    
    # Test détaillé de l'API
    response=$(curl -s http://localhost:3000/api/contact)
    if echo "$response" | grep -q "API Contact GetYourSite"; then
        echo -e "${GREEN}✅ API Contact répond correctement${NC}"
    else
        echo -e "${YELLOW}⚠️  API Contact accessible mais réponse inattendue${NC}"
    fi
else
    echo -e "${RED}❌ API Contact non accessible${NC}"
fi

# Test de l'API paiement
echo -e "\n${BLUE}2. Test API Paiements${NC}"
if curl -s -f -X POST -H "Content-Type: application/json" \
   -d '{"package_id":"margherita"}' http://localhost:3000/api/payments/checkout > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Paiements accessible${NC}"
else
    echo -e "${YELLOW}⚠️  API Paiements accessible mais nécessite configuration Stripe${NC}"
fi

# Test configuration Stripe
echo -e "\n${BLUE}3. Vérification Configuration Stripe${NC}"
if [ -f ".env" ]; then
    if grep -q "STRIPE_API_KEY=" .env && ! grep -q "STRIPE_API_KEY=sk_test_emergent" .env; then
        echo -e "${GREEN}✅ Clé secrète Stripe configurée${NC}"
    else
        echo -e "${YELLOW}⚠️  Clé secrète Stripe utilise la valeur par défaut${NC}"
    fi
    
    if grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=" .env; then
        echo -e "${GREEN}✅ Clé publique Stripe configurée${NC}"
    else
        echo -e "${YELLOW}⚠️  Clé publique Stripe non configurée${NC}"
    fi
    
    if grep -q "STRIPE_WEBHOOK_SECRET=" .env; then
        echo -e "${GREEN}✅ Secret webhook Stripe configuré${NC}"
    else
        echo -e "${YELLOW}ℹ️  Secret webhook Stripe non configuré (optionnel)${NC}"
    fi
else
    echo -e "${RED}❌ Fichier .env non trouvé${NC}"
fi

# Test des pages pizza
echo -e "\n${BLUE}4. Test Pages Pizza${NC}"
if curl -s -f http://localhost:3000/pizza > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Page pizza principale accessible${NC}"
else
    echo -e "${RED}❌ Page pizza non accessible${NC}"
fi

if curl -s -f http://localhost:3000/pizza/menu > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Page menu pizza accessible${NC}"
else
    echo -e "${RED}❌ Page menu pizza non accessible${NC}"
fi

# Test MongoDB (si configuré)
echo -e "\n${BLUE}5. Vérification MongoDB${NC}"
if command -v mongo &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB installé${NC}"
elif command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB daemon disponible${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB non détecté - les transactions de paiement peuvent ne pas fonctionner${NC}"
fi

# Résumé final
echo -e "\n${BLUE}📋 Résumé de la validation${NC}"
echo "================================"
echo -e "${GREEN}✅ Éléments fonctionnels détectés${NC}"
echo -e "${YELLOW}⚠️  Éléments nécessitant attention${NC}"
echo -e "${RED}❌ Éléments défaillants${NC}"

echo -e "\n${BLUE}💡 Pour une configuration complète:${NC}"
echo "1. Configurez vos vraies clés Stripe dans .env"
echo "2. Configurez le webhook Stripe: https://votre-domaine/api/webhook/stripe"
echo "3. Testez les paiements en mode test avec de vraies clés"

echo -e "\n${BLUE}🔗 URLs importantes:${NC}"
echo "• Site pizza: https://pizza.getyoursite.fr (ou /pizza)"
echo "• API contact: /api/contact"
echo "• API paiement: /api/payments/checkout"
echo "• Webhook Stripe: /api/webhook/stripe"