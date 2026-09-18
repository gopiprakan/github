import React from 'react';
import { Star, GitFork, BookMarked, ExternalLink, Calendar, Shield, Code, Settings, Edit3 } from 'lucide-react';
import Badge from '../common/Badge';

export default function RepositoryCard({ repo, onSelect, onEditFiles, onEditSettings }) {
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-5 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
      <div>
        {/* Repo header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <BookMarked className="w-4 h-4 text-emerald-500 shrink-0" />
            <button
              onClick={() => onSelect ? onSelect(repo) : onEditFiles?.(repo)}
              className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText group-hover:text-emerald-500 transition-colors truncate text-left"
            >
              {repo.name}
            </button>
          </div>
          <Badge variant="outline" size="xs">
            {repo.isPrivate ? 'Private' : 'Public'}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed line-clamp-2 mb-4">
          {repo.description || "Public repository monitored on CommitStreak."}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-[10px] text-gh-lightMuted dark:text-gh-darkMuted self-center">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer metadata & Quick Actions */}
      <div className="pt-3 border-t border-gh-lightBorder dark:border-gh-darkBorder space-y-2.5">
        <div className="flex items-center justify-between text-xs text-gh-lightMuted dark:text-gh-darkMuted">
          <div className="flex items-center gap-3">
            {repo.language && (
              <span className="flex items-center gap-1.5 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: repo.languageColor || '#3178c6' }}
                />
                {repo.language}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {repo.stars}
            </span>

            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {repo.forks}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onEditSettings && (
              <button
                onClick={() => onEditSettings(repo)}
                title="Repository Settings"
                className="p-1 rounded-lg text-gh-lightMuted dark:text-gh-darkMuted hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gh-darkCard transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub repository"
              title="Open repository on GitHub"
              className="p-1 rounded-lg text-gh-lightMuted dark:text-gh-darkMuted hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gh-darkCard transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditFiles ? onEditFiles(repo) : onSelect?.(repo)}
            className="flex-1 py-1.5 px-2.5 text-[11px] font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Edit Files & Code</span>
          </button>
          <button
            onClick={() => onSelect(repo)}
            className="py-1.5 px-2.5 text-[11px] font-medium rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

