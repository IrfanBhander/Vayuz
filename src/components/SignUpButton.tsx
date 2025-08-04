import React, { useState, useEffect } from 'react';
import { UserPlus, X } from 'lucide-react';
import Authentication from './Authentication';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

const SignUpButton: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Handle authentication state persistence
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setShowAuthModal(false);
  };

  const handleAuthLogout = () => {
    setUser(null);
  };

  if (user) {
    return (
      <div className="fixed top-6 right-8 z-50 flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/50 dark:border-gray-600/50 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300">
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt="User profile" 
            className="w-8 h-8 rounded-full border-2 border-white/50 shadow-sm"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
        <Authentication 
          onAuthSuccess={handleAuthSuccess} 
          onAuthLogout={handleAuthLogout} 
        />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="fixed top-6 right-8 z-50 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Sign up"
        title="Sign Up"
      >
        <UserPlus 
          className="text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" 
          size={24} 
        />
      </button>

      {showAuthModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setShowAuthModal(false)}
            aria-hidden="true"
          />
          
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Sign Up
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <Authentication 
                onAuthSuccess={handleAuthSuccess} 
                onAuthLogout={handleAuthLogout} 
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUpButton;