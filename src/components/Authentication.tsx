import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA0r-Oo98UAi2T47qd4gByLJGKqXLXgjxY",
    authDomain: "login-system-bd7d8.firebaseapp.com",
    projectId: "login-system-bd7d8",
    storageBucket: "login-system-bd7d8.firebasestorage.app",
    messagingSenderId: "55647466462",
    appId: "1:55647466462:web:fbb63b90cce33df2e2e34f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface AuthenticationProps {
  onAuthSuccess: (user: User) => void;
  onAuthLogout: () => void;
}

const Authentication = ({ onAuthSuccess, onAuthLogout }: AuthenticationProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Check auth state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        onAuthSuccess(currentUser);
      } else {
        setUser(null);
        onAuthLogout();
      }
    });

    return () => unsubscribe();
  }, [onAuthSuccess, onAuthLogout]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      onAuthSuccess(result.user);
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      onAuthLogout();
    } catch (err) {
      setError('Failed to sign out');
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt="User profile" 
            className="w-10 h-10 rounded-full"
          />
        )}
        <span className="font-medium">{user.displayName || 'User'}</span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-center gap-3 mx-auto hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.64 12 18.64C9.14 18.64 6.71 16.69 5.84 14.09H2.18V16.96C4 20.53 7.7 23 12 23Z" fill="#34A853"/>
          <path d="M5.84 14.09C5.62 13.43 5.5 12.73 5.5 12C5.5 11.27 5.62 10.57 5.84 9.91V7.04H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.96L5.84 14.09Z" fill="#FBBC05"/>
          <path d="M12 5.36C13.62 5.36 15.06 5.93 16.21 7.04L19.36 3.91C17.45 2.09 14.97 1 12 1C7.7 1 4 3.47 2.18 7.04L5.84 9.91C6.71 7.31 9.14 5.36 12 5.36Z" fill="#EA4335"/>
        </svg>
        <span className="font-medium text-gray-700">
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </span>
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Authentication;
export { auth };