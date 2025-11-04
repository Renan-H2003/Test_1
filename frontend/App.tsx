import React, { useState, useMemo } from 'react';
import { AuthContext, User } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';

function App() {
  // In a real app, you'd check for a stored token here to initialize the user state
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = (email: string) => {
    setUser({ email });
    setIsLoggingIn(false); // Ensure we move to dashboard after login
  };
  const logout = () => {
    setUser(null);
    // Note: In a real app with a DB, you'd also clear the stored user profile from localStorage.
    // localStorage.removeItem('userProfile');
  };

  const authContextValue = useMemo(() => ({ user, login, logout }), [user]);

  const renderContent = () => {
    if (user) {
      return <Dashboard />;
    }
    if (isLoggingIn) {
      return <Login />;
    }
    return <HomePage onSignIn={() => setIsLoggingIn(true)} />;
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <ThemeProvider>
        <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
          {renderContent()}
        </div>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;