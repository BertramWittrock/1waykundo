import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MediaProvider } from './context/MediaContext';
import Home from './pages/home';
import Login from './pages/login';
import Loading from './pages/loading';

function App() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Function to handle when consent is updated
    const handleConsentChange = (event) => {
      if (event.detail?.type === 'CONSENT_STATUS_CHANGE') {
        setConsentGiven(true);
      }
    };

    // Check if Usercentrics is already loaded
    const checkUcLoaded = () => {
      if (window.UC_UI) {
        // If already initialized, check if consent was previously given
        const hasConsent = document.cookie.includes('ucConsent');
        if (hasConsent) {
          setConsentGiven(true);
        }

        // Listen for future consent changes
        window.addEventListener('ucEvent', handleConsentChange);
        
        // Show banner if consent not yet given
        if (!hasConsent && typeof window.UC_UI.showFirstLayer === 'function') {
          window.UC_UI.showFirstLayer();
        }
      } else {
        // Check again shortly if not loaded yet
        setTimeout(checkUcLoaded, 500);
      }
    };

    // Start checking once document is ready
    if (document.readyState === 'complete') {
      checkUcLoaded();
    } else {
      window.addEventListener('load', checkUcLoaded);
      return () => window.removeEventListener('load', checkUcLoaded);
    }

    return () => {
      window.removeEventListener('ucEvent', handleConsentChange);
    };
  }, []);

  // Button to manually open consent settings
  const openConsentSettings = () => {
    if (window.UC_UI && typeof window.UC_UI.showSecondLayer === 'function') {
      window.UC_UI.showSecondLayer();
    }
  };

  if (!consentGiven) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontFamily: 'Courier Prime, monospace'
      }}>
        <h2>Cookie Consent Required</h2>
        <p>Please accept cookies to continue to the application.</p>
        <button 
          onClick={openConsentSettings}
          style={{
            padding: '10px 20px',
            margin: '20px 0',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'Courier Prime, monospace'
          }}
        >
          Open Cookie Settings
        </button>
      </div>
    );
  }

  return (
    <MediaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </MediaProvider>
  );
}

export default App; 