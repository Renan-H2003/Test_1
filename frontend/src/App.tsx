import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function AppContent() {
  const authContext = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);

  if (authContext?.isAuthenticated) {
    return <Dashboard />;
  }

  if (showLogin) {
    return <Login />;
  }

  return <HomePage onSignIn={() => setShowLogin(true)} />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;