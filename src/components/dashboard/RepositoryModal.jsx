import React from 'react';
import { Star, GitFork, BookMarked, ExternalLink, Calendar, Shield, GitCommit, AlertCircle, GitBranch, Check, Code, Settings, Edit3 } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

export default function RepositoryModal({ repo, isOpen, onClose, onEditFiles, onEditSettings }) {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={repo.name} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Header description & external CTA */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="flex items-center gap-1 text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400">
              <BookMarked className="w-4 h-4" />
              {repo.name}
            </span>
            <Badge variant="emerald" size="xs">
              {repo.license || 'Open Source'}
            </Badge>
            <Badge variant="default" size="xs">
              Branch: {repo.defaultBranch || 'main'}
            </Badge>
            {repo.language && (
              <Badge variant="default" size="xs">
                {repo.language}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
            {repo.description || "Public repository monitored on CommitStreak."}
          </p>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard/50">
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Stars
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText">{repo.stars || 0}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <GitFork className="w-3 h-3" /> Forks
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText">{repo.forks || 0}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-blue-400" /> Issues
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText">{repo.openIssues || 0}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-emerald-500" /> Branch
            </span>
            <p className="text-base font-bold font-mono text-gh-lightText dark:text-gh-darkText truncate">
              {repo.defaultBranch || 'main'}
            </p>
          </div>
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gh-lightMuted dark:text-gh-darkMuted uppercase tracking-wider mb-2">
              Topics & Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Repository overview info */}
        <div className="p-3 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50/50 dark:bg-gh-darkCard/30 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-gh-lightMuted dark:text-gh-darkMuted">
            <span className="flex items-center gap-1.5 font-medium">
              <Code className="w-3.5 h-3.5 text-emerald-500" /> Primary Language:
            </span>
            <span className="font-mono text-gh-lightText dark:text-gh-darkText font-semibold">
              {repo.language || 'Documentation / Mixed'}
            </span>
          </div>
          <div className="flex items-center justify-between text-gh-lightMuted dark:text-gh-darkMuted">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> Last Updated on GitHub:
            </span>
            <span className="font-mono text-gh-lightText dark:text-gh-darkText">
              {formatDate(repo.updatedAt)}
            </span>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3.5 border-t border-gh-lightBorder dark:border-gh-darkBorder flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onEditFiles && (
              <button
                onClick={() => {
                  onClose();
                  onEditFiles(repo);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all duration-150"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Open Files & Code</span>
              </button>
            )}
            {onEditSettings && (
              <button
                onClick={() => {
                  onClose();
                  onEditSettings(repo);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard flex items-center gap-1 transition-all duration-150"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard transition-all duration-150"
            >
              Close
            </button>
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard flex items-center gap-1.5 transition-all duration-150"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
