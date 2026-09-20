import React, { useState } from 'react';
import { Github, Menu, X, BookOpen, GitFork, LayoutDashboard, Search, UserCheck } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import Badge from '../common/Badge';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { isAuthenticated, monitoredUsername, setIsAuthModalOpen, switchMonitoredUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quickUser, setQuickUser] = useState('');

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

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickUser.trim()) {
      switchMonitoredUser(quickUser.trim());
      setQuickUser('');
      setActivePage('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightPanel/90 dark:bg-gh-darkPanel/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Professional Logo */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => handleNavClick('home')}
              className="group text-left transition-all"
            >
              <Logo size="md" showSubtitle={true} />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-2">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200/80 dark:border-emerald-800/60'
                        : 'text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText hover:bg-gray-100/80 dark:hover:bg-gh-darkCard'
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick user lookup input (desktop) */}
            <form onSubmit={handleQuickSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Lookup user..."
                value={quickUser}
                onChange={(e) => setQuickUser(e.target.value)}
                className="w-40 pl-7 pr-2.5 py-1 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText placeholder:text-gh-lightMuted focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gh-lightMuted absolute left-2 top-2 pointer-events-none" />
            </form>

            {/* Monitored User Badge */}
            {monitoredUsername ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 shadow-sm hover:border-emerald-500 transition-all"
                title="Currently monitoring"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>@{monitoredUsername}</span>
              </button>
            ) : (
              <span className="hidden sm:inline-flex text-[11px] font-mono text-gh-lightMuted dark:text-gh-darkMuted">
                No user selected
              </span>
            )}

            {/* Connect GitHub Button */}
            <button
              id="nav-connect-github-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                isAuthenticated
                  ? 'bg-gh-lightBg dark:bg-gh-darkCard border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:border-emerald-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAuthenticated ? `@${monitoredUsername}` : (monitoredUsername ? 'Change Account' : 'Connect GitHub')}
              </span>
              <span className="sm:hidden">
                {isAuthenticated ? 'Connected' : 'Account'}
              </span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-1.5 rounded-md text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightPanel dark:bg-gh-darkPanel px-4 py-2.5 space-y-1.5 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${
                activePage === item.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard'
              }`}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gh-lightBorder dark:border-gh-darkBorder flex items-center justify-between text-xs px-1">
            <span className="text-gh-lightMuted dark:text-gh-darkMuted">Monitored:</span>
            <span className="font-mono font-semibold text-emerald-500">
              {monitoredUsername ? `@${monitoredUsername}` : 'None (Click Connect)'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
