import React from 'react';
import { Flame, GitCommit, Trophy, FolderGit2 } from 'lucide-react';

export default function StatsCard({ profile }) {
  if (!profile) return null;

  const currentStreak = profile.currentStreak || 0;
  const longestStreak = profile.longestStreak || 0;
  const totalCommits = profile.totalCommitsYear || 0;
  const publicRepos = profile.publicRepos || 0;

  const stats = [
    {
      id: 'current-streak',
      label: 'Current Streak',
      value: `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`,
      subtext: currentStreak > 0 ? 'Active consecutive coding' : 'Push code today to start streak',
      icon: Flame,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      highlight: true,
    },
    {
      id: 'total-commits',
      label: 'Tracked Activity',
      value: totalCommits.toLocaleString(),
      subtext: 'Events & commits recorded',
      icon: GitCommit,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'longest-streak',
      label: 'Longest Streak',
      value: `${longestStreak} ${longestStreak === 1 ? 'day' : 'days'}`,
      subtext: 'All-time tracked record',
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'public-repos',
      label: 'Public Repositories',
      value: publicRepos,
      subtext: `${profile.publicGists || 0} gists & public projects`,
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
