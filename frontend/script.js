// Configuration de l'application
const CONFIG = {
    BACKEND_URL: 'http://localhost:5000',
    DEFAULT_USERNAME: 'admin',
    DEFAULT_PASSWORD: 'admin'
};

// Éléments DOM
const elements = {
    loginContainer: document.getElementById('loginContainer'),
    dashboard: document.getElementById('dashboard'),
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    messageDiv: document.getElementById('message'),
    userSpan: document.getElementById('user'),
    loginButton: null,
    logoutButton: null
};

// Initialisation de l'application
function initApp() {
    console.log('🚀 Application initialisée');
    
    // Initialiser les boutons
    elements.loginButton = document.querySelector('#loginContainer button');
    elements.logoutButton = document.querySelector('.logout-btn');
    
    // Configurer les écouteurs d'événements
    setupEventListeners();
    
    // Vérifier la connexion au backend
    checkBackendHealth();
    
    // Tester les identifiants par défaut
    setDefaultCredentials();
    
    // Permettre la connexion avec la touche Entrée
    setupEnterKeyLogin();
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Connexion
    if (elements.loginButton) {
        elements.loginButton.addEventListener('click', handleLogin);
    }
    
    // Déconnexion
    if (elements.logoutButton) {
        elements.logoutButton.addEventListener('click', handleLogout);
    }
}

// Configurer la connexion avec la touche Entrée
function setupEnterKeyLogin() {
    elements.passwordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
    
    elements.usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            elements.passwordInput.focus();
        }
    });
}

// Définir les identifiants par défaut
function setDefaultCredentials() {
    elements.usernameInput.value = CONFIG.DEFAULT_USERNAME;
    elements.passwordInput.value = CONFIG.DEFAULT_PASSWORD;
}

// Afficher un message à l'utilisateur
function showMessage(text, isSuccess = true) {
    elements.messageDiv.textContent = text;
    elements.messageDiv.className = isSuccess ? 'success' : 'error';
    
    // Masquer automatiquement après 5 secondes
    if (text) {
        setTimeout(() => {
            clearMessage();
        }, 5000);
    }
}

// Effacer le message
function clearMessage() {
    elements.messageDiv.textContent = '';
    elements.messageDiv.className = '';
}

// Gérer la connexion
async function handleLogin() {
    const username = elements.usernameInput.value.trim();
    const password = elements.passwordInput.value.trim();
    
    // Validation
    if (!username || !password) {
        showMessage('Veuillez remplir tous les champs', false);
        return;
    }
    
    // Afficher l'état de chargement
    showMessage('Connexion en cours...', true);
    setLoadingState(true);
    
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            // Connexion réussie
            showMessage('Connexion réussie ! Redirection...', true);
            
            // Mettre à jour l'interface
            elements.userSpan.textContent = data.username || username;
            
            // Basculer vers le dashboard après un délai
            setTimeout(() => {
                switchToDashboard();
            }, 1000);
            
        } else {
            // Échec de la connexion
            showMessage(data.message || 'Identifiants incorrects', false);
        }
        
    } catch (error) {
        // Erreur réseau ou serveur
        console.error('❌ Erreur de connexion:', error);
        showMessage(`Erreur: ${error.message}. Vérifiez que le backend est démarré.`, false);
        
    } finally {
        // Désactiver l'état de chargement
        setLoadingState(false);
    }
}

// Gérer la déconnexion
function handleLogout() {
    // Réinitialiser les champs
    setDefaultCredentials();
    
    // Basculer vers l'écran de connexion
    switchToLogin();
    
    // Afficher un message de confirmation
    showMessage('Déconnexion réussie. À bientôt !', true);
}

// Basculer vers le dashboard
function switchToDashboard() {
    elements.loginContainer.classList.add('hidden');
    elements.dashboard.classList.remove('hidden');
    clearMessage();
}

// Basculer vers l'écran de connexion
function switchToLogin() {
    elements.dashboard.classList.add('hidden');
    elements.loginContainer.classList.remove('hidden');
}

// Définir l'état de chargement
function setLoadingState(isLoading) {
    if (elements.loginButton) {
        if (isLoading) {
            elements.loginButton.classList.add('loading');
            elements.loginButton.disabled = true;
            elements.loginButton.textContent = 'Connexion...';
        } else {
            elements.loginButton.classList.remove('loading');
            elements.loginButton.disabled = false;
            elements.loginButton.textContent = 'Se connecter';
        }
    }
}

// Vérifier la santé du backend
async function checkBackendHealth() {
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/api/health`);
        if (response.ok) {
            console.log('✅ Backend connecté et en bonne santé');
            showMessage('Serveur backend disponible ✓', true);
        } else {
            console.warn('⚠️ Backend retourne une erreur:', response.status);
            showMessage('Backend non disponible', false);
        }
    } catch (error) {
        console.error('❌ Impossible de joindre le backend:', error);
        showMessage('Impossible de se connecter au serveur', false);
    }
}

// Fonctions exposées globalement (pour compatibilité avec onclick)
window.login = handleLogin;
window.logout = handleLogout;

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initApp);

// Exporter pour les tests (optionnel)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        handleLogin,
        handleLogout,
        showMessage
    };
}