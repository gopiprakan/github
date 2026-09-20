import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Info, Flame, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';

export default function ContributionCalendar({ contributions = [] }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedYear, setSelectedYear] = useState('Past Year');

  const displayContributions = useMemo(() => {
    if (!contributions || contributions.length === 0) return [];
    if (selectedYear === 'Past Year') return contributions;
    const yearStr = String(selectedYear);
    return contributions.filter(c => c.date && c.date.startsWith(yearStr));
  }, [contributions, selectedYear]);

  // Split contributions into columns of 7 days (52 or 53 weeks)
  const weeks = useMemo(() => {
    if (!displayContributions || displayContributions.length === 0) return [];
    const grouped = [];
    let currentWeek = [];

    displayContributions.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === displayContributions.length - 1) {
        grouped.push(currentWeek);
        currentWeek = [];
      }
    });
    return grouped;
  }, [displayContributions]);

  // Compute month label positions based on first occurrence in weeks
  const monthLabels = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay && firstDay.date) {
        const monthNum = new Date(firstDay.date).getMonth();
        if (monthNum !== lastMonth) {
          labels.push({
            weekIndex,
            label: months[monthNum],
          });
          lastMonth = monthNum;
        }
      }
    });
    return labels;
  }, [weeks]);

  const totalCommitsInPeriod = useMemo(() => {
    return displayContributions.reduce((acc, curr) => acc + (curr.count || 0), 0);
  }, [displayContributions]);

  // Color mappings for levels 0 to 4 in light and dark mode
  const getCellColor = (level) => {
    switch (level) {
      case 4:
        return 'bg-[#39d353] dark:bg-[#39d353] border-[#2ea043]';
      case 3:
        return 'bg-[#26a641] dark:bg-[#26a641] border-[#1b8030]';
      case 2:
        return 'bg-[#40c463] dark:bg-[#006d32] border-[#2da44e] dark:border-[#015627]';
      case 1:
        return 'bg-[#9be9a8] dark:bg-[#0e4429] border-[#82d68f] dark:border-[#0a3620]';
      default:
        return 'bg-[#ebedf0] dark:bg-[#161b22] border-transparent';
    }
  };

  return (
    <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-5 sm:p-6 shadow-sm hover:shadow-subtle transition-all duration-200">
      {/* Calendar header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-500" />
              Contributions Calendar
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              {totalCommitsInPeriod.toLocaleString()} contributions
            </span>
          </div>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted mt-0.5">
            Activity mapping across all tracked public commits and branches
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {['Past Year', '2026', '2025'].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                selectedYear === year
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap grid container */}
      <div className="relative overflow-x-auto pb-2 pt-1">
        <div className="min-w-[760px]">
          {/* Month labels */}
          <div className="flex text-[10px] font-mono text-gh-lightMuted dark:text-gh-darkMuted mb-2 pl-7 relative h-4">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `${m.weekIndex * 14 + 28}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5">
            {/* Day of week labels */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-gh-lightMuted dark:text-gh-darkMuted pr-2 select-none h-[98px]">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks columns */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => (
                    <button
                      key={day.date || dIdx}
                      onMouseEnter={() => setHoveredCell(day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => setHoveredCell(day)}
                      aria-label={`${day.count || 0} contributions on ${day.date}`}
                      className={`w-[11px] h-[11px] rounded-[2px] border transition-transform duration-100 hover:scale-125 focus:outline-none focus:ring-1 focus:ring-emerald-400 ${getCellColor(
                        day.level
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer info: Legend & Hover Details */}
      <div className="mt-3.5 pt-3.5 border-t border-gh-lightBorder dark:border-gh-darkBorder flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Tooltip detail bar */}
        <div className="h-5 flex items-center gap-2 text-gh-lightText dark:text-gh-darkText font-mono text-[11px]">
          {hoveredCell ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 animate-fade-in">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong>{hoveredCell.count} {hoveredCell.count === 1 ? 'commit' : 'commits'}</strong> on{' '}
              {new Date(hoveredCell.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          ) : (
            <span className="text-gh-lightMuted dark:text-gh-darkMuted flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Hover or tap any cell to view daily commit breakdown
            </span>
          )}
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-2 text-gh-lightMuted dark:text-gh-darkMuted text-[11px]">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#ebedf0] dark:bg-[#161b22] border border-gh-lightBorder dark:border-gh-darkBorder"></span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#9be9a8] dark:bg-[#0e4429]"></span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#40c463] dark:bg-[#006d32]"></span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#26a641] dark:bg-[#26a641]"></span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#39d353] dark:bg-[#39d353]"></span>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
