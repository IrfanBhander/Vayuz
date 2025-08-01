import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-5N2nw_te49UxEbc3Stgq1oDqgRd6yVQ",
    authDomain: "authentication-d4c85.firebaseapp.com",
    projectId: "authentication-d4c85",
    storageBucket: "authentication-d4c85.firebasestorage.app",
    messagingSenderId: "637596092579",
    appId: "1:637596092579:web:f4cd9b45e63e3225b15716"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const googleSignInBtn = document.getElementById('google-signin-btn');
const authStatus = document.getElementById('auth-status');
const loadingOverlay = document.getElementById('loading-overlay');
const authContainer = document.getElementById('auth-container');
const notesApp = document.getElementById('notes-app');

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showStatus(message, isError = false) {
    authStatus.textContent = message;
    authStatus.className = `status-message ${isError ? 'error' : 'success'}`;
    setTimeout(() => {
        authStatus.textContent = '';
        authStatus.className = 'status-message';
    }, 3000);
}

async function signInWithGoogle() {
    showLoading();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        showStatus(`Welcome, ${user.displayName}!`);
        showAppInterface(user);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        showStatus(`Login failed: ${error.message}`, true);
    } finally {
        hideLoading();
    }
}

function showAppInterface(user) {
    authContainer.style.display = 'none';
    notesApp.style.display = 'block';
    
    // Initialize your notes app here
    console.log("User signed in:", user);
    // loadNotes();
    // setupNoteEditor();
}

function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            showAppInterface(user);
        } else {
            authContainer.style.display = 'flex';
            notesApp.style.display = 'none';
        }
    });
}

// Event Listeners
googleSignInBtn.addEventListener('click', signInWithGoogle);

// Initialize auth state check
checkAuthState();

export { auth };