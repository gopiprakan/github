import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Helper to sanitize token
  const sanitizeToken = (token) => {
    if (!token || typeof token !== 'string') return null;
    const trimmed = token.trim();
    if (trimmed === 'local-session-token' || trimmed === 'oauth-session-token' || trimmed === 'null' || trimmed === 'undefined') {
      return null;
    }
    return trimmed;
  };

  // Owner authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      localStorage.getItem('commitstreak-is-auth') === 'true' ||
      !!localStorage.getItem('commitstreak-owner-token') ||
      !!(import.meta.env?.VITE_GITHUB_PAT || import.meta.env?.VITE_GITHUB_TOKEN)
    );
  });

  const [ownerToken, setOwnerToken] = useState(() => {
    const raw =
      import.meta.env?.VITE_GITHUB_PAT ||
      import.meta.env?.VITE_GITHUB_TOKEN ||
      localStorage.getItem('commitstreak-owner-token');
    const clean = sanitizeToken(raw);
    if (clean) {
      localStorage.setItem('commitstreak-owner-token', clean);
      localStorage.setItem('commitstreak-is-auth', 'true');
    }
    return clean;
  });

  // Current monitored username (restored from localStorage, or default env username, or gopiprakan)
  const [monitoredUsername, setMonitoredUsername] = useState(() => {
    return (
      localStorage.getItem('commitstreak-monitored-user') ||
      import.meta.env?.VITE_DEFAULT_GITHUB_USERNAME ||
      'gopiprakan'
    );
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
      loginOwner(null, user);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loginOwner = (token, username) => {
    const cleanUser = (username || '').trim().replace(/^@/, '');
    const validToken = sanitizeToken(token);
    
    setOwnerToken(validToken);
    setIsAuthenticated(true);
    localStorage.setItem('commitstreak-is-auth', 'true');

    if (validToken) {
      localStorage.setItem('commitstreak-owner-token', validToken);
    } else {
      localStorage.removeItem('commitstreak-owner-token');
    }

    if (cleanUser) {
      setMonitoredUsername(cleanUser);
      localStorage.setItem('commitstreak-monitored-user', cleanUser);
    }
    setIsAuthModalOpen(false);
  };

  const logoutOwner = () => {
    setOwnerToken(null);
    setIsAuthenticated(false);
    setMonitoredUsername('');
    localStorage.removeItem('commitstreak-is-auth');
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
