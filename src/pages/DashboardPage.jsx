import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, RefreshCw, AlertCircle, GitFork, BookOpen, Search, Github, ShieldCheck, Flame } from 'lucide-react';
import ProfileCard from '../components/dashboard/ProfileCard';
import StatsCard from '../components/dashboard/StatsCard';
import ContributionCalendar from '../components/dashboard/ContributionCalendar';
import CommitActivityChart from '../components/dashboard/CommitActivityChart';
import LanguageBreakdown from '../components/dashboard/LanguageBreakdown';
import RecentCommits from '../components/dashboard/RecentCommits';
import RepositoryCard from '../components/dashboard/RepositoryCard';
import RepositoryModal from '../components/dashboard/RepositoryModal';
import RepoFileManagerModal from '../components/repository/RepoFileManagerModal';
import EditRepoModal from '../components/repository/EditRepoModal';
import Skeleton from '../components/common/Skeleton';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserProfile,
  fetchUserRepositories,
  fetchRecentEvents,
  calculateLanguageBreakdown,
  calculateActivityAndContributions,
  fetchUserContributions,
} from '../services/githubApi';

export default function DashboardPage({ onNavigate }) {
  const { monitoredUsername, ownerToken, setIsAuthModalOpen, switchMonitoredUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [reposData, setReposData] = useState([]);
  const [commitsData, setCommitsData] = useState([]);
  const [languagesData, setLanguagesData] = useState([]);
  const [activityMetrics, setActivityMetrics] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const [fileManagerRepo, setFileManagerRepo] = useState(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [editSettingsRepo, setEditSettingsRepo] = useState(null);
  const [isEditSettingsOpen, setIsEditSettingsOpen] = useState(false);
  const [searchHandle, setSearchHandle] = useState('');

  const loadData = async (userToLoad) => {
    if (!userToLoad || !userToLoad.trim()) {
      setProfileData(null);
      setReposData([]);
      setCommitsData([]);
      setLanguagesData([]);
      setActivityMetrics(null);
      setFetchError(null);
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const [userRes, reposRes, eventsRes] = await Promise.all([
        fetchUserProfile(userToLoad, ownerToken),
        fetchUserRepositories(userToLoad, ownerToken),
        fetchRecentEvents(userToLoad, ownerToken),
      ]);

      if (!userRes.data) {
        setFetchError(userRes.error || `Could not find GitHub user "@${userToLoad}". Please verify the username.`);
        setProfileData(null);
        setReposData([]);
        setCommitsData([]);
        return;
      }

      const repos = reposRes.data || [];
      const commits = eventsRes.data || [];
      const languages = calculateLanguageBreakdown(repos);
      const metrics = await fetchUserContributions(userToLoad, commits, repos, ownerToken);

      const enrichedProfile = {
        ...userRes.data,
        currentStreak: metrics.currentStreak,
        longestStreak: metrics.longestStreak,
        totalCommitsYear: metrics.totalCommitsYear,
        activeDaysThisYear: metrics.activeDaysThisYear,
        streakStatus: metrics.streakStatus,
        streakMessage: metrics.streakMessage,
        todayCount: metrics.todayCount,
        yesterdayCount: metrics.yesterdayCount,
      };

      setProfileData(enrichedProfile);
      setReposData(repos);
      setCommitsData(commits);
      setLanguagesData(languages);
      setActivityMetrics(metrics);
    } catch (err) {
      console.error('Failed to load GitHub dashboard data:', err);
      setFetchError(err.message || 'An error occurred while fetching GitHub data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (monitoredUsername) {
      loadData(monitoredUsername);
    } else {
      setProfileData(null);
    }
  }, [monitoredUsername, ownerToken]);

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setIsRepoModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchHandle.trim()) {
      switchMonitoredUser(searchHandle.trim());
      setSearchHandle('');
    }
  };

  // State 1: No user configured yet (New User Welcome State)
  if (!monitoredUsername && !loading) {
    return (
      <div className="py-10 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-6 sm:p-10 shadow-subtle text-center space-y-5">
          <div className="w-12 h-12 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Github className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-gh-lightText dark:text-gh-darkText">
              Enter GitHub Account to Monitor
            </h2>
            <p className="text-xs sm:text-sm text-gh-lightMuted dark:text-gh-darkMuted max-w-md mx-auto">
              Please enter your GitHub username or connect your GitHub account to see live repositories, recent commit streams, streaks, and analytics.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-sm mx-auto">
            <div className="flex items-center gap-2 p-1 rounded-md border-2 border-emerald-500/50 bg-gh-lightBg dark:bg-gh-darkCard focus-within:border-emerald-500 transition-all duration-150">
              <span className="pl-2.5 text-gh-lightMuted dark:text-gh-darkMuted font-mono text-xs">@</span>
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="e.g. gopiprakan, torvalds..."
                className="flex-1 px-1.5 py-1.5 text-xs bg-transparent text-gh-lightText dark:text-gh-darkText placeholder:text-gh-lightMuted focus:outline-none font-mono font-medium"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-all duration-150"
              >
                <span>Load Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-gh-lightBorder dark:border-gh-darkBorder flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-150"
            >
              <Github className="w-4 h-4" />
              <span>Connect with GitHub OAuth</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Loading State
  if (loading) {
    return (
      <div className="space-y-4 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40 rounded-md" />
          <Skeleton className="h-7 w-28 rounded-md" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Skeleton className="h-24 rounded-lg" count={4} />
        </div>
        <Skeleton className="h-56 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 rounded-lg lg:col-span-2" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  // State 3: Error State
  if (fetchError || !profileData) {
    const isNotFound = fetchError && fetchError.toLowerCase().includes('not found');
    const isRateLimit = fetchError && fetchError.toLowerCase().includes('rate limit');

    return (
      <div className="py-10 max-w-lg mx-auto px-4">
        <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-5 sm:p-7 text-center space-y-3.5 shadow-sm">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-red-700 dark:text-red-400">
            {isNotFound ? 'User Profile Not Found' : isRateLimit ? 'GitHub API Rate Limit Reached' : 'Unable to Load Profile'}
          </h3>
          <p className="text-xs text-red-600 dark:text-red-300 max-w-md mx-auto leading-relaxed">
            {fetchError || `Could not find any public GitHub user named "${monitoredUsername}".`}
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-xs mx-auto pt-1 flex gap-2">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={searchHandle}
              onChange={(e) => setSearchHandle(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-150"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => loadData(monitoredUsername)}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkPanel flex items-center gap-1.5 transition-all duration-150"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-150"
            >
              Account Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Active Dashboard View with Real Data
  return (
    <div className="space-y-4 py-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top search & switch user bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-2.5 rounded-lg border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel shadow-sm">
        <div className="flex items-center gap-2 text-xs text-gh-lightMuted dark:text-gh-darkMuted pl-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>
            Active monitor: <strong className="text-gh-lightText dark:text-gh-darkText font-mono">@{profileData.username}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex-1 sm:w-56 relative">
            <input
              type="text"
              placeholder="Switch GitHub user..."
              value={searchHandle}
              onChange={(e) => setSearchHandle(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
            />
            <Search className="w-3.5 h-3.5 text-gh-lightMuted absolute left-2 top-2 pointer-events-none" />
          </form>

          <button
            onClick={() => loadData(monitoredUsername)}
            title="Refresh GitHub data"
            className="p-1 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder hover:bg-gray-50 dark:hover:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted hover:text-emerald-500 transition-all duration-150"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <ProfileCard
        profile={profileData}
        isLive={true}
        onConnectClick={() => setIsAuthModalOpen(true)}
      />

      {/* Key Metrics / Streak Stats Grid */}
      <StatsCard profile={profileData} />

      {/* 52-Week Contributions Calendar */}
      {activityMetrics && (
        <ContributionCalendar contributions={activityMetrics.contributions} />
      )}

      {/* Analytics Charts & Language Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {activityMetrics && (
            <CommitActivityChart
              weeklyData={activityMetrics.weeklyCadence}
              monthlyData={activityMetrics.monthlyActivity}
            />
          )}
        </div>
        <div>
          <LanguageBreakdown languages={languagesData} />
        </div>
      </div>

      {/* Recent Commits Feed & Top Repositories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-500" />
              Public Repositories ({reposData.length})
            </h3>
            <button
              onClick={() => onNavigate('repositories')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-colors duration-150"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {reposData.length === 0 ? (
            <div className="p-6 rounded-lg border border-dashed border-gh-lightBorder dark:border-gh-darkBorder text-center text-xs text-gh-lightMuted dark:text-gh-darkMuted">
              No public repositories found for @{profileData.username}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {reposData.slice(0, 4).map((repo) => (
                <RepositoryCard
                  key={repo.id}
                  repo={repo}
                  onSelect={handleSelectRepo}
                  onEditFiles={(r) => {
                    setFileManagerRepo(r);
                    setIsFileManagerOpen(true);
                  }}
                  onEditSettings={(r) => {
                    setEditSettingsRepo(r);
                    setIsEditSettingsOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Commits Column */}
        <div>
          <RecentCommits commits={commitsData} />
        </div>
      </div>

      {/* Repository Detail Modal */}
      <RepositoryModal
        repo={selectedRepo}
        isOpen={isRepoModalOpen}
        onClose={() => {
          setIsRepoModalOpen(false);
          setSelectedRepo(null);
        }}
        onEditFiles={(r) => {
          setFileManagerRepo(r);
          setIsFileManagerOpen(true);
        }}
        onEditSettings={(r) => {
          setEditSettingsRepo(r);
          setIsEditSettingsOpen(true);
        }}
      />

      {/* File Explorer & Code Editor Modal */}
      <RepoFileManagerModal
        repo={fileManagerRepo}
        isOpen={isFileManagerOpen}
        onClose={() => {
          setIsFileManagerOpen(false);
          setFileManagerRepo(null);
        }}
        onRepoUpdated={() => loadData(monitoredUsername)}
      />

      {/* Edit Repository Settings Modal */}
      <EditRepoModal
        repo={editSettingsRepo}
        isOpen={isEditSettingsOpen}
        onClose={() => {
          setIsEditSettingsOpen(false);
          setEditSettingsRepo(null);
        }}
        onRepoUpdated={() => loadData(monitoredUsername)}
        onRepoDeleted={(deletedName) => {
          setReposData(prev => prev.filter(r => r.name !== deletedName));
        }}
      />
    </div>
  );
}
