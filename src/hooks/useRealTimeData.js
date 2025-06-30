import { useState, useEffect, useCallback } from 'react';
import { useAPI } from './useAPI';

export const useRealTimeData = () => {
  const [liveData, setLiveData] = useState({
    coreWebVitals: null,
    reviews: null,
    keywords: null,
    traffic: null,
    lastUpdated: null
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const { apiCall } = useAPI();

  // Simulate real-time data updates
  const updateLiveData = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      
      // Simulate API calls to various services
      const [webVitals, reviews, keywords, traffic] = await Promise.all([
        // Core Web Vitals from Google PageSpeed Insights
        apiCall('/api/pagespeed/vitals', { method: 'GET' }),
        // Reviews from GMB API
        apiCall('/api/gmb/reviews', { method: 'GET' }),
        // Keyword rankings from Search Console
        apiCall('/api/search-console/keywords', { method: 'GET' }),
        // Traffic data from Analytics
        apiCall('/api/analytics/traffic', { method: 'GET' })
      ]);

      // In a real implementation, these would be actual API responses
      // For demo purposes, we'll simulate the data
      const mockData = {
        coreWebVitals: {
          status: Math.random() > 0.3 ? 'good' : 'needs-improvement',
          lcp: (Math.random() * 2 + 1).toFixed(1),
          fid: Math.floor(Math.random() * 100),
          cls: (Math.random() * 0.25).toFixed(3)
        },
        reviews: {
          pending: Math.floor(Math.random() * 5),
          average: (Math.random() * 2 + 3).toFixed(1),
          total: Math.floor(Math.random() * 500 + 100)
        },
        keywords: {
          tracked: Math.floor(Math.random() * 100 + 500),
          improved: Math.floor(Math.random() * 20),
          declined: Math.floor(Math.random() * 10)
        },
        traffic: {
          current: Math.floor(Math.random() * 10000 + 50000),
          change: Math.floor(Math.random() * 40 - 20)
        },
        lastUpdated: new Date().toISOString()
      };

      setLiveData(mockData);
      setIsConnected(true);
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('Failed to update live data:', error);
      setIsConnected(false);
      setConnectionStatus('error');
    }
  }, [apiCall]);

  // Set up real-time updates
  useEffect(() => {
    // Initial data load
    updateLiveData();

    // Set up periodic updates (every 30 seconds)
    const interval = setInterval(updateLiveData, 30000);

    // Set up WebSocket connection for real-time updates
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/realtime`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected for real-time updates');
        setIsConnected(true);
        setConnectionStatus('connected');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLiveData(prevData => ({
            ...prevData,
            ...data,
            lastUpdated: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionStatus('error');
      };

      return () => {
        clearInterval(interval);
        ws.close();
      };
    } catch (error) {
      console.warn('WebSocket not available, using polling only');
      return () => clearInterval(interval);
    }
  }, [updateLiveData]);

  // Manual refresh
  const refreshData = useCallback(() => {
    updateLiveData();
  }, [updateLiveData]);

  return {
    liveData,
    isConnected,
    connectionStatus,
    refreshData,
    lastUpdated: liveData.lastUpdated
  };
};