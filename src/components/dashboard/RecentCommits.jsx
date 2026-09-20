import React from 'react';
import { GitCommit, GitBranch, ExternalLink, Clock } from 'lucide-react';
import Badge from '../common/Badge';

export default function RecentCommits({ commits = [] }) {
  const formatTimeAgo = (dateStr) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-5 sm:p-6 shadow-sm hover:shadow-subtle transition-all duration-200">
      <div className="flex items-center justify-between pb-3.5 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-500" />
            Recent Commits & Pushes
          </h3>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted mt-0.5">
            Verified push events synchronized across branches
          </p>
        </div>
        <Badge variant="emerald" size="xs">Live Stream</Badge>
      </div>

      <div className="divide-y divide-gh-lightBorder dark:divide-gh-darkBorder">
        {commits.map((commit) => (
          <div key={commit.id || commit.sha} className="py-3 first:pt-0 last:pb-0 group transition-all duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1 rounded-md bg-gray-100 dark:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted group-hover:text-emerald-500 transition-colors duration-150 shrink-0 mt-0.5">
                  <GitCommit className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-gh-lightText dark:text-gh-darkText font-mono">
                      {commit.repoName}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gh-lightMuted dark:text-gh-darkMuted font-mono">
                      <GitBranch className="w-3 h-3" />
                      {commit.branch || 'main'}
                    </span>
                    <span className="px-1 py-0.2 rounded text-[10px] font-mono bg-gray-100 dark:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted border border-gh-lightBorder dark:border-gh-darkBorder">
                      {commit.sha}
                    </span>
                  </div>

                  <p className="text-xs text-gh-lightText dark:text-gh-darkText leading-relaxed">
                    {commit.message}
                  </p>
                </div>
              </div>

              {/* Right side stats */}
              <div className="flex items-center gap-2.5 pl-6 sm:pl-0 shrink-0 text-xs text-gh-lightMuted dark:text-gh-darkMuted">
                {commit.additions !== undefined && (
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="text-emerald-600 dark:text-emerald-400">+{commit.additions}</span>
                    <span className="text-red-500">-{commit.deletions}</span>
                  </div>
                )}
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(commit.timestamp)}
                </span>
                <a
                  href={commit.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View commit on GitHub"
                  className="p-1 rounded-md text-gh-lightMuted dark:text-gh-darkMuted hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gh-darkCard transition-all duration-150"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
