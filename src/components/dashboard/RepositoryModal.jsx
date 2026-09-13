import React from 'react';
import { Star, GitFork, BookMarked, ExternalLink, Calendar, Shield, GitCommit, AlertCircle, GitBranch, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

export default function RepositoryModal({ repo, isOpen, onClose }) {
  if (!repo) return null;

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  // Mock commit history for the repo drill-down
  const mockRepoCommits = [
    {
      sha: '8f42d1b',
      message: 'perf: optimize hot execution path and cache eviction algorithms',
      author: 'alexrivera-dev',
      time: '2 days ago',
    },
    {
      sha: 'e7208fa',
      message: 'fix: resolve buffer concurrency deadlock under high thread contention',
      author: 'alexrivera-dev',
      time: '3 days ago',
    },
    {
      sha: '4b870cd',
      message: 'docs: update integration guide and add architectural sequence diagrams',
      author: 'alexrivera-dev',
      time: '5 days ago',
    },
    {
      sha: '1d55e90',
      message: 'test: add comprehensive property-based unit test suite with quickcheck',
      author: 'alexrivera-dev',
      time: '1 week ago',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={repo.name} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header description & external CTA */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="flex items-center gap-1 text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400">
              <BookMarked className="w-4 h-4" />
              {repo.name}
            </span>
            <Badge variant="emerald" size="xs">
              {repo.license || 'MIT License'}
            </Badge>
            <Badge variant="default" size="xs">
              Branch: {repo.defaultBranch || 'main'}
            </Badge>
          </div>
          <p className="text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
            {repo.description || "Public repository monitored on CommitStreak."}
          </p>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard/50">
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Stars
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText">{repo.stars}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <GitFork className="w-3 h-3" /> Forks
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText">{repo.forks}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-blue-400" /> Issues
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText">{repo.openIssues || 0}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-emerald-500" /> Commits
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText">{repo.commitsCount || 120}+</p>
          </div>
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider mb-2">
              Topics & Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent commit history list */}
        <div>
          <h4 className="text-xs font-semibold text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider mb-2.5">
            Recent Commit History
          </h4>
          <div className="divide-y divide-gh-lightBorder dark:divide-gh-darkBorder border border-gh-lightBorder dark:border-gh-darkBorder rounded-xl overflow-hidden">
            {mockRepoCommits.map((c) => (
              <div key={c.sha} className="p-3 bg-white dark:bg-gh-darkPanel flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2 min-w-0">
                  <GitCommit className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gh-lightText dark:text-gh-darkText font-medium leading-tight">
                      {c.message}
                    </p>
                    <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted">
                      committed by <span className="font-mono text-gh-lightText dark:text-gh-darkText">{c.author}</span> · {c.time}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-gray-100 dark:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted shrink-0">
                  {c.sha}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-4 border-t border-gh-lightBorder dark:border-gh-darkBorder flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Last updated: {formatDate(repo.updatedAt)}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard"
            >
              Close
            </button>
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
            >
              View on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
