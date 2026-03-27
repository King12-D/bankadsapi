import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AdManager from './pages/AdManager';
import APIManagement from './pages/APIManagement';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo, set to false for real auth

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<AdManager />} />
          <Route path="/api-keys" element={<APIManagement />} />
          {/* Add more routes as needed */}
        </Routes>
      </main>

      <style jsx="true">{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-black);
        }
        
        @media (max-width: 768px) {
          .app-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
