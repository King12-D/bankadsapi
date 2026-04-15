import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PublisherSignup from './pages/PublisherSignup';
import Capabilities from './pages/Capabilities';
import TargetingEngine from './pages/TargetingEngine';
import SecuritySuite from './pages/SecuritySuite';
import AnalyticsCloud from './pages/AnalyticsCloud';
import Company from './pages/Company';
import Privacy from './pages/Privacy';
import Compliance from './pages/Compliance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/publishers/join" element={<PublisherSignup />} />
          
          {/* Corporate Pages */}
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/targeting-engine" element={<TargetingEngine />} />
          <Route path="/security-suite" element={<SecuritySuite />} />
          <Route path="/analytics-cloud" element={<AnalyticsCloud />} />
          <Route path="/company" element={<Company />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/compliance" element={<Compliance />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Catch all - Redirect to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
