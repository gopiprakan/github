import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookMarked,
  ExternalLink,
  Star,
  GitFork,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Plus,
  Code,
  Settings,
  Key,
  CheckCircle2,
} from 'lucide-react';
import RepositoryCard from '../components/dashboard/RepositoryCard';
import RepositoryModal from '../components/dashboard/RepositoryModal';
import RepoFileManagerModal from '../components/repository/RepoFileManagerModal';
import CreateRepoModal from '../components/repository/CreateRepoModal';
import EditRepoModal from '../components/repository/EditRepoModal';
import Skeleton from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { fetchUserRepositories } from '../services/githubApi';

export default function RepositoriesPage() {
  const { monitoredUsername, ownerToken, setIsAuthModalOpen, switchMonitoredUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('updated'); // 'stars' | 'updated' | 'name'

  // Modals state
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fileManagerRepo, setFileManagerRepo] = useState(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const [editSettingsRepo, setEditSettingsRepo] = useState(null);
  const [isEditSettingsOpen, setIsEditSettingsOpen] = useState(false);

  const [isCreateRepoOpen, setIsCreateRepoOpen] = useState(false);
  const [newHandle, setNewHandle] = useState('');

  const loadRepos = async (user) => {
    if (!user || !user.trim()) {
      setRepositories([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchUserRepositories(user, ownerToken);
      setRepositories(res.data || []);
    } catch (err) {
      console.error('Failed to load repositories:', err);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (monitoredUsername) {
      loadRepos(monitoredUsername);
    } else {
      setRepositories([]);
    }
  }, [monitoredUsername, ownerToken]);

  const languages = useMemo(() => {
    const list = ['All', ...new Set(repositories.map(r => r.language).filter(Boolean))];
    return list;
  }, [repositories]);

  const filteredRepos = useMemo(() => {
    let result = repositories.filter(repo => {
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
  }, [repositories, searchQuery, selectedLanguage, sortBy]);

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const handleOpenFileManager = (repo) => {
    setFileManagerRepo(repo);
    setIsFileManagerOpen(true);
  };

  const handleOpenEditSettings = (repo) => {
    setEditSettingsRepo(repo);
    setIsEditSettingsOpen(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (newHandle.trim()) {
      switchMonitoredUser(newHandle.trim());
      setNewHandle('');
    }
  };

  const handleRepoCreated = (newRepo) => {
    loadRepos(monitoredUsername);
  };

  const handleRepoUpdated = () => {
    loadRepos(monitoredUsername);
  };

  const handleRepoDeleted = (deletedName) => {
    setRepositories(prev => prev.filter(r => r.name !== deletedName));
  };

  if (!monitoredUsername) {
    return (
      <div className="py-10 max-w-lg mx-auto px-4 text-center">
        <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 sm:p-8 shadow-subtle space-y-4">
          <BookMarked className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-gh-lightText dark:text-gh-darkText">Explore & Edit Repositories</h3>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
            Enter any GitHub username to view, explore, and edit repositories and source code files.
          </p>
          <form onSubmit={handleUserSubmit} className="flex gap-2 max-w-xs mx-auto">
            <input
              type="text"
              placeholder="e.g. gopiprakan"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-150"
            >
              Load
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Header */}
      <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-5 sm:p-6 shadow-sm hover:shadow-subtle transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
                <BookMarked className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gh-lightText dark:text-gh-darkText">
                Repositories ({repositories.length})
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted leading-relaxed">
              Browse, view files, code and commit live changes directly to GitHub for <span className="font-mono text-emerald-500 font-medium">@{monitoredUsername}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* New Repo CTA */}
            <button
              onClick={() => setIsCreateRepoOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all duration-150"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Repository</span>
            </button>

            <button
              onClick={() => loadRepos(monitoredUsername)}
              title="Refresh repositories"
              className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder hover:bg-gray-50 dark:hover:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText flex items-center gap-1.5 transition-all duration-150"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>

            <a
              href={`https://github.com/${monitoredUsername}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard transition-all duration-150 flex items-center justify-center gap-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gh-lightMuted dark:text-gh-darkMuted absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Language dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gh-lightMuted dark:text-gh-darkMuted hidden md:inline text-[11px]">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2 py-1 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gh-lightMuted dark:text-gh-darkMuted hidden md:inline text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <Skeleton className="h-44 rounded-lg" count={6} />
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="p-10 text-center rounded-lg border border-dashed border-gh-lightBorder dark:border-gh-darkBorder bg-white/50 dark:bg-gh-darkPanel/50 space-y-2.5">
          <BookMarked className="w-8 h-8 text-gh-lightMuted dark:text-gh-darkMuted mx-auto mb-1 opacity-60" />
          <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText">
            No Repositories Found
          </h4>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted max-w-sm mx-auto">
            {searchQuery || selectedLanguage !== 'All' 
              ? 'Try adjusting your search criteria or language filter.' 
              : `No public repositories found for @${monitoredUsername}. You can create one now.`}
          </p>
          <button
            onClick={() => setIsCreateRepoOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5 transition-all duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Repository</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onSelect={handleSelectRepo}
              onEditFiles={handleOpenFileManager}
              onEditSettings={handleOpenEditSettings}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      <RepositoryModal
        repo={selectedRepo}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRepo(null);
        }}
        onEditFiles={handleOpenFileManager}
        onEditSettings={handleOpenEditSettings}
      />

      {/* File Explorer & Code Editor Modal */}
      <RepoFileManagerModal
        repo={fileManagerRepo}
        isOpen={isFileManagerOpen}
        onClose={() => {
          setIsFileManagerOpen(false);
          setFileManagerRepo(null);
        }}
        onRepoUpdated={handleRepoUpdated}
      />

      {/* Create Repository Modal */}
      <CreateRepoModal
        isOpen={isCreateRepoOpen}
        onClose={() => setIsCreateRepoOpen(false)}
        onRepoCreated={handleRepoCreated}
      />

      {/* Edit Repository Settings Modal */}
      <EditRepoModal
        repo={editSettingsRepo}
        isOpen={isEditSettingsOpen}
        onClose={() => {
          setIsEditSettingsOpen(false);
          setEditSettingsRepo(null);
        }}
        onRepoUpdated={handleRepoUpdated}
        onRepoDeleted={handleRepoDeleted}
      />
    </div>
  );
}
