import React from 'react';
import { BookOpen, Flame, Sparkles, Plus, Code2 } from 'lucide-react';

export default function JournalStats({ totalEntries = 0, streakDays = 0, onNewEntry }) {
  return (
    <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-gh-lightText dark:text-gh-darkText">
              Daily Coding Journal
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted max-w-xl leading-relaxed">
            Record daily problem-solving breakthroughs, architectural decisions, and technologies mastered alongside your GitHub commits.
          </p>
        </div>

        {/* Action Button & Metrics */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 py-1.5 px-3.5 rounded-xl bg-gray-50 dark:bg-gh-darkCard border border-gh-lightBorder dark:border-gh-darkBorder text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-gh-lightMuted dark:text-gh-darkMuted block">Logged Sessions</span>
              <span className="text-sm font-mono font-bold text-gh-lightText dark:text-gh-darkText">{totalEntries}</span>
            </div>
            <div className="w-[1px] h-6 bg-gh-lightBorder dark:border-gh-darkBorder" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-gh-lightMuted dark:text-gh-darkMuted block">Journal Streak</span>
              <span className="text-sm font-mono font-bold text-emerald-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          <button
            onClick={onNewEntry}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Coding Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
