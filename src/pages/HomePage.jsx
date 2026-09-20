import React, { useState } from 'react';
import {
  Flame,
  ArrowRight,
  Github,
  Calendar,
  BookOpen,
  GitPullRequest,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  Sparkles,
  BarChart2,
  CheckCircle2,
  Search,
  Code,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onNavigate }) {
  const { setIsAuthModalOpen, monitoredUsername, switchMonitoredUser, isAuthenticated } = useAuth();
  const [handleInput, setHandleInput] = useState('');

  const handleMonitorSubmit = (e) => {
    e.preventDefault();
    if (handleInput.trim()) {
      switchMonitoredUser(handleInput.trim());
      onNavigate('dashboard');
    } else if (monitoredUsername) {
      onNavigate('dashboard');
    }
  };

  const handleQuickPreset = (username) => {
    switchMonitoredUser(username);
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-8 sm:pt-14 sm:pb-12">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 mb-6 shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>GitHub Activity & Streak Monitor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[11px]">Live REST API</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gh-lightText dark:text-gh-darkText leading-[1.18] mb-5">
            Code every day. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
              Track your real progress.
            </span> <br />
            Showcase your work.
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed max-w-2xl mx-auto mb-7">
            Enter your GitHub username to automatically visualize your public repositories, recent commit streams, language distributions, and daily engineering journal.
          </p>

          {/* Interactive Username Search Form */}
          <form onSubmit={handleMonitorSubmit} className="max-w-md mx-auto mb-5">
            <div className="flex items-center gap-2 p-1 rounded-md border-2 border-emerald-500/40 bg-white dark:bg-gh-darkPanel shadow-subtle focus-within:border-emerald-500 transition-all duration-150">
              <div className="flex items-center pl-2.5 text-gh-lightMuted dark:text-gh-darkMuted text-xs font-mono">
                @
              </div>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder={monitoredUsername || "Enter your GitHub username"}
                className="flex-1 px-2 py-1.5 text-xs bg-transparent text-gh-lightText dark:text-gh-darkText placeholder:text-gh-lightMuted focus:outline-none font-medium font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all duration-150 whitespace-nowrap"
              >
                <span>Track User</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick options */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-gh-lightMuted dark:text-gh-darkMuted mb-7">
            <span>Popular examples:</span>
            {['torvalds', 'gaearon', 'yyx990803'].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleQuickPreset(ex)}
                className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gh-darkCard hover:text-emerald-500 transition-colors duration-150 font-mono text-[11px] border border-gh-lightBorder dark:border-gh-darkBorder"
              >
                @{ex}
              </button>
            ))}
          </div>

          {/* Connect GitHub Alternative */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {monitoredUsername && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
              >
                <span>View Dashboard (@{monitoredUsername})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel hover:bg-gray-50 dark:hover:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
            >
              <Github className="w-4 h-4" />
              <span>{isAuthenticated ? `Connected as @${monitoredUsername}` : 'Connect GitHub Account'}</span>
            </button>
          </div>

          <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted mt-4 flex items-center justify-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Zero login required to monitor any public GitHub profile.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gh-lightText dark:text-gh-darkText mb-2">
            Live GitHub Visibility
          </h2>
          <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
            Real-time GitHub metrics computed straight from the public REST API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-subtle hover:border-emerald-500/40 transition-all duration-200">
            <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <Flame className="w-4 h-4 fill-emerald-500" />
            </div>
            <h3 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">
              Streak Tracking
            </h3>
            <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Calculates consecutive streaks and active coding days directly from your actual GitHub push events.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-subtle hover:border-teal-500/40 transition-all duration-200">
            <div className="w-9 h-9 rounded-md bg-teal-500/10 text-teal-500 flex items-center justify-center mb-3">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">
              Live File & Repo Editor
            </h3>
            <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Browse file trees, edit code, and commit changes that reflect immediately on your GitHub account.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-subtle hover:border-blue-500/40 transition-all duration-200">
            <div className="w-9 h-9 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">
              Daily Coding Journal
            </h3>
            <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Log breakthroughs, problems solved, and architecture decisions mapped alongside your git commit logs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-subtle hover:border-purple-500/40 transition-all duration-200">
            <div className="w-9 h-9 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">
              Language & Analytics
            </h3>
            <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Visualizes language breakdown from your actual repositories, alongside 52-week activity distribution.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50/60 dark:bg-gh-darkCard/40">
          <div className="text-center max-w-xl mx-auto mb-7">
            <h2 className="text-lg sm:text-xl font-bold text-gh-lightText dark:text-gh-darkText mb-1.5">
              How It Works
            </h2>
            <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted">
              Instantly monitor any user's real GitHub presence in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            <div className="p-4 rounded-md bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center shadow-sm">
              <span className="w-6 h-6 rounded-md bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2.5">1</span>
              <h4 className="text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1">Enter Username</h4>
              <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Provide your GitHub handle or authenticate once with OAuth.
              </p>
            </div>

            <div className="p-4 rounded-md bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center shadow-sm">
              <span className="w-6 h-6 rounded-md bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2.5">2</span>
              <h4 className="text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1">Fetch Live Data</h4>
              <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Real repositories, commit streams, and languages are pulled directly from GitHub.
              </p>
            </div>

            <div className="p-4 rounded-md bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center shadow-sm">
              <span className="w-6 h-6 rounded-md bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2.5">3</span>
              <h4 className="text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1">Share & Journal</h4>
              <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Maintain your streak, log daily progress, and share your dashboard with peers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
