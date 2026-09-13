import React from 'react';
import { Flame, GitCommit, Trophy, CalendarCheck, FolderGit2, TrendingUp } from 'lucide-react';

export default function StatsCard({ profile }) {
  const stats = [
    {
      id: 'current-streak',
      label: 'Current Streak',
      value: `${profile.currentStreak || 47} days`,
      subtext: 'Active uninterrupted coding',
      icon: Flame,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      highlight: true,
    },
    {
      id: 'total-commits',
      label: 'Commits in Past Year',
      value: (profile.totalCommitsYear || 1482).toLocaleString(),
      subtext: 'Across all tracked repositories',
      icon: GitCommit,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'longest-streak',
      label: 'Longest Streak',
      value: `${profile.longestStreak || 94} days`,
      subtext: 'All-time personal record',
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'public-repos',
      label: 'Public Repositories',
      value: profile.publicRepos || 24,
      subtext: `${profile.publicGists || 9} gists & tools open sourced`,
      icon: FolderGit2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-white dark:bg-gh-darkPanel border transition-all hover:shadow-md ${
              item.highlight
                ? 'border-emerald-500/50 dark:border-emerald-500/40 shadow-sm'
                : 'border-gh-lightBorder dark:border-gh-darkBorder'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`p-2 rounded-xl ${item.bgColor} ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight text-gh-lightText dark:text-gh-darkText">
                {item.value}
              </div>
              <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted">
                {item.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
