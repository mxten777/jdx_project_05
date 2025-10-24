import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import TeamBalancerPage from './pages/TeamBalancerPage';
import TeamInfoManagerPage from './pages/TeamInfoManagerPage';
import TeamDashboardStatsPage from './pages/TeamDashboardStatsPage';

const AppRouter: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <AppHeader />
    <main className="flex-1 flex flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<TeamBalancerPage />} />
        <Route path="/team-info" element={<TeamInfoManagerPage />} />
        <Route path="/dashboard" element={<TeamDashboardStatsPage />} />
      </Routes>
    </main>
    <AppFooter />
  </div>
);

export default AppRouter;
