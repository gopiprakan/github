import React, { useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
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

      {/* Vercel Speed Insights */}
      <SpeedInsights />
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
