import React, { useState, useContext } from 'react';
import AuthProvider, { AuthContext } from './context/AuthContext';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import PreviewPage from './components/PreviewPage';

function AppContent() {
  const [page, setPage] = useState('home');
  const { user } = useContext(AuthContext);

  if (page === 'home') return <HomePage onNavigate={setPage} />;
  if (page === 'about') return <AboutPage onNavigate={setPage} />;
  if (page === 'login') return <AuthPage onNavigate={setPage} />;
  if (page === 'dashboard' && user) return <Dashboard onNavigate={setPage} />;
  if (page === 'preview' && user) return <PreviewPage onNavigate={setPage} />;
  return <HomePage onNavigate={setPage} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;