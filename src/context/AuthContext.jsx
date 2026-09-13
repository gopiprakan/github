import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_PROFILE } from '../services/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Owner authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('commitstreak-owner-token');
  });

  const [ownerToken, setOwnerToken] = useState(() => {
    return localStorage.getItem('commitstreak-owner-token') || null;
  });

  // Current monitored username (defaults to sample username, or connected owner)
  const [monitoredUsername, setMonitoredUsername] = useState(() => {
    return localStorage.getItem('commitstreak-monitored-user') || SAMPLE_PROFILE.username;
  });

  // Is using live API or sample data mode
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('commitstreak-demo-mode');
    return saved !== null ? saved === 'true' : true; // default true until user changes or connects
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check URL query parameters for OAuth callback code / token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('username');
    const authStatus = urlParams.get('auth');

    if (token && user) {
      loginOwner(token, user);
      // Clean query params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'success' && user) {
      loginOwner('demo-oauth-session-token', user);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loginOwner = (token, username) => {
    setOwnerToken(token);
    setIsAuthenticated(true);
    setMonitoredUsername(username);
    setIsDemoMode(false);
    localStorage.setItem('commitstreak-owner-token', token);
    localStorage.setItem('commitstreak-monitored-user', username);
    localStorage.setItem('commitstreak-demo-mode', 'false');
    setIsAuthModalOpen(false);
  };

  const logoutOwner = () => {
    setOwnerToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('commitstreak-owner-token');
    // keep or reset username
    setMonitoredUsername(SAMPLE_PROFILE.username);
    setIsDemoMode(true);
    localStorage.setItem('commitstreak-demo-mode', 'true');
    localStorage.setItem('commitstreak-monitored-user', SAMPLE_PROFILE.username);
  };

  const switchMonitoredUser = (newUsername, isLive = true) => {
    const cleanUser = newUsername.trim().replace(/^@/, '');
    if (!cleanUser) return;
    setMonitoredUsername(cleanUser);
    setIsDemoMode(!isLive);
    localStorage.setItem('commitstreak-monitored-user', cleanUser);
    localStorage.setItem('commitstreak-demo-mode', String(!isLive));
  };

  const resetToSampleData = () => {
    setMonitoredUsername(SAMPLE_PROFILE.username);
    setIsDemoMode(true);
    localStorage.setItem('commitstreak-monitored-user', SAMPLE_PROFILE.username);
    localStorage.setItem('commitstreak-demo-mode', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        ownerToken,
        monitoredUsername,
        isDemoMode,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        setAuthError,
        isAuthenticating,
        setIsAuthenticating,
        loginOwner,
        logoutOwner,
        switchMonitoredUser,
        resetToSampleData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
