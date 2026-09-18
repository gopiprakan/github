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

  const previewHeatmapCells = Array.from({ length: 42 }, (_, i) => {
    return (i % 7 === 0 || i % 5 === 2) ? 3 : (i % 3 === 0 ? 2 : (i % 2 === 0 ? 1 : 0));
  });

  const getCellBg = (lvl) => {
    if (lvl === 3) return 'bg-[#26a641] dark:bg-[#39d353]';
    if (lvl === 2) return 'bg-[#40c463] dark:bg-[#26a641]';
    if (lvl === 1) return 'bg-[#9be9a8] dark:bg-[#0e4429]';
    return 'bg-gray-200 dark:bg-gh-darkCard';
  };

  return (
    <div className="space-y-20 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-16 sm:pb-16">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 mb-6">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>GitHub Activity & Streak Monitor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-mono">Live REST API</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gh-lightText dark:text-gh-darkText leading-[1.15] mb-6">
            Code every day. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
              Track your real progress.
            </span> <br />
            Showcase your work.
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed max-w-2xl mx-auto mb-8">
            Enter your GitHub username to automatically visualize your public repositories, recent commit streams, language distributions, and daily engineering journal.
          </p>

          {/* Interactive Username Search Form */}
          <form onSubmit={handleMonitorSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border-2 border-emerald-500/40 bg-white dark:bg-gh-darkPanel shadow-lg focus-within:border-emerald-500 transition-all">
              <div className="flex items-center pl-3 text-gh-lightMuted dark:text-gh-darkMuted text-sm font-mono">
                @
              </div>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder={monitoredUsername || "Enter your GitHub username"}
                className="flex-1 px-2 py-2 text-sm bg-transparent text-gh-lightText dark:text-gh-darkText placeholder:text-gh-lightMuted focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
              >
                <span>Track User</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick options */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gh-lightMuted dark:text-gh-darkMuted mb-8">
            <span>Popular examples:</span>
            {['torvalds', 'gaearon', 'yyx990803'].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleQuickPreset(ex)}
                className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gh-darkCard hover:text-emerald-500 transition-colors font-mono"
              >
                @{ex}
              </button>
            ))}
          </div>

          {/* Connect GitHub Alternative */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {monitoredUsername && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>View Dashboard (@{monitoredUsername})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel hover:bg-gray-50 dark:hover:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
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
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gh-lightText dark:text-gh-darkText mb-3">
            Live GitHub Visibility
          </h2>
          <p className="text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
            Real-time GitHub metrics computed straight from the public REST API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5 fill-emerald-500" />
            </div>
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
              Real-time Streak Tracking
            </h3>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Calculates consecutive coding streaks and active days directly from your actual GitHub push events and repository updates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
              Live File & Repo Editor
            </h3>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Browse file trees, edit code, create new files or repositories, and commit changes that reflect immediately on your GitHub account.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
              Daily Coding Journal
            </h3>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Log breakthroughs, problems solved, and architecture decisions mapped alongside your git commit logs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
              Language & Analytics
            </h3>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Visualizes language breakdown from your actual repositories, alongside 52-week activity distribution and weekly cadence.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard/40">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-gh-lightText dark:text-gh-darkText mb-2">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted">
              Instantly monitor any user's real GitHub presence in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3">1</span>
              <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">Enter Username</h4>
              <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Provide your GitHub handle or authenticate once with OAuth.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3">2</span>
              <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">Fetch Live Data</h4>
              <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Real repositories, commit streams, and languages are pulled directly from GitHub.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3">3</span>
              <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">Share & Journal</h4>
              <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Maintain your streak, log daily progress, and share your dashboard with recruiters or peers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
