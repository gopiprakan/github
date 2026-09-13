import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CommitActivityChart({ weeklyData = [], monthlyData = [] }) {
  const [view, setView] = useState('weekly'); // 'weekly' | 'monthly'
  const { isDark } = useTheme();

  const gridColor = isDark ? '#30363d' : '#e1e4e8';
  const textColor = isDark ? '#8b949e' : '#57606a';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-lg text-xs font-mono">
          <p className="font-semibold text-gh-lightText dark:text-gh-darkText mb-1">{label}</p>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <span>Commits:</span>
            <strong>{payload[0].value}</strong>
          </div>
          {payload[1] && (
            <div className="flex items-center gap-2 text-blue-500 mt-0.5">
              <span>{payload[1].name}:</span>
              <strong>{payload[1].value}</strong>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gh-lightBorder dark:border-gh-darkBorder mb-5">
        <div>
          <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            Commit Activity & Cadence
          </h3>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted mt-0.5">
            Distribution of code volume across workdays and calendar months
          </p>
        </div>

        {/* View toggle */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-gh-darkCard p-1 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setView('weekly')}
            className={`px-3 py-1 rounded-lg transition-all ${
              view === 'weekly'
                ? 'bg-white dark:bg-gh-darkPanel text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            Weekly Cadence
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1 rounded-lg transition-all ${
              view === 'monthly'
                ? 'bg-white dark:bg-gh-darkPanel text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
            }`}
          >
            Monthly Trend
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        {view === 'weekly' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="commits" name="Commits" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="commits"
                name="Commits"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#commitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gh-lightBorder dark:border-gh-darkBorder flex items-center justify-between text-[11px] text-gh-lightMuted dark:text-gh-darkMuted">
        <span>Highest concentration: Wednesday (mid-week release cycle)</span>
        <span className="font-mono text-emerald-500">Peak: 182 commits/mo</span>
      </div>
    </div>
  );
}
