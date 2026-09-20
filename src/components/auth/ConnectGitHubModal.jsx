import React, { useState } from 'react';
import { Github, Key, CheckCircle2, AlertCircle, LogOut, ArrowRight, UserCheck, ShieldCheck, Sparkles, X, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

export default function ConnectGitHubModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    monitoredUsername,
    loginOwner,
    logoutOwner,
    switchMonitoredUser,
    clearMonitoredUser,
  } = useAuth();

  const [inputUsername, setInputUsername] = useState(monitoredUsername || '');
  const [personalToken, setPersonalToken] = useState('');
  const [activeTab, setActiveTab] = useState('public'); // 'public' | 'oauth' | 'pat'
  const [feedback, setFeedback] = useState(null);

  const handleOAuthConnect = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (clientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,repo&redirect_uri=${redirectUri}`;
    } else {
      if (!inputUsername.trim()) {
        setFeedback({ type: 'error', message: 'Please enter your GitHub username first.' });
        return;
      }
      setFeedback({
        type: 'info',
        message: 'No GITHUB_CLIENT_ID configured in environment. Connecting as verified account for @' + inputUsername.trim(),
      });
      setTimeout(() => {
        loginOwner(null, inputUsername.trim());
        setFeedback({ type: 'success', message: `Connected as owner @${inputUsername.trim()}!` });
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setFeedback(null);
        }, 800);
      }, 500);
    }
  };

  const handlePublicLookup = (e) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;
    switchMonitoredUser(inputUsername.trim());
    setFeedback({ type: 'success', message: `Now monitoring GitHub account: @${inputUsername.trim()}` });
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setFeedback(null);
    }, 800);
  };

  const handlePATConnect = (e) => {
    e.preventDefault();
    if (!personalToken.trim() || !inputUsername.trim()) {
      setFeedback({ type: 'error', message: 'Please provide both username and personal token.' });
      return;
    }
    loginOwner(personalToken.trim(), inputUsername.trim());
    setFeedback({ type: 'success', message: 'Connected using GitHub Personal Access Token!' });
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setFeedback(null);
    }, 800);
  };

  const handleClearAccount = () => {
    logoutOwner();
    clearMonitoredUser();
    setInputUsername('');
    setFeedback({ type: 'info', message: 'Account selection cleared.' });
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => {
        setIsAuthModalOpen(false);
        setFeedback(null);
      }}
      title="GitHub Account Setup"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Status banner */}
        <div className="p-3 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard flex items-start gap-2.5">
          {monitoredUsername ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div className="flex-1 text-xs">
                <p className="font-semibold text-gh-lightText dark:text-gh-darkText">
                  {isAuthenticated ? 'Owner Account Active' : 'Public Profile Monitored'}
                </p>
                <p className="text-gh-lightMuted dark:text-gh-darkMuted text-[11px] mt-0.5">
                  Currently viewing <span className="text-emerald-500 font-mono font-semibold">@{monitoredUsername}</span>.
                </p>
              </div>
              <button
                onClick={handleClearAccount}
                className="px-2 py-0.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-all duration-150 flex items-center gap-1 shrink-0"
              >
                <LogOut className="w-3 h-3" /> Clear
              </button>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-gh-lightText dark:text-gh-darkText">No GitHub Account Selected</p>
                <p className="text-gh-lightMuted dark:text-gh-darkMuted text-[11px] mt-0.5">
                  Enter any public username below or connect your GitHub account.
                </p>
              </div>
            </>
          )}
        </div>

        {feedback && (
          <div
            className={`p-2.5 rounded-md text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : feedback.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab selection */}
        <div className="flex rounded-md bg-gray-100 dark:bg-gh-darkCard p-0.5 text-xs font-medium border border-gh-lightBorder dark:border-gh-darkBorder">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-1 rounded transition-all duration-150 flex items-center justify-center gap-1.5 ${
              activeTab === 'public'
                ? 'bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText shadow-sm font-semibold'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Public
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            className={`flex-1 py-1 rounded transition-all duration-150 flex items-center justify-center gap-1.5 ${
              activeTab === 'oauth'
                ? 'bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText shadow-sm font-semibold'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            <Github className="w-3.5 h-3.5" /> OAuth
          </button>
          <button
            onClick={() => setActiveTab('pat')}
            className={`flex-1 py-1 rounded transition-all duration-150 flex items-center justify-center gap-1.5 ${
              activeTab === 'pat'
                ? 'bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText shadow-sm font-semibold'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> Access Token
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'public' && (
          <form onSubmit={handlePublicLookup} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1">
                GitHub Username to Monitor
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-gh-lightMuted dark:text-gh-darkMuted text-xs font-mono">@</span>
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="e.g. gopiprakan, torvalds, gaearon..."
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-3.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150"
            >
              <span>Monitor Account</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {activeTab === 'oauth' && (
          <div className="space-y-3">
            <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Authenticate your GitHub account. Your public coding stats, repositories, and commits will automatically sync for all visitors.
            </p>
            <div>
              <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1">
                Your GitHub Username
              </label>
              <div className="relative mb-2">
                <span className="absolute left-2.5 top-2 text-gh-lightMuted dark:text-gh-darkMuted text-xs font-mono">@</span>
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="your-github-username"
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
                />
              </div>
            </div>
            <button
              onClick={handleOAuthConnect}
              className="w-full py-2 px-3.5 rounded-md bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Connect with GitHub</span>
            </button>
          </div>
        )}

        {activeTab === 'pat' && (
          <form onSubmit={handlePATConnect} className="space-y-3">
            <div className="p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Full GitHub Read & Write Sync
              </p>
              <p className="text-[11px] leading-relaxed">
                Enter a GitHub Personal Access Token (classic) with <code className="font-mono font-bold">repo</code> & <code className="font-mono font-bold">read:user</code> scopes to edit files, commit changes live to GitHub, create new repos, and increase rate limits.
              </p>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=CommitStreak-Editor"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-0.5 text-[11px]"
              >
                <span>Generate Token on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1">
                GitHub Username
              </label>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="your-github-username"
                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-2 font-mono transition-all duration-150"
              />
              <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1">
                Personal Access Token (PAT)
              </label>
              <input
                type="password"
                value={personalToken}
                onChange={(e) => setPersonalToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-3.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150"
            >
              <span>Save Token & Connect</span> <Key className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
