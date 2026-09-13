import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, BookMarked, ExternalLink, Star, GitFork, Sparkles } from 'lucide-react';
import RepositoryCard from '../components/dashboard/RepositoryCard';
import RepositoryModal from '../components/dashboard/RepositoryModal';
import { SAMPLE_REPOSITORIES } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

export default function RepositoriesPage() {
  const { monitoredUsername, isDemoMode } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('stars'); // 'stars' | 'updated' | 'name'
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract unique languages
  const languages = useMemo(() => {
    const list = ['All', ...new Set(SAMPLE_REPOSITORIES.map(r => r.language).filter(Boolean))];
    return list;
  }, []);

  // Filter and sort
  const filteredRepos = useMemo(() => {
    let result = SAMPLE_REPOSITORIES.filter(repo => {
      const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        repo.name.toLowerCase().includes(q) ||
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.topics && repo.topics.some(t => t.toLowerCase().includes(q)));
      return matchesLang && matchesQuery;
    });

    return result.sort((a, b) => {
      if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
      if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, selectedLanguage, sortBy]);

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <BookMarked className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-gh-lightText dark:text-gh-darkText">
                Monitored Repositories
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Open source tools, distributed systems, and production services maintained by <span className="font-mono text-emerald-500 font-medium">@{monitoredUsername}</span>.
            </p>
          </div>

          <a
            href={`https://github.com/${monitoredUsername}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-medium rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gh-lightMuted dark:text-gh-darkMuted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by repo name, tag, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Language dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gh-lightMuted dark:text-gh-darkMuted hidden md:inline">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gh-lightMuted dark:text-gh-darkMuted hidden md:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="stars">Most Stars</option>
              <option value="updated">Recently Updated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-gh-lightBorder dark:border-gh-darkBorder bg-white/50 dark:bg-gh-darkPanel/50">
          <BookMarked className="w-10 h-10 text-gh-lightMuted dark:text-gh-darkMuted mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-1">
            No Repositories Found
          </h4>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted">
            Try adjusting your search criteria or language filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onSelect={handleSelectRepo}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <RepositoryModal
        repo={selectedRepo}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRepo(null);
        }}
      />
    </div>
  );
}
