#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "L'utilisateur avait des problèmes avec son site GetYourSite qui affichait des erreurs 404 quand il redémarrait le VPN. Il demandait de simplifier totalement le code pour qu'il soit le moins compliqué possible et très stable, et adapter le script de déploiement aux modifications."

backend:
  - task: "API Contact Simplifiée"
    implemented: true
    working: true
    file: "/app/app/api/contact/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Simplifié l'API de contact en gardant seulement les fonctionnalités essentielles. Supprimé la validation complexe et la sécurité avancée. API basique avec log des messages et envoi email optionnel via Gmail."
        - working: true
          agent: "testing"
          comment: "✅ TESTS COMPLETS RÉUSSIS - API Contact fonctionne parfaitement: GET /api/contact retourne statut 'active', POST avec données valides fonctionne (message reçu avec succès), validation des champs requis (nom, email, message) opérationnelle, validation format email fonctionnelle, messages bien loggés dans console. API stable avec 5 requêtes successives réussies. Aucune erreur critique détectée."

  - task: "Déploiement PM2 Simplifié"
    implemented: true
    working: true
    file: "/app/deploy-simple.sh"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Créé un script de déploiement simplifié qui utilise PM2. Configuration minimale dans ecosystem.config.js. Application déployée avec succès sur localhost:3000."
        - working: true
          agent: "testing"
          comment: "✅ DÉPLOIEMENT PM2 PARFAITEMENT STABLE - Application 'getyoursite' online dans PM2, redémarrage PM2 testé avec succès (application revient online immédiatement), aucune erreur critique dans les logs PM2, stabilité confirmée sur plusieurs requêtes. Configuration PM2 optimale avec ecosystem.config.js."

frontend:
  - task: "Site Vitrine Simplifié"
    implemented: true
    working: true
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Simplifié totalement le code frontend. Intégré tous les composants UI directement dans page.js. Supprimé toutes les dépendances UI complexes. Site fonctionnel avec sections Hero, Services, Portfolio et Contact."

  - task: "Configuration Simplifiée"
    implemented: true
    working: true
    file: "/app/next.config.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Simplifié la configuration Next.js. Gardé seulement les options essentielles. CSS simplifié. Package.json allégé avec moins de dépendances."

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "API Contact Simplifiée"
    - "Site Vitrine Simplifié"  
    - "Déploiement PM2 Simplifié"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: "Simplification complète du site GetYourSite terminée. Supprimé tous les scripts de debug, maintenance et fichiers complexes. Code ultra-simplifié et stable. Application déployée avec PM2 et fonctionne sur localhost:3000. Prêt pour tests complets backend et frontend pour vérifier la stabilité."