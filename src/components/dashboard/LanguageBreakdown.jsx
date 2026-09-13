import React from 'react';
import { Code2 } from 'lucide-react';

export default function LanguageBreakdown({ languages = [] }) {
  return (
    <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-5">
        <div>
          <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-500" />
            Language Distribution
          </h3>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted mt-0.5">
            Total code written across active projects
          </p>
        </div>
        <span className="text-xs font-mono text-gh-lightMuted dark:text-gh-darkMuted">
          {languages.length} stacks tracked
        </span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-100 dark:bg-gh-darkCard mb-5 p-[1px]">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name}: ${lang.percentage}%`}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all hover:opacity-80 cursor-pointer"
          />
        ))}
      </div>

      {/* Legend items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <div className="flex items-baseline justify-between w-full min-w-0 pr-1">
              <span className="font-medium text-gh-lightText dark:text-gh-darkText truncate">
                {lang.name}
              </span>
              <span className="font-mono text-[11px] text-gh-lightMuted dark:text-gh-darkMuted ml-1.5 shrink-0">
                {lang.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
