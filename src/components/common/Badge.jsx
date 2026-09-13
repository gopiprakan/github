import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const base = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const variants = {
    default: "bg-gray-100 dark:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted border border-gh-lightBorder dark:border-gh-darkBorder",
    emerald: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60",
    blue: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60",
    amber: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60",
    purple: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60",
    outline: "bg-transparent border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightMuted dark:text-gh-darkMuted",
  };

  return (
    <span className={`${base} ${sizes[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
