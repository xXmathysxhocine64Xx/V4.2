#!/usr/bin/env python3
"""
Test complet des formulaires de contact pour diagnostiquer les erreurs signalées par l'utilisateur
Simulation de scénarios réels d'utilisation des 3 sites
"""

import requests
import json
import time
import os
from datetime import datetime

class ComprehensiveContactTest:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.api_url = f"{self.base_url}/api"
        self.results = []
        self.critical_issues = []
        
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
        if details and status == "FAIL":
            print(f"   🔍 Details: {details}")
            
        if status == "FAIL":
            self.critical_issues.append({
                "test": test_name,
                "message": message,
                "details": details
            })
    
    def test_api_health(self):
        """Test de santé de l'API"""
        try:
            response = requests.get(f"{self.api_url}/contact", timeout=10)
            if response.status_code == 200:
                data = response.json()
                version = data.get('version', 'unknown')
                self.log_result("API Health Check", "PASS", f"API active (v{version})")
                return True
            else:
                self.log_result("API Health Check", "FAIL", f"HTTP {response.status_code}", response.text[:200])
                return False
        except Exception as e:
            self.log_result("API Health Check", "FAIL", f"Connexion échouée: {str(e)}")
            return False
    
    def test_environment_config(self):
        """Test de la configuration d'environnement"""
        try:
            # Vérifier les variables d'environnement critiques
            with open('/app/.env', 'r') as f:
                env_content = f.read()
            
            issues = []
            if 'TRUSTED_ORIGINS=' not in env_content:
                issues.append("TRUSTED_ORIGINS manquant")
            elif 'getyoursite.fr' not in env_content:
                issues.append("getyoursite.fr manquant dans TRUSTED_ORIGINS")
            elif 'pizza.getyoursite.fr' not in env_content:
                issues.append("pizza.getyoursite.fr manquant dans TRUSTED_ORIGINS")
            elif 'mairie.getyoursite.fr' not in env_content:
                issues.append("mairie.getyoursite.fr manquant dans TRUSTED_ORIGINS")
            
            if 'RATE_LIMIT_MAX=' not in env_content:
                issues.append("RATE_LIMIT_MAX manquant")
            
            if issues:
                self.log_result("Environment Config", "FAIL", f"Problèmes: {', '.join(issues)}")
                return False
            else:
                self.log_result("Environment Config", "PASS", "Configuration correcte")
                return True
                
        except Exception as e:
            self.log_result("Environment Config", "FAIL", f"Erreur lecture config: {str(e)}")
            return False
    
    def test_realistic_form_submission(self, site_name, form_data, headers, expected_success=True):
        """Test de soumission de formulaire réaliste"""
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                json=form_data,
                headers=headers,
                timeout=15
            )
            
            # Analyser la réponse
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result(f"Form {site_name}", "PASS", 
                                  f"Soumission réussie: {data.get('message', 'OK')}")
                    return True
                else:
                    self.log_result(f"Form {site_name}", "FAIL", 
                                  "Réponse sans succès", data)
                    return False
            elif response.status_code == 429:
                # Rate limiting - analyser les headers
                retry_after = response.headers.get('Retry-After', 'unknown')
                remaining = response.headers.get('X-RateLimit-Remaining', 'unknown')
                
                self.log_result(f"Form {site_name}", "WARN", 
                              f"Rate limiting (Retry-After: {retry_after}s, Remaining: {remaining})")
                return not expected_success  # Si on s'attend à un succès, c'est un problème
            elif response.status_code == 400:
                data = response.json()
                error_msg = data.get('error', 'Erreur inconnue')
                self.log_result(f"Form {site_name}", "FAIL", 
                              f"Validation échouée: {error_msg}")
                return False
            elif response.status_code == 403:
                self.log_result(f"Form {site_name}", "FAIL", 
                              "Accès refusé - Problème CORS ou origine", response.text[:200])
                return False
            else:
                self.log_result(f"Form {site_name}", "FAIL", 
                              f"HTTP {response.status_code}", response.text[:200])
                return False
                
        except requests.exceptions.Timeout:
            self.log_result(f"Form {site_name}", "FAIL", "Timeout - API trop lente")
            return False
        except requests.exceptions.ConnectionError:
            self.log_result(f"Form {site_name}", "FAIL", "Erreur de connexion")
            return False
        except Exception as e:
            self.log_result(f"Form {site_name}", "FAIL", f"Erreur: {str(e)}")
            return False
    
    def test_main_site_form(self):
        """Test du formulaire du site principal"""
        form_data = {
            "name": "Jean Entrepreneur",
            "email": "jean.entrepreneur@entreprise.fr",
            "subject": "Demande de devis site e-commerce",
            "message": "Bonjour, je dirige une PME de 15 salariés et nous souhaitons créer un site e-commerce pour vendre nos produits artisanaux. Nous avons un budget de 5000€ et aimerions une solution clé en main avec paiement en ligne. Pouvez-vous nous proposer un devis détaillé ? Merci."
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://getyoursite.fr',
            'Referer': 'https://getyoursite.fr/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        return self.test_realistic_form_submission("Site Principal", form_data, headers)
    
    def test_pizza_site_form(self):
        """Test du formulaire du site pizza"""
        form_data = {
            "name": "Marie Gourmande",
            "email": "marie.gourmande@email.fr",
            "subject": "Contact Lucky Pizza Lannilis",
            "message": "Téléphone: 06 12 34 56 78\n\nBonjour, je souhaite organiser une soirée pizza pour 20 personnes samedi prochain. Proposez-vous un service traiteur ? Quels sont vos tarifs pour les commandes groupées ? Merci de me contacter rapidement."
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://pizza.getyoursite.fr',
            'Referer': 'https://pizza.getyoursite.fr/contact',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        }
        
        return self.test_realistic_form_submission("Site Pizza", form_data, headers)
    
    def test_mairie_site_form(self):
        """Test du formulaire du site mairie"""
        form_data = {
            "name": "Pierre Citoyen",
            "email": "pierre.citoyen@email.fr",
            "subject": "Mairie de Brest - etat-civil",
            "message": "Téléphone: 02 98 12 34 56\nType de demande: etat-civil\n\nBonjour, je souhaite obtenir un extrait d'acte de naissance plurilingue pour mon fils né en 2018 à Brest. Cette demande est urgente car nous partons en voyage à l'étranger dans 15 jours. Quels sont les délais et les documents nécessaires ? Cordialement."
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://mairie.getyoursite.fr',
            'Referer': 'https://mairie.getyoursite.fr/contact',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        return self.test_realistic_form_submission("Site Mairie", form_data, headers)
    
    def test_edge_cases(self):
        """Test des cas limites"""
        edge_cases = [
            {
                "name": "Données vides",
                "data": {"name": "", "email": "", "message": ""},
                "expected_status": 400,
                "should_fail": True
            },
            {
                "name": "Email invalide",
                "data": {"name": "Test", "email": "email-invalide", "message": "Test message"},
                "expected_status": 400,
                "should_fail": True
            },
            {
                "name": "Message trop long",
                "data": {"name": "Test", "email": "test@example.com", "message": "x" * 2500},
                "expected_status": 400,
                "should_fail": True
            },
            {
                "name": "Origine non autorisée",
                "data": {"name": "Hacker", "email": "hack@malicious.com", "message": "Test"},
                "headers": {"Origin": "https://malicious-site.com"},
                "expected_status": 403,
                "should_fail": True
            }
        ]
        
        all_passed = True
        for case in edge_cases:
            headers = case.get("headers", {"Content-Type": "application/json"})
            headers["Content-Type"] = "application/json"
            
            try:
                response = requests.post(f"{self.api_url}/contact", json=case["data"], headers=headers, timeout=10)
                
                if case["should_fail"]:
                    if response.status_code == case["expected_status"]:
                        self.log_result(f"Edge Case: {case['name']}", "PASS", f"Correctement rejeté ({response.status_code})")
                    else:
                        self.log_result(f"Edge Case: {case['name']}", "FAIL", f"Attendu {case['expected_status']}, reçu {response.status_code}")
                        all_passed = False
                else:
                    if response.status_code == 200:
                        self.log_result(f"Edge Case: {case['name']}", "PASS", "Accepté correctement")
                    else:
                        self.log_result(f"Edge Case: {case['name']}", "FAIL", f"Rejeté incorrectement ({response.status_code})")
                        all_passed = False
                        
            except Exception as e:
                self.log_result(f"Edge Case: {case['name']}", "FAIL", f"Erreur: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_rate_limiting_analysis(self):
        """Analyse détaillée du rate limiting"""
        test_data = {
            "name": "Test Rate Limit",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Message de test pour analyser le rate limiting."
        }
        
        headers = {"Content-Type": "application/json"}
        
        # Faire plusieurs requêtes pour analyser le comportement
        requests_made = 0
        rate_limited_at = None
        
        for i in range(5):  # Limité à 5 pour éviter de bloquer trop longtemps
            try:
                response = requests.post(f"{self.api_url}/contact", json=test_data, headers=headers, timeout=10)
                requests_made += 1
                
                if response.status_code == 429:
                    rate_limited_at = requests_made
                    retry_after = response.headers.get('Retry-After', 'unknown')
                    remaining = response.headers.get('X-RateLimit-Remaining', 'unknown')
                    limit = response.headers.get('X-RateLimit-Limit', 'unknown')
                    
                    self.log_result("Rate Limiting Analysis", "PASS", 
                                  f"Rate limit activé après {requests_made} requêtes (Limit: {limit}, Remaining: {remaining}, Retry-After: {retry_after}s)")
                    break
                elif response.status_code != 200:
                    self.log_result("Rate Limiting Analysis", "WARN", 
                                  f"Erreur inattendue à la requête {requests_made}: {response.status_code}")
                    break
                    
                time.sleep(0.5)  # Petite pause entre les requêtes
                
            except Exception as e:
                self.log_result("Rate Limiting Analysis", "FAIL", f"Erreur à la requête {requests_made}: {str(e)}")
                break
        
        if rate_limited_at is None and requests_made >= 3:
            self.log_result("Rate Limiting Analysis", "WARN", 
                          f"Aucun rate limiting détecté après {requests_made} requêtes")
        
        return True
    
    def run_comprehensive_test(self):
        """Lancer le test complet"""
        print("🔍 TEST COMPLET DES FORMULAIRES DE CONTACT")
        print("=" * 70)
        print("Objectif: Diagnostiquer les erreurs signalées par l'utilisateur")
        print("Sites testés: getyoursite.fr, pizza.getyoursite.fr, mairie.getyoursite.fr")
        print("=" * 70)
        
        # Tests préliminaires
        print("\n🏥 Tests de santé du système:")
        api_healthy = self.test_api_health()
        config_ok = self.test_environment_config()
        
        if not api_healthy:
            print("\n❌ ERREUR CRITIQUE: L'API ne répond pas correctement!")
            return False
        
        # Attendre un peu pour éviter le rate limiting des tests précédents
        print("\n⏳ Attente pour éviter le rate limiting...")
        time.sleep(3)
        
        # Tests des formulaires réalistes
        print("\n📝 Tests des formulaires avec données réalistes:")
        form_results = []
        
        form_results.append(self.test_main_site_form())
        time.sleep(2)
        
        form_results.append(self.test_pizza_site_form())
        time.sleep(2)
        
        form_results.append(self.test_mairie_site_form())
        time.sleep(2)
        
        # Tests des cas limites
        print("\n🧪 Tests des cas limites:")
        edge_cases_ok = self.test_edge_cases()
        
        # Analyse du rate limiting
        print("\n⏱️ Analyse du rate limiting:")
        self.test_rate_limiting_analysis()
        
        # Résumé et diagnostic
        print("\n" + "=" * 70)
        print("📊 RÉSUMÉ DU DIAGNOSTIC")
        print("=" * 70)
        
        total_tests = len(self.results)
        passed = len([r for r in self.results if r['status'] == 'PASS'])
        failed = len([r for r in self.results if r['status'] == 'FAIL'])
        warnings = len([r for r in self.results if r['status'] == 'WARN'])
        
        print(f"Total des tests: {total_tests}")
        print(f"✅ Réussis: {passed}")
        print(f"❌ Échecs: {failed}")
        print(f"⚠️  Avertissements: {warnings}")
        
        # Analyse des problèmes critiques
        if self.critical_issues:
            print(f"\n🚨 PROBLÈMES CRITIQUES IDENTIFIÉS ({len(self.critical_issues)}):")
            for issue in self.critical_issues:
                print(f"   • {issue['test']}: {issue['message']}")
                if issue['details']:
                    print(f"     └─ {issue['details']}")
        else:
            print(f"\n✅ AUCUN PROBLÈME CRITIQUE DÉTECTÉ")
            print("   Les formulaires de contact fonctionnent correctement.")
        
        # Recommandations
        print(f"\n💡 RECOMMANDATIONS:")
        if failed == 0:
            print("   • Les formulaires fonctionnent correctement")
            print("   • Le problème signalé par l'utilisateur pourrait être:")
            print("     - Un problème temporaire résolu")
            print("     - Un problème spécifique à l'environnement de production")
            print("     - Un problème de configuration email (optionnel)")
            print("     - Un problème de rate limiting trop strict")
        else:
            print("   • Corriger les problèmes critiques identifiés")
            print("   • Vérifier la configuration CORS et les domaines autorisés")
            print("   • Tester la configuration email si nécessaire")
        
        # Vérifier si le rate limiting est trop strict
        rate_limit_warnings = [r for r in self.results if 'Rate limiting' in r['message'] or 'rate limit' in r['message'].lower()]
        if len(rate_limit_warnings) > 2:
            print("   • ⚠️  Le rate limiting semble très strict (10 req/15min)")
            print("     Considérer augmenter la limite pour une meilleure UX")
        
        return failed == 0

if __name__ == "__main__":
    tester = ComprehensiveContactTest()
    success = tester.run_comprehensive_test()
    exit(0 if success else 1)