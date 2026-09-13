import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, RefreshCw, AlertCircle, GitFork, BookOpen } from 'lucide-react';
import ProfileCard from '../components/dashboard/ProfileCard';
import StatsCard from '../components/dashboard/StatsCard';
import ContributionCalendar from '../components/dashboard/ContributionCalendar';
import CommitActivityChart from '../components/dashboard/CommitActivityChart';
import LanguageBreakdown from '../components/dashboard/LanguageBreakdown';
import RecentCommits from '../components/dashboard/RecentCommits';
import RepositoryCard from '../components/dashboard/RepositoryCard';
import RepositoryModal from '../components/dashboard/RepositoryModal';
import Skeleton from '../components/common/Skeleton';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserProfile,
  fetchUserRepositories,
  fetchRecentEvents,
  SAMPLE_CONTRIBUTIONS,
  SAMPLE_WEEKLY_ACTIVITY,
  SAMPLE_MONTHLY_ACTIVITY,
  SAMPLE_LANGUAGES,
} from '../services/githubApi';

export default function DashboardPage({ onNavigate }) {
  const { monitoredUsername, isDemoMode, ownerToken, setIsAuthModalOpen } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [reposData, setReposData] = useState([]);
  const [commitsData, setCommitsData] = useState([]);
  const [isLiveProfile, setIsLiveProfile] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        if (isDemoMode) {
          const userRes = await fetchUserProfile(null);
          const reposRes = await fetchUserRepositories(null);
          const commitsRes = await fetchRecentEvents(null);
          if (isMounted) {
            setProfileData(userRes.data);
            setReposData(reposRes.data);
            setCommitsData(commitsRes.data);
            setIsLiveProfile(false);
          }
        } else {
          const [userRes, reposRes, commitsRes] = await Promise.all([
            fetchUserProfile(monitoredUsername, ownerToken),
            fetchUserRepositories(monitoredUsername, ownerToken),
            fetchRecentEvents(monitoredUsername, ownerToken),
          ]);
          if (isMounted) {
            setProfileData(userRes.data);
            setReposData(reposRes.data);
            setCommitsData(commitsRes.data);
            setIsLiveProfile(userRes.isLive);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [monitoredUsername, isDemoMode, ownerToken]);

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setIsRepoModalOpen(true);
  };

  if (loading || !profileData) {
    return (
      <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" count={4} />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Notice Banner if Demo Mode */}
      {isDemoMode && (
        <div className="p-3 sm:p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Sample Demo Mode Active:</strong> Displaying realistic data for <span className="font-mono font-semibold">@{profileData.username}</span> to showcase complete streak & calendar metrics.
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs whitespace-nowrap shadow-sm transition-colors"
          >
            Monitor Your Own Account
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <ProfileCard
        profile={profileData}
        isLive={isLiveProfile}
        onConnectClick={() => setIsAuthModalOpen(true)}
      />

      {/* Key Metrics / Streak Stats Grid */}
      <StatsCard profile={profileData} />

      {/* 52-Week Contributions Calendar */}
      <ContributionCalendar contributions={SAMPLE_CONTRIBUTIONS} />

      {/* Analytics Charts & Language Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommitActivityChart
            weeklyData={SAMPLE_WEEKLY_ACTIVITY}
            monthlyData={SAMPLE_MONTHLY_ACTIVITY}
          />
        </div>
        <div>
          <LanguageBreakdown languages={SAMPLE_LANGUAGES} />
        </div>
      </div>

      {/* Recent Commits Feed & Top Repositories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-500" />
              Featured Repositories
            </h3>
            <button
              onClick={() => onNavigate('repositories')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View all {reposData.length} repos <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reposData.slice(0, 4).map((repo) => (
              <RepositoryCard
                key={repo.id}
                repo={repo}
                onSelect={handleSelectRepo}
              />
            ))}
          </div>
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
      />
    </div>
  );
}
