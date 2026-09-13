import React from 'react';

export default function Skeleton({ className = '', count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={`animate-pulse rounded bg-gray-200 dark:bg-gh-darkCard ${className}`}
        />
      ))}
    </>
  );
}
