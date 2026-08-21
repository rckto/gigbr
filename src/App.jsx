import React, { useState, useEffect, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import InviteAuth from './components/InviteAuth';
import DesktopDashboard from './components/DesktopDashboard';
import PixModal from './components/PixModal';
import PublicProfile from './components/PublicProfile';
import PublicOpportunity from './components/PublicOpportunity';
import PublicEvent from './components/PublicEvent';
import dashboardBg from './assets/dashboard_bg.jpg';

function MainAppContent() {
  const { 
    currentUser, 
    setCurrentUser,
    toast,
    setToast,
    confirmModal,
    setConfirmModal,
    promptModal,
    setPromptModal
  } = useContext(AppContext);
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
        setToast({ message: "Sua sessão expirou por inatividade. Faça o login novamente.", type: "info" });
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
    const eventId = params.get('event');
    if (talentId) {
      setShareMode('talent');
      setShareId(talentId);
    } else if (groupId) {
      setShareMode('group');
      setShareId(groupId);
    } else if (opportunityCode) {
      setShareMode('opportunity');
      setShareId(opportunityCode);
    } else if (eventId) {
      setShareMode('event');
      setShareId(eventId);
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
    if (shareMode === 'event') {
      return (
        <PublicEvent 
          id={shareId} 
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

  if (currentUser?.isGuest || currentUser?.role === 'guest') {
    return (
      <PublicOpportunity 
        code={currentUser.accessCode} 
        onBack={() => {
          setCurrentUser(null);
          setIsAuthenticated(false);
          window.history.replaceState({}, '', '/');
        }} 
      />
    );
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

      {/* Elegant Toast notification stack */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : (toast.type === 'success' ? '#10b981' : '#1f2937'),
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
          zIndex: 11000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease',
          maxWidth: '350px'
        }}>
          <span>{toast.type === 'error' ? '❌' : (toast.type === 'success' ? '✅' : 'ℹ️')}</span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 12000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '400px', width: '100%', backgroundColor: '#ffffff', padding: '24px',
            borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', color: 'var(--text-main)'
          }}>
            <div style={{ fontSize: '1.5rem', textAlign: 'center' }}>⚠️</div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>Confirmação Requerida</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4', margin: 0 }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={confirmModal.onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
              <button onClick={confirmModal.onConfirm} className="btn btn-primary" style={{ flex: 1, backgroundColor: '#ef4444' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Prompt Input Modal */}
      {promptModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 12000, padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '400px', width: '100%', backgroundColor: '#ffffff', padding: '24px',
            borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', color: 'var(--text-main)'
          }}>
            <div style={{ fontSize: '1.5rem', textAlign: 'center' }}>📝</div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>Entrada de Informação</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
              {promptModal.message}
            </p>
            <input 
              type="text" 
              id="customPromptInput"
              defaultValue={promptModal.defaultValue}
              className="form-input"
              style={{ backgroundColor: '#ffffff', fontSize: '0.9rem' }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  promptModal.onSubmit(e.target.value);
                }
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button onClick={promptModal.onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
              <button 
                onClick={() => {
                  const val = document.getElementById('customPromptInput')?.value;
                  promptModal.onSubmit(val);
                }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
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
