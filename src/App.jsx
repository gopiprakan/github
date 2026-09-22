import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JournalProvider } from './context/JournalContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import JournalPage from './pages/JournalPage';
import RepositoriesPage from './pages/RepositoriesPage';
import ConnectGitHubModal from './components/auth/ConnectGitHubModal';

function MainApp() {
  const [activePage, setActivePage] = useState('home');
  const { monitoredUsername } = useAuth();

  // Dynamic SEO Page Title & Meta description update
  React.useEffect(() => {
    let title = 'CommitStreak — Daily GitHub Coding Streak Monitor & Developer Portfolio';
    let description = 'Track your daily GitHub coding streaks, analyze commit habits, inspect language analytics, showcase repositories, and document your engineering journey with CommitStreak.';

    switch (activePage) {
      case 'dashboard':
        title = monitoredUsername 
          ? `@${monitoredUsername}'s GitHub Streak & Activity Dashboard | CommitStreak` 
          : 'GitHub Activity Dashboard & Analytics | CommitStreak';
        description = `Inspect real-time GitHub commit velocity, streak heatmap, and programming language statistics for ${monitoredUsername || 'developers'}.`;
        break;
      case 'repositories':
        title = monitoredUsername
          ? `@${monitoredUsername}'s Top Repositories & Portfolio | CommitStreak`
          : 'GitHub Repositories & Portfolio Showcase | CommitStreak';
        description = `Browse starred, active, and featured open-source repositories and tech stack metrics for ${monitoredUsername || 'developers'}.`;
        break;
      case 'journal':
        title = 'Daily Engineering Dev Journal & Notes | CommitStreak';
        description = 'Maintain daily developer logs, track engineering milestones, and document coding achievements.';
        break;
      case 'home':
      default:
        title = 'CommitStreak — Daily GitHub Coding Streak Monitor & Developer Portfolio';
        description = 'Track your daily GitHub coding streaks, analyze commit habits, showcase repositories, and document your engineering journey with CommitStreak.';
        break;
    }

    document.title = title;

    // Update meta description tag dynamically
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }, [activePage, monitoredUsername]);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'journal':
        return <JournalPage />;
      case 'repositories':
        return <RepositoriesPage />;
      case 'home':
      default:
        return <HomePage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gh-lightBg dark:bg-gh-darkBg text-gh-lightText dark:text-gh-darkText transition-colors duration-200">
      {/* Sticky top navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main page view */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActivePage} />

      {/* Owner GitHub Authentication & Switch Modal */}
      <ConnectGitHubModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JournalProvider>
          <MainApp />
        </JournalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
