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
    <div className="relative pl-6 sm:pl-8 pb-7 group last:pb-0">
      {/* Timeline vertical bar */}
      <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-0 w-[2px] bg-emerald-500/20 group-last:hidden" />

      {/* Timeline node */}
      <div className="absolute left-0 top-1.5 w-6 sm:w-7 h-6 sm:h-7 rounded-md bg-white dark:bg-gh-darkPanel border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-sm z-10 group-hover:scale-105 transition-transform duration-150">
        <CheckCircle className="w-3 h-3 fill-emerald-500 text-white dark:text-gh-darkPanel" />
      </div>

      {/* Main card */}
      <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-4 sm:p-5 shadow-sm hover:shadow-subtle hover:border-emerald-500/40 transition-all duration-200">
        {/* Header: Date, Repo, Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800">
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
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              onClick={() => onEdit(entry)}
              aria-label="Edit journal entry"
              className="p-1 rounded-md text-gh-lightMuted dark:text-gh-darkMuted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gh-darkCard transition-all duration-150"
              title="Edit entry"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              aria-label="Delete journal entry"
              className="p-1 rounded-md text-gh-lightMuted dark:text-gh-darkMuted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-150"
              title="Delete entry"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Topic Title */}
        <h3 className="text-sm sm:text-base font-bold text-gh-lightText dark:text-gh-darkText mb-2.5">
          {entry.topic}
        </h3>

        {/* Problems Solved */}
        {entry.problemsSolved && (
          <div className="mb-2.5 p-2.5 rounded-md bg-gray-50 dark:bg-gh-darkCard/60 border border-gh-lightBorder/60 dark:border-gh-darkBorder/60 text-xs leading-relaxed">
            <div className="font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-1.5 mb-1 text-amber-600 dark:text-amber-400">
              <Wrench className="w-3.5 h-3.5" />
              <span>Challenge & Resolution:</span>
            </div>
            <p className="text-gh-lightMuted dark:text-gh-darkMuted">{entry.problemsSolved}</p>
          </div>
        )}

        {/* What I Learned */}
        {entry.whatLearned && (
          <div className="mb-2.5 text-xs leading-relaxed flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gh-lightText dark:text-gh-darkText font-medium">Key Takeaway: </strong>
              <span className="text-gh-lightMuted dark:text-gh-darkMuted">{entry.whatLearned}</span>
            </div>
          </div>
        )}

        {/* GitHub Commit Message */}
        {entry.commitMessage && (
          <div className="mb-2.5 text-xs font-mono bg-gray-100 dark:bg-gh-darkCard px-2.5 py-1 rounded-md flex items-center gap-2 text-gh-lightText dark:text-gh-darkText border border-gh-lightBorder dark:border-gh-darkBorder">
            <GitCommit className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{entry.commitMessage}</span>
          </div>
        )}

        {/* Personal Notes */}
        {entry.personalNotes && (
          <div className="mb-2.5 text-xs text-gh-lightMuted dark:text-gh-darkMuted italic flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>"{entry.personalNotes}"</span>
          </div>
        )}

        {/* Tech tags */}
        {entry.technologies && entry.technologies.length > 0 && (
          <div className="pt-1.5 flex flex-wrap items-center gap-1">
            {entry.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800"
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
