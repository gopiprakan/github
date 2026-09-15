import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Owner authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('commitstreak-owner-token');
  });

  const [ownerToken, setOwnerToken] = useState(() => {
    return localStorage.getItem('commitstreak-owner-token') || null;
  });

  // Current monitored username (empty by default for new users, or restored from localStorage)
  const [monitoredUsername, setMonitoredUsername] = useState(() => {
    return localStorage.getItem('commitstreak-monitored-user') || '';
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
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'success' && user) {
      loginOwner('oauth-session-token', user);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loginOwner = (token, username) => {
    const cleanUser = (username || '').trim().replace(/^@/, '');
    setOwnerToken(token);
    setIsAuthenticated(true);
    setMonitoredUsername(cleanUser);
    localStorage.setItem('commitstreak-owner-token', token);
    localStorage.setItem('commitstreak-monitored-user', cleanUser);
    setIsAuthModalOpen(false);
  };

  const logoutOwner = () => {
    setOwnerToken(null);
    setIsAuthenticated(false);
    setMonitoredUsername('');
    localStorage.removeItem('commitstreak-owner-token');
    localStorage.removeItem('commitstreak-monitored-user');
  };

  const switchMonitoredUser = (newUsername) => {
    const cleanUser = (newUsername || '').trim().replace(/^@/, '');
    if (!cleanUser) return;
    setMonitoredUsername(cleanUser);
    localStorage.setItem('commitstreak-monitored-user', cleanUser);
  };

  const clearMonitoredUser = () => {
    setMonitoredUsername('');
    localStorage.removeItem('commitstreak-monitored-user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        ownerToken,
        monitoredUsername,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        setAuthError,
        isAuthenticating,
        setIsAuthenticating,
        loginOwner,
        logoutOwner,
        switchMonitoredUser,
        clearMonitoredUser,
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
