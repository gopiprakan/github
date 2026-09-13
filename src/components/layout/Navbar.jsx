import React, { useState } from 'react';
import { Flame, Github, Menu, X, BookOpen, GitFork, LayoutDashboard, Sparkles, UserCheck } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { isAuthenticated, monitoredUsername, isDemoMode, setIsAuthModalOpen } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: 'Daily Journal', icon: BookOpen },
    { id: 'repositories', label: 'Repositories', icon: GitFork },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightPanel/90 dark:bg-gh-darkPanel/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-gh-lightText dark:text-gh-darkText flex items-center gap-1.5">
                  Commit<span className="text-emerald-500">Streak</span>
                </span>
                <span className="block text-[10px] font-mono text-gh-lightMuted dark:text-gh-darkMuted -mt-0.5">
                  daily coding monitor
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                        : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText hover:bg-gray-100 dark:hover:bg-gh-darkCard'
                    }`}
                  >
                    {item.icon && <item.icon className="w-3.5 h-3.5" />}
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Streak Pill */}
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 shadow-sm animate-streak-pulse"
              title="Active consecutive coding streak"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>47 DAYS</span>
            </div>

            {/* Demo / Live Indicator */}
            <Badge
              variant={isDemoMode ? 'default' : 'emerald'}
              size="xs"
              className="hidden lg:inline-flex"
            >
              {isDemoMode ? 'Sample Mode' : `Live: @${monitoredUsername}`}
            </Badge>

            {/* Connect GitHub Button */}
            <button
              id="nav-connect-github-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                isAuthenticated
                  ? 'bg-gh-lightBg dark:bg-gh-darkCard border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:border-emerald-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAuthenticated ? `@${monitoredUsername}` : 'Connect GitHub'}
              </span>
              <span className="sm:hidden">
                {isAuthenticated ? 'Owner' : 'Connect'}
              </span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightPanel dark:bg-gh-darkPanel px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activePage === item.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gh-lightBorder dark:border-gh-darkBorder flex items-center justify-between text-xs px-1">
            <span className="text-gh-lightMuted dark:text-gh-darkMuted">Current Streak:</span>
            <span className="font-mono font-bold text-emerald-500">47 Days Active 🔥</span>
          </div>
        </div>
      )}
    </header>
  );
}
