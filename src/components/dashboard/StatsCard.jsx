import React from 'react';
import { Flame, GitCommit, Trophy, FolderGit2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';

export default function StatsCard({ profile }) {
  if (!profile) return null;

  const currentStreak = profile.currentStreak || 0;
  const longestStreak = profile.longestStreak || 0;
  const totalCommits = profile.totalCommitsYear || 0;
  const publicRepos = profile.publicRepos || 0;
  const streakStatus = profile.streakStatus || (currentStreak > 0 ? 'active_today' : 'inactive');
  const streakMessage = profile.streakMessage || (currentStreak > 0 ? 'Active consecutive coding' : 'Push code today to start streak');
  const activeDays = profile.activeDaysThisYear || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Current Streak Card (Highlight) */}
      <div className={`p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border transition-all hover:shadow-md relative overflow-hidden ${
        currentStreak > 0
          ? 'border-amber-500/50 dark:border-amber-500/40 shadow-sm bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 dark:from-gh-darkPanel dark:via-gh-darkPanel dark:to-amber-950/20'
          : 'border-gh-lightBorder dark:border-gh-darkBorder'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider flex items-center gap-1.5">
            Current Streak
          </span>
          <div className={`p-2 rounded-xl flex items-center justify-center ${
            currentStreak > 0
              ? 'bg-amber-500/15 text-amber-500 shadow-inner'
              : 'bg-gray-100 dark:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted'
          }`}>
            <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'fill-amber-500 text-amber-500 animate-pulse' : ''}`} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-gh-lightText dark:text-gh-darkText">
              {currentStreak}
            </span>
            <span className="text-sm font-semibold text-gh-lightMuted dark:text-gh-darkMuted font-mono">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>

            {streakStatus === 'active_today' && (
              <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Today
              </span>
            )}
            {streakStatus === 'at_risk' && (
              <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                ⚠️ Due Today
              </span>
            )}
          </div>

          <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted leading-tight">
            {streakMessage}
          </p>
        </div>
      </div>

      {/* 2. Total Tracked Contributions */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider">
            Total Contributions
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <GitCommit className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-gh-lightText dark:text-gh-darkText">
            {totalCommits.toLocaleString()}
          </div>
          <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted">
            {activeDays > 0 ? `${activeDays} active coding days in past year` : 'Recorded across all repositories'}
          </p>
        </div>
      </div>

      {/* 3. Longest Streak */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider">
            Longest Streak
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-gh-lightText dark:text-gh-darkText">
              {longestStreak}
            </span>
            <span className="text-sm font-semibold text-gh-lightMuted dark:text-gh-darkMuted font-mono">
              {longestStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted">
            Personal best consecutive streak record
          </p>
        </div>
      </div>

      {/* 4. Public Repositories */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider">
            Repositories
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <FolderGit2 className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-gh-lightText dark:text-gh-darkText">
            {publicRepos}
          </div>
          <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted">
            {profile.publicGists || 0} gists & public repositories
          </p>
        </div>
      </div>
    </div>
  );
}

