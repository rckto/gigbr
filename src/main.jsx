import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

function mount() {
  const container = document.getElementById('root');
  if (container) {
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } else {
    // If not ready, retry on next tick
    setTimeout(mount, 50);
  }
}

// Ensure DOM is fully parsed before mounting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
