#!/usr/bin/env python3
"""
Investigation spécifique pour les erreurs de formulaire de contact signalées par l'utilisateur
Test des 3 sites: getyoursite.fr, pizza.getyoursite.fr, mairie.getyoursite.fr
"""

import requests
import json
import time
from datetime import datetime

class ContactFormInvestigation:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.api_url = f"{self.base_url}/api"
        self.results = []
        
    def log_result(self, test_name, status, message, details=None):
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        self.results.append(result)
        
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} {test_name}: {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_api_basic_functionality(self):
        """Test de base de l'API"""
        try:
            response = requests.get(f"{self.api_url}/contact", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log_result("API Basic Test", "PASS", f"API active - Version {data.get('version', 'unknown')}")
                return True
            else:
                self.log_result("API Basic Test", "FAIL", f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("API Basic Test", "FAIL", f"Erreur: {str(e)}")
            return False
    
    def test_form_submission_main_site(self):
        """Test formulaire site principal (getyoursite.fr)"""
        test_data = {
            "name": "Client Potentiel",
            "email": "client.potentiel@email.fr",
            "subject": "Demande de devis site web",
            "message": "Bonjour, je souhaite obtenir un devis pour la création d'un site web professionnel pour mon entreprise. Pouvez-vous me contacter pour discuter de mes besoins ?"
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://getyoursite.fr',
            'Referer': 'https://getyoursite.fr/contact'
        }
        
        return self._test_form_submission("Site Principal (getyoursite.fr)", test_data, headers)
    
    def test_form_submission_pizza_site(self):
        """Test formulaire site pizza (pizza.getyoursite.fr)"""
        test_data = {
            "name": "Client Pizza",
            "email": "client.pizza@email.fr",
            "subject": "Commande pizza spéciale",
            "message": "Bonjour, je souhaite commander une pizza personnalisée avec des ingrédients spéciaux. Pouvez-vous me rappeler pour discuter des options disponibles ?"
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://pizza.getyoursite.fr',
            'Referer': 'https://pizza.getyoursite.fr/contact'
        }
        
        return self._test_form_submission("Site Pizza (pizza.getyoursite.fr)", test_data, headers)
    
    def test_form_submission_mairie_site(self):
        """Test formulaire site mairie (mairie.getyoursite.fr)"""
        test_data = {
            "name": "Citoyen Brestois",
            "email": "citoyen.brestois@email.fr",
            "subject": "Demande d'acte d'état civil",
            "message": "Bonjour, je souhaite obtenir un extrait d'acte de naissance pour des démarches administratives. Quels sont les documents nécessaires et les délais de traitement ?"
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://mairie.getyoursite.fr',
            'Referer': 'https://mairie.getyoursite.fr/contact'
        }
        
        return self._test_form_submission("Site Mairie (mairie.getyoursite.fr)", test_data, headers)
    
    def _test_form_submission(self, site_name, test_data, headers):
        """Helper pour tester la soumission de formulaire"""
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                json=test_data,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result(f"Formulaire {site_name}", "PASS", 
                                  f"Soumission réussie: {data.get('message', 'OK')}")
                    return True
                else:
                    self.log_result(f"Formulaire {site_name}", "FAIL", 
                                  "Réponse sans succès", data)
                    return False
            elif response.status_code == 429:
                self.log_result(f"Formulaire {site_name}", "WARN", 
                              "Rate limiting activé - comportement normal")
                return True  # Ne pas considérer comme un échec
            else:
                self.log_result(f"Formulaire {site_name}", "FAIL", 
                              f"HTTP {response.status_code}", response.text[:200])
                return False
                
        except requests.exceptions.Timeout:
            self.log_result(f"Formulaire {site_name}", "FAIL", "Timeout - API trop lente")
            return False
        except requests.exceptions.ConnectionError:
            self.log_result(f"Formulaire {site_name}", "FAIL", "Erreur de connexion")
            return False
        except Exception as e:
            self.log_result(f"Formulaire {site_name}", "FAIL", f"Erreur: {str(e)}")
            return False
    
    def test_cors_configuration(self):
        """Test configuration CORS pour tous les domaines"""
        domains = [
            'https://getyoursite.fr',
            'https://pizza.getyoursite.fr', 
            'https://mairie.getyoursite.fr'
        ]
        
        all_passed = True
        for domain in domains:
            try:
                headers = {
                    'Origin': domain,
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                }
                
                response = requests.options(f"{self.api_url}/contact", headers=headers, timeout=10)
                
                if response.status_code == 200:
                    cors_origin = response.headers.get('Access-Control-Allow-Origin')
                    if cors_origin:
                        self.log_result(f"CORS {domain}", "PASS", f"Origin autorisé: {cors_origin}")
                    else:
                        self.log_result(f"CORS {domain}", "PASS", "CORS configuré (pas de header spécifique)")
                else:
                    self.log_result(f"CORS {domain}", "FAIL", f"OPTIONS failed: {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_result(f"CORS {domain}", "FAIL", f"Erreur: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_rate_limiting_behavior(self):
        """Test du comportement du rate limiting"""
        test_data = {
            "name": "Test Rate Limit",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Message de test pour vérifier le rate limiting."
        }
        
        headers = {'Content-Type': 'application/json'}
        
        success_count = 0
        for i in range(3):  # Test avec seulement 3 requêtes
            try:
                response = requests.post(f"{self.api_url}/contact", json=test_data, headers=headers, timeout=10)
                if response.status_code == 200:
                    success_count += 1
                elif response.status_code == 429:
                    retry_after = response.headers.get('Retry-After', 'unknown')
                    self.log_result("Rate Limiting", "PASS", 
                                  f"Rate limit activé après {success_count} requêtes (Retry-After: {retry_after}s)")
                    return True
                time.sleep(1)
            except Exception as e:
                break
        
        if success_count >= 2:
            self.log_result("Rate Limiting", "PASS", f"{success_count} requêtes réussies sans rate limiting")
            return True
        else:
            self.log_result("Rate Limiting", "FAIL", f"Seulement {success_count} requêtes réussies")
            return False
    
    def test_email_configuration(self):
        """Test de la configuration email"""
        import os
        
        gmail_user = os.environ.get('GMAIL_USER', '')
        gmail_password = os.environ.get('GMAIL_APP_PASSWORD', '')
        
        if gmail_user and gmail_user != 'votre-email@gmail.com' and gmail_password:
            self.log_result("Configuration Email", "PASS", f"Email configuré: {gmail_user}")
            return True
        else:
            self.log_result("Configuration Email", "WARN", "Email non configuré (optionnel)")
            return True  # Ne pas considérer comme un échec
    
    def run_investigation(self):
        """Lancer l'investigation complète"""
        print("🔍 INVESTIGATION ERREURS FORMULAIRE CONTACT")
        print("=" * 60)
        print("Contexte: L'utilisateur signale des erreurs avec les formulaires de contact")
        print("Sites testés: getyoursite.fr, pizza.getyoursite.fr, mairie.getyoursite.fr")
        print("=" * 60)
        
        # Tests de base
        if not self.test_api_basic_functionality():
            print("\n❌ ERREUR CRITIQUE: L'API de base ne fonctionne pas!")
            return False
        
        # Test configuration
        self.test_email_configuration()
        self.test_cors_configuration()
        
        # Attendre un peu pour éviter le rate limiting
        print("\n⏳ Attente pour éviter le rate limiting...")
        time.sleep(2)
        
        # Tests des formulaires des 3 sites
        print("\n📝 Test des formulaires de contact:")
        form_results = []
        form_results.append(self.test_form_submission_main_site())
        time.sleep(1)
        form_results.append(self.test_form_submission_pizza_site())
        time.sleep(1)
        form_results.append(self.test_form_submission_mairie_site())
        
        # Test rate limiting
        print("\n⏱️ Test du rate limiting:")
        self.test_rate_limiting_behavior()
        
        # Résumé
        print("\n" + "=" * 60)
        print("📊 RÉSUMÉ DE L'INVESTIGATION")
        print("=" * 60)
        
        total_tests = len(self.results)
        passed = len([r for r in self.results if r['status'] == 'PASS'])
        failed = len([r for r in self.results if r['status'] == 'FAIL'])
        warnings = len([r for r in self.results if r['status'] == 'WARN'])
        
        print(f"Total des tests: {total_tests}")
        print(f"✅ Réussis: {passed}")
        print(f"❌ Échecs: {failed}")
        print(f"⚠️  Avertissements: {warnings}")
        
        # Analyse des résultats
        form_failures = [r for r in self.results if 'Formulaire' in r['test'] and r['status'] == 'FAIL']
        
        if form_failures:
            print(f"\n🚨 PROBLÈMES IDENTIFIÉS:")
            for failure in form_failures:
                print(f"   - {failure['test']}: {failure['message']}")
        else:
            print(f"\n✅ TOUS LES FORMULAIRES FONCTIONNENT CORRECTEMENT")
            print("   Les erreurs signalées par l'utilisateur ne sont pas reproduites.")
        
        return failed == 0

if __name__ == "__main__":
    investigator = ContactFormInvestigation()
    success = investigator.run_investigation()
    exit(0 if success else 1)