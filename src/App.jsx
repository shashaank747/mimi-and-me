// ============================================================
// MIMI & ME — App.jsx (Root with Routing)
// ============================================================
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileManager } from './systems/ProfileManager.js';

// Eager-load Profile and Home (always needed)
import ProfilePage from './pages/Profile.jsx';
import Home from './pages/Home.jsx';

// Lazy-load everything else (code splitting per route)
const Adventure    = lazy(() => import('./pages/Adventure.jsx'));
const Play         = lazy(() => import('./pages/Play.jsx'));
const Achievements = lazy(() => import('./pages/Achievements.jsx'));
const Rewards      = lazy(() => import('./pages/Rewards.jsx'));
const Settings     = lazy(() => import('./pages/Settings.jsx'));
const Letters      = lazy(() => import('./pages/Letters.jsx'));
const Numbers      = lazy(() => import('./pages/Numbers.jsx'));
const Math         = lazy(() => import('./pages/Math.jsx'));

// Loading spinner while lazy chunks load
function GameLoader() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      fontFamily: 'Nunito, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#FF6B6B',
    }}>
      <div style={{ fontSize: '4rem', animation: 'bounce 1.5s ease-in-out infinite' }}>🐰</div>
      Loading...
    </div>
  );
}

// Route guard — redirect to profile select if no active profile
function RequireProfile({ children }) {
  const profile = ProfileManager.getActive();
  if (!profile) return <Navigate to="/profile-select" replace />;
  return children;
}

export default function App() {
  const profiles = ProfileManager.getAll();
  const activeProfile = ProfileManager.getActive();

  // Determine initial route
  const initialRoute = profiles.length === 0
    ? '/profile-select'
    : activeProfile ? '/home' : '/profile-select';

  return (
    <BrowserRouter>
      <Suspense fallback={<GameLoader />}>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to={initialRoute} replace />} />

          {/* Profile */}
          <Route path="/profile-select" element={<ProfilePage />} />

          {/* Protected routes */}
          <Route path="/home" element={<RequireProfile><Home /></RequireProfile>} />
          <Route path="/adventure" element={<RequireProfile><Adventure /></RequireProfile>} />
          <Route path="/play/:levelId" element={<RequireProfile><Play /></RequireProfile>} />
          <Route path="/letters" element={<RequireProfile><Letters /></RequireProfile>} />
          <Route path="/numbers" element={<RequireProfile><Numbers /></RequireProfile>} />
          <Route path="/math" element={<RequireProfile><Math /></RequireProfile>} />
          <Route path="/achievements" element={<RequireProfile><Achievements /></RequireProfile>} />
          <Route path="/rewards" element={<RequireProfile><Rewards /></RequireProfile>} />
          <Route path="/settings" element={<RequireProfile><Settings /></RequireProfile>} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to={initialRoute} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
