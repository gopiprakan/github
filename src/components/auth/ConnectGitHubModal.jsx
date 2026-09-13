import React, { useState } from 'react';
import { Github, Key, CheckCircle2, AlertCircle, LogOut, ArrowRight, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

export default function ConnectGitHubModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    monitoredUsername,
    isDemoMode,
    loginOwner,
    logoutOwner,
    switchMonitoredUser,
    resetToSampleData,
  } = useAuth();

  const [inputUsername, setInputUsername] = useState(monitoredUsername);
  const [personalToken, setPersonalToken] = useState('');
  const [activeTab, setActiveTab] = useState('oauth'); // 'oauth' | 'public' | 'pat'
  const [feedback, setFeedback] = useState(null);

  const handleOAuthConnect = () => {
    // In production with GITHUB_CLIENT_ID configured:
    // window.location.href = `/api/auth/github`;
    // For local dev or quick owner test:
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (clientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,repo&redirect_uri=${redirectUri}`;
    } else {
      // Simulate successful owner authentication state with prompt
      setFeedback({
        type: 'info',
        message: 'No GITHUB_CLIENT_ID detected in environment. Simulating Owner Authorization for local demo.',
      });
      setTimeout(() => {
        loginOwner('mock-oauth-owner-token', inputUsername || 'gopiprakan');
        setFeedback({ type: 'success', message: 'Successfully authenticated as website owner!' });
      }, 700);
    }
  };

  const handlePublicLookup = (e) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;
    switchMonitoredUser(inputUsername.trim(), true);
    setFeedback({ type: 'success', message: `Now monitoring public GitHub account: @${inputUsername.trim()}` });
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setFeedback(null);
    }, 900);
  };

  const handlePATConnect = (e) => {
    e.preventDefault();
    if (!personalToken.trim()) return;
    loginOwner(personalToken.trim(), inputUsername.trim() || 'gopiprakan');
    setFeedback({ type: 'success', message: 'Connected using GitHub Personal Access Token!' });
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setFeedback(null);
    }, 900);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => {
        setIsAuthModalOpen(false);
        setFeedback(null);
      }}
      title="Connect GitHub Account"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Status banner */}
        <div className="p-3.5 rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard flex items-start gap-3">
          {isAuthenticated ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-gh-lightText dark:text-gh-darkText">Owner Connected</p>
                <p className="text-gh-lightMuted dark:text-gh-darkMuted text-xs mt-0.5">
                  Connected as <span className="text-emerald-500 font-mono">@{monitoredUsername}</span>. Visitors can view your public activity without signing in.
                </p>
              </div>
              <button
                onClick={logoutOwner}
                className="px-2.5 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" /> Disconnect
              </button>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-gh-lightText dark:text-gh-darkText">Visitor Mode Active</p>
                <p className="text-gh-lightMuted dark:text-gh-darkMuted text-xs mt-0.5">
                  Currently viewing <span className="font-mono text-emerald-500">@{monitoredUsername}</span> ({isDemoMode ? 'Sample Data' : 'Live Data'}).
                </p>
              </div>
            </>
          )}
        </div>

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab selection */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-gh-darkCard p-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('oauth')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'oauth'
                ? 'bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText shadow-sm'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            <Github className="w-3.5 h-3.5" /> Owner OAuth
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'public'
                ? 'bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText shadow-sm'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Public Monitor
          </button>
          <button
            onClick={() => setActiveTab('pat')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pat'
                ? 'bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText shadow-sm'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> Access Token
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'oauth' && (
          <div className="space-y-4">
            <p className="text-sm text-gh-lightMuted dark:text-gh-darkMuted">
              Authenticate your GitHub account once. Your public coding stats will automatically refresh for any visitor who visits your portfolio.
            </p>
            <button
              onClick={handleOAuthConnect}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Github className="w-4 h-4" />
              {isAuthenticated ? 'Re-authenticate with GitHub' : 'Connect with GitHub OAuth'}
            </button>
            <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted text-center">
              Requires <code className="font-mono text-emerald-500">GITHUB_CLIENT_ID</code> and <code className="font-mono text-emerald-500">GITHUB_CLIENT_SECRET</code> in Vercel environment variables.
            </p>
          </div>
        )}

        {activeTab === 'public' && (
          <form onSubmit={handlePublicLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1.5">
                GitHub Username to Monitor
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gh-lightMuted dark:text-gh-darkMuted text-sm font-mono">@</span>
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="e.g. torvalds, gaearon, or your-handle"
                  className="w-full pl-8 pr-4 py-2 text-sm rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              Monitor This Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {activeTab === 'pat' && (
          <form onSubmit={handlePATConnect} className="space-y-4">
            <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted">
              Optional: Enter a GitHub Personal Access Token (classic with <code className="font-mono text-emerald-500">read:user</code> scope) to increase rate limits to 5,000 requests/hr.
            </p>
            <div>
              <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1">
                GitHub Username
              </label>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="your-github-username"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
              />
              <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1">
                Personal Access Token (PAT)
              </label>
              <input
                type="password"
                value={personalToken}
                onChange={(e) => setPersonalToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              Save Token & Connect <Key className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Reset to Sample Profile */}
        <div className="pt-3 border-t border-gh-lightBorder dark:border-gh-darkBorder flex items-center justify-between text-xs">
          <span className="text-gh-lightMuted dark:text-gh-darkMuted">Want to test with full demo metrics?</span>
          <button
            onClick={() => {
              resetToSampleData();
              setInputUsername('alexrivera-dev');
              setFeedback({ type: 'info', message: 'Restored high-fidelity demo sample profile.' });
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Reset to Sample Data
          </button>
        </div>
      </div>
    </Modal>
  );
}
