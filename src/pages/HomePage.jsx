import React from 'react';
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
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onNavigate }) {
  const { setIsAuthModalOpen, monitoredUsername, isAuthenticated } = useAuth();

  const previewHeatmapCells = Array.from({ length: 42 }, (_, i) => {
    // Generate realistic pattern for mini preview
    const val = (i % 7 === 0 || i % 5 === 2) ? 3 : (i % 3 === 0 ? 2 : (i % 2 === 0 ? 1 : 0));
    return val;
  });

  const getCellBg = (lvl) => {
    if (lvl === 3) return 'bg-[#26a641] dark:bg-[#39d353]';
    if (lvl === 2) return 'bg-[#40c463] dark:bg-[#26a641]';
    if (lvl === 1) return 'bg-[#9be9a8] dark:bg-[#0e4429]';
    return 'bg-gray-200 dark:bg-gh-darkCard';
  };

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 mb-6 animate-fade-in">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Developer Consistency Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-mono">47 Days Active</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gh-lightText dark:text-gh-darkText leading-[1.15] mb-6">
            Code every day. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
              Track your progress.
            </span> <br />
            Build your future.
          </h1>

          {/* Tagline / Description */}
          <p className="text-base sm:text-lg text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed max-w-2xl mx-auto mb-10">
            A developer dashboard that monitors your personal GitHub account. Connect once with OAuth, and let recruiters, peers, and visitors explore your coding streak, commit activity, and technical journal without logging in.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Explore My Coding Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel hover:bg-gray-50 dark:hover:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Github className="w-4 h-4" />
              <span>{isAuthenticated ? `Connected as @${monitoredUsername}` : 'Connect GitHub'}</span>
            </button>
          </div>

          {/* Quick trust reassurance */}
          <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted mt-4 flex items-center justify-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Public visitors browse read-only. Zero login requirements for guests.
          </p>
        </div>

        {/* Interactive Dashboard Preview Card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16">
          <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 shadow-elevated dark:shadow-elevated-dark overflow-hidden relative">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-4 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs font-mono text-gh-lightMuted dark:text-gh-darkMuted">
                  commitstreak.app/@{monitoredUsername}
                </span>
              </div>
              <Badge variant="emerald" size="xs">Live Preview</Badge>
            </div>

            {/* Dashboard snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Snapshot Col 1: Streak Card */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gh-darkCard/50 border border-gh-lightBorder dark:border-gh-darkBorder">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gh-lightMuted dark:text-gh-darkMuted font-medium">Consecutive Streak</span>
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-3xl font-mono font-bold text-gh-lightText dark:text-gh-darkText mb-1">47 Days</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Top 2% of GitHub contributors</p>
              </div>

              {/* Snapshot Col 2: Heatmap grid teaser */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gh-darkCard/50 border border-gh-lightBorder dark:border-gh-darkBorder md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gh-lightMuted dark:text-gh-darkMuted font-medium">Recent Contribution Velocity</span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">1,482 commits / yr</span>
                </div>
                {/* Mini Heatmap */}
                <div className="flex gap-1 overflow-x-auto py-1">
                  {Array.from({ length: 14 }).map((_, col) => (
                    <div key={col} className="flex flex-col gap-1">
                      {Array.from({ length: 3 }).map((_, row) => {
                        const cellLvl = (col * 3 + row) % 4;
                        return (
                          <div
                            key={row}
                            className={`w-3 h-3 rounded-[2px] ${getCellBg(cellLvl)}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-gh-lightMuted dark:text-gh-darkMuted">
                  <span>July</span>
                  <span>August</span>
                  <span>September</span>
                </div>
              </div>
            </div>

            {/* Bottom banner in preview card */}
            <div className="mt-6 pt-4 border-t border-gh-lightBorder dark:border-gh-darkBorder flex items-center justify-between text-xs">
              <span className="text-gh-lightMuted dark:text-gh-darkMuted">
                Latest commit: <code className="font-mono text-emerald-500">8f42d1b</code> in <span className="font-semibold text-gh-lightText dark:text-gh-darkText">micro-cache-rs</span>
              </span>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
              >
                Open Full Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gh-lightText dark:text-gh-darkText mb-3">
            Designed for Developers Who Value Consistency
          </h2>
          <p className="text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
            Everything you need to showcase genuine dedication, track learning velocity, and present proof of work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5 fill-emerald-500" />
            </div>
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
              Uninterrupted Streak Tracker
            </h3>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Real-time calculations for current streaks, historical records, and active days across every public repository you contribute to.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
              Daily Coding Journal
            </h3>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Document problems solved, architectures investigated, and lessons learned alongside your commit messages.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
              GitHub Visual Analytics
            </h3>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Rich 52-week contribution heatmap, language distribution bars, and weekly cadence charts powered by Recharts.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard/40">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-gh-lightText dark:text-gh-darkText mb-2">
              How CommitStreak Works
            </h2>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted">
              Simple 3-step lifecycle for continuous personal engineering oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3">1</span>
              <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">Connect Once</h4>
              <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Authorize your GitHub account once. Tokens remain securely processed on serverless endpoints.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3">2</span>
              <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">Commit Everyday</h4>
              <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Work on your side projects and open source repos. CommitStreak detects push events automatically.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-center">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-3">3</span>
              <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">Share Publicly</h4>
              <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
                Send your link to mentors or hiring managers. They view your work instantly without logging in.
              </p>
            </div>
          </div>

          {/* Bottom call to action */}
          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-sm transition-all"
            >
              Launch Dashboard Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
