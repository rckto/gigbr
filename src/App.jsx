import React, { useState, useEffect, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import InviteAuth from './components/InviteAuth';
import DesktopDashboard from './components/DesktopDashboard';
import PixModal from './components/PixModal';
import PublicProfile from './components/PublicProfile';
import PublicOpportunity from './components/PublicOpportunity';
import dashboardBg from './assets/dashboard_bg.jpg';

function MainAppContent() {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('gigbr_user'));
  const [isMobileView, setIsMobileView] = useState(false);
  const [shareMode, setShareMode] = useState(null); // 'talent' or 'group'
  const [shareId, setShareId] = useState(null);

  // Sync authentication state with currentUser
  useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  // Inactivity automatic logout (30 minutes)
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    let inactivityTimeout;
    const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        console.log("Session expired due to inactivity.");
        alert("Sua sessão expirou por inatividade. Faça o login novamente.");
        setCurrentUser(null);
      }, INACTIVITY_TIME);
    };

    // Events to track user activity
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'click', 'scroll', 'touchstart'];
    
    // Register event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup listeners and timer
    return () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, currentUser, setCurrentUser]);

  // Responsive screen size listener and URL param routing
  useEffect(() => {
    // Check URL parameters for card sharing
    const params = new URLSearchParams(window.location.search);
    const talentId = params.get('talent');
    const groupId = params.get('group');
    const opportunityCode = params.get('opportunity');
    if (talentId) {
      setShareMode('talent');
      setShareId(talentId);
    } else if (groupId) {
      setShareMode('group');
      setShareId(groupId);
    } else if (opportunityCode) {
      setShareMode('opportunity');
      setShareId(opportunityCode);
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
    if (shareMode === 'opportunity') {
      return (
        <PublicOpportunity 
          code={shareId} 
          onBack={() => {
            setShareMode(null);
            setShareId(null);
            window.history.replaceState({}, '', '/');
          }} 
        />
      );
    }
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
