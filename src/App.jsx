import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import InviteAuth from './components/InviteAuth';
import DesktopDashboard from './components/DesktopDashboard';
import PixModal from './components/PixModal';
import PublicProfile from './components/PublicProfile';
import dashboardBg from './assets/dashboard_bg.jpg';

function MainAppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [shareMode, setShareMode] = useState(null); // 'talent' or 'group'
  const [shareId, setShareId] = useState(null);

  // Responsive screen size listener and URL param routing
  useEffect(() => {
    // Check URL parameters for card sharing
    const params = new URLSearchParams(window.location.search);
    const talentId = params.get('talent');
    const groupId = params.get('group');
    if (talentId) {
      setShareMode('talent');
      setShareId(talentId);
    } else if (groupId) {
      setShareMode('group');
      setShareId(groupId);
    }

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (shareMode && shareId) {
    return (
      <PublicProfile 
        id={shareId} 
        type={shareMode} 
        onBack={() => {
          setShareMode(null);
          setShareId(null);
          window.history.replaceState({}, '', '/');
        }} 
      />
    );
  }

  if (!isAuthenticated) {
    return <InviteAuth onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Unified responsive layout rendering DesktopDashboard directly for all devices (hiding phone skins)
  return (
    <div className="app-container" style={{
      backgroundImage: `url(${dashboardBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      minHeight: '100vh',
      zIndex: 1
    }}>
      {/* Dark overlay backdrop for readability of panels */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: -1
      }} />

      {/* Main layout (no simulator drawer) */}
      <div className="responsive-layout" style={{ padding: isMobileView ? '12px' : '24px', zIndex: 2 }}>
        <main className="dashboard-section">
          <DesktopDashboard />
        </main>
      </div>

      <PixModal />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
