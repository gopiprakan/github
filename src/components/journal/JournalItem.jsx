import React from 'react';
import { Calendar, Tag, GitCommit, Edit3, Trash2, Lightbulb, Wrench, FileText, CheckCircle } from 'lucide-react';
import Badge from '../common/Badge';

export default function JournalItem({ entry, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative pl-6 sm:pl-8 pb-8 group last:pb-0">
      {/* Timeline vertical bar */}
      <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-0 w-[2px] bg-emerald-500/20 group-last:hidden" />

      {/* Timeline node */}
      <div className="absolute left-0 top-1.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white dark:bg-gh-darkPanel border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-sm z-10 group-hover:scale-110 transition-transform">
        <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white dark:text-gh-darkPanel" />
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all">
        {/* Header: Date, Repo, Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {formatDate(entry.date)}
            </span>
            {entry.repoName && (
              <span className="text-xs font-mono text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
                <GitCommit className="w-3 h-3 text-emerald-500" />
                {entry.repoName}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => onEdit(entry)}
              aria-label="Edit journal entry"
              className="p-1.5 rounded-lg text-gh-lightMuted dark:text-gh-darkMuted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gh-darkCard transition-colors"
              title="Edit entry"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              aria-label="Delete journal entry"
              className="p-1.5 rounded-lg text-gh-lightMuted dark:text-gh-darkMuted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Delete entry"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Topic Title */}
        <h3 className="text-base sm:text-lg font-bold text-gh-lightText dark:text-gh-darkText mb-3">
          {entry.topic}
        </h3>

        {/* Problems Solved */}
        {entry.problemsSolved && (
          <div className="mb-3.5 p-3 rounded-xl bg-gray-50 dark:bg-gh-darkCard/60 border border-gh-lightBorder/60 dark:border-gh-darkBorder/60 text-xs leading-relaxed">
            <div className="font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-1.5 mb-1 text-amber-600 dark:text-amber-400">
              <Wrench className="w-3.5 h-3.5" />
              <span>Challenge & Resolution:</span>
            </div>
            <p className="text-gh-lightMuted dark:text-gh-darkMuted">{entry.problemsSolved}</p>
          </div>
        )}

        {/* What I Learned */}
        {entry.whatLearned && (
          <div className="mb-3.5 text-xs leading-relaxed flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gh-lightText dark:text-gh-darkText font-medium">Key Takeaway: </strong>
              <span className="text-gh-lightMuted dark:text-gh-darkMuted">{entry.whatLearned}</span>
            </div>
          </div>
        )}

        {/* GitHub Commit Message */}
        {entry.commitMessage && (
          <div className="mb-3.5 text-xs font-mono bg-gray-100 dark:bg-gh-darkCard px-3 py-1.5 rounded-lg flex items-center gap-2 text-gh-lightText dark:text-gh-darkText border border-gh-lightBorder dark:border-gh-darkBorder">
            <GitCommit className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{entry.commitMessage}</span>
          </div>
        )}

        {/* Personal Notes */}
        {entry.personalNotes && (
          <div className="mb-3.5 text-xs text-gh-lightMuted dark:text-gh-darkMuted italic flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>"{entry.personalNotes}"</span>
          </div>
        )}

        {/* Tech tags */}
        {entry.technologies && entry.technologies.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-1.5">
            {entry.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              >
                #{tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
