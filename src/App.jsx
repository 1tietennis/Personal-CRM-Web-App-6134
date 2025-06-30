import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import MainMenu from './components/Navigation/MainMenu';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';
import Dashboard from './pages/Dashboard';
import Keywords from './pages/Keywords';
import Rankings from './pages/Rankings';
import Competition from './pages/Competition';
import ContentStrategy from './pages/ContentStrategy';
import LocalSEO from './pages/LocalSEO';
import Analytics from './pages/Analytics';
import ClientManagement from './pages/ClientManagement';
import ProfitMargins from './pages/ProfitMargins';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import MenuTester from './components/Testing/MenuTester';
import { SEOProvider } from './context/SEOContext';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate app initialization
  useEffect(() => {
    const initializeApp = async () => {
      // Simulate loading time for app initialization
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner 
        fullScreen={true}
        size="xl"
        message="Initializing SEO Pro..."
        color="blue"
      />
    );
  }

  return (
    <ErrorBoundary>
      <SEOProvider>
        <Router>
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <MainMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className={`flex-1 flex flex-col transition-all duration-300 ${
              sidebarOpen ? 'ml-80' : 'ml-20'
            }`}>
              <div className="flex-1 overflow-auto">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Keywords Routes */}
                    <Route path="/keywords" element={<Keywords />} />
                    <Route path="/keywords/rankings" element={<Keywords />} />
                    <Route path="/keywords/suggestions" element={<Keywords />} />
                    <Route path="/keywords/negative" element={<Keywords />} />
                    <Route path="/keywords/competitor-gap" element={<Keywords />} />
                    
                    {/* Google Search Routes */}
                    <Route path="/google-search/on-page" element={<Rankings />} />
                    <Route path="/google-search/technical" element={<Rankings />} />
                    <Route path="/google-search/content-gaps" element={<Rankings />} />
                    
                    {/* GMB Routes */}
                    <Route path="/gmb/analytics" element={<LocalSEO />} />
                    <Route path="/gmb/reviews" element={<LocalSEO />} />
                    <Route path="/gmb/citations" element={<LocalSEO />} />
                    
                    {/* Blog Routes */}
                    <Route path="/blog/analytics" element={<ContentStrategy />} />
                    <Route path="/blog/optimization" element={<ContentStrategy />} />
                    <Route path="/blog/topics" element={<ContentStrategy />} />
                    
                    {/* YouTube Routes */}
                    <Route path="/youtube/analytics" element={<Analytics />} />
                    <Route path="/youtube/keywords" element={<Analytics />} />
                    <Route path="/youtube/content" element={<Analytics />} />
                    
                    {/* Reporting Routes */}
                    <Route path="/reporting/performance" element={<Reports />} />
                    <Route path="/reporting/roi" element={<Reports />} />
                    <Route path="/reporting/white-label" element={<Reports />} />
                    
                    {/* Other Routes */}
                    <Route path="/rankings" element={<Rankings />} />
                    <Route path="/competition" element={<Competition />} />
                    <Route path="/content" element={<ContentStrategy />} />
                    <Route path="/local-seo" element={<LocalSEO />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/clients" element={<ClientManagement />} />
                    <Route path="/margins" element={<ProfitMargins />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Testing Route (Development Only) */}
                    {process.env.NODE_ENV === 'development' && (
                      <Route path="/test-menu" element={<MenuTester />} />
                    )}
                  </Routes>
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </SEOProvider>
    </ErrorBoundary>
  );
}

export default App;