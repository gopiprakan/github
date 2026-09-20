import React from 'react';
import { Code2 } from 'lucide-react';

export default function LanguageBreakdown({ languages = [] }) {
  return (
    <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-5 sm:p-6 shadow-sm hover:shadow-subtle transition-all duration-200">
      <div className="flex items-center justify-between pb-3.5 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-500" />
            Language Distribution
          </h3>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted mt-0.5">
            Code volume across repositories
          </p>
        </div>
        <span className="text-xs font-mono text-gh-lightMuted dark:text-gh-darkMuted">
          {languages.length} stacks
        </span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="h-2.5 w-full rounded-[3px] overflow-hidden flex bg-gray-100 dark:bg-gh-darkCard mb-4 p-[1px] border border-gh-lightBorder dark:border-gh-darkBorder">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name}: ${lang.percentage}%`}
            className="h-full first:rounded-l-[2px] last:rounded-r-[2px] transition-all duration-200 hover:opacity-80 cursor-pointer"
          />
        ))}
      </div>

      {/* Legend items */}
      <div className="grid grid-cols-2 gap-2.5">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <div className="flex items-baseline justify-between w-full min-w-0 pr-1">
              <span className="font-medium text-gh-lightText dark:text-gh-darkText truncate">
                {lang.name}
              </span>
              <span className="font-mono text-[11px] text-gh-lightMuted dark:text-gh-darkMuted ml-1 shrink-0">
                {lang.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
