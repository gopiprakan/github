import React from 'react';
import { Github, Shield, Code2, ExternalLink } from 'lucide-react';
import Badge from '../common/Badge';
import Logo from '../common/Logo';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightPanel dark:bg-gh-darkPanel/60 text-gh-lightMuted dark:text-gh-darkMuted transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gh-lightBorder dark:border-gh-darkBorder">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <Logo size="sm" showSubtitle={false} />
              <Badge variant="emerald" size="xs">v1.0 Live</Badge>
            </div>
            <p className="text-xs max-w-md leading-relaxed">
              Code every day. Track your progress. Build your future. A developer activity monitor and transparent public portfolio built for consistency.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                <Shield className="w-3 h-3" /> Read-only Public Visitor Mode
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Code2 className="w-3 h-3" /> Open Ecosystem
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-gh-lightText dark:text-gh-darkText uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate?.('home')}
                  className="hover:text-emerald-500 transition-colors duration-150"
                >
                  Overview & Landing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('dashboard')}
                  className="hover:text-emerald-500 transition-colors duration-150"
                >
                  Activity Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('journal')}
                  className="hover:text-emerald-500 transition-colors duration-150"
                >
                  Daily Coding Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('repositories')}
                  className="hover:text-emerald-500 transition-colors duration-150"
                >
                  Repository Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech & Architecture */}
          <div>
            <h4 className="text-xs font-semibold text-gh-lightText dark:text-gh-darkText uppercase tracking-wider mb-3">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1">
                <span>React 18 & Vite</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Tailwind CSS & Recharts</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Vercel Serverless / Express</span>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gh-lightText dark:text-gh-darkText hover:text-emerald-500 transition-colors duration-150"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub REST & OAuth
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p>© {new Date().getFullYear()} CommitStreak. Built for developers committed to continuous improvement.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with precision</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Zero-error Vercel build</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
