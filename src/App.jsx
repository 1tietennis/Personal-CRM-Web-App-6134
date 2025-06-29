import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Interactions from './pages/Interactions';
import Analytics from './pages/Analytics';
import SocialMedia from './pages/SocialMedia';
import ContentCalendar from './pages/ContentCalendar';
import Settings from './pages/Settings';
import { CRMProvider } from './context/CRMContext';
import { SocialMediaProvider } from './context/SocialMediaContext';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <CRMProvider>
      <SocialMediaProvider>
        <Router>
          <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/interactions" element={<Interactions />} />
                  <Route path="/social-media" element={<SocialMedia />} />
                  <Route path="/content-calendar" element={<ContentCalendar />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AnimatePresence>
            </div>
          </div>
        </Router>
      </SocialMediaProvider>
    </CRMProvider>
  );
}

export default App;