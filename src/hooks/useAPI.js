import { useState, useCallback } from 'react';
import axios from 'axios';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic API call function
  const apiCall = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        timeout: 30000, // 30 seconds timeout
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const response = await axios(url, config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || err.message);
      throw err;
    }
  }, []);

  // Google Analytics 4 integration
  const getAnalyticsData = useCallback(async (params = {}) => {
    const { dateRange = '30daysAgo', metrics = ['sessions', 'users'] } = params;
    
    try {
      return await apiCall('/api/analytics/reports', {
        method: 'POST',
        data: {
          dateRange,
          metrics,
          dimensions: ['date']
        }
      });
    } catch (error) {
      console.error('Analytics API error:', error);
      // Return mock data for demo
      return {
        sessions: Math.floor(Math.random() * 50000 + 25000),
        users: Math.floor(Math.random() * 30000 + 15000),
        pageviews: Math.floor(Math.random() * 100000 + 50000)
      };
    }
  }, [apiCall]);

  // Google Search Console integration
  const getSearchConsoleData = useCallback(async (params = {}) => {
    const { startDate, endDate, dimensions = ['query'] } = params;
    
    try {
      return await apiCall('/api/search-console/reports', {
        method: 'POST',
        data: {
          startDate,
          endDate,
          dimensions
        }
      });
    } catch (error) {
      console.error('Search Console API error:', error);
      // Return mock data for demo
      return {
        clicks: Math.floor(Math.random() * 10000 + 5000),
        impressions: Math.floor(Math.random() * 100000 + 50000),
        ctr: (Math.random() * 0.1 + 0.05).toFixed(3),
        position: (Math.random() * 10 + 1).toFixed(1)
      };
    }
  }, [apiCall]);

  // Google My Business integration
  const getGMBData = useCallback(async (locationId) => {
    try {
      return await apiCall(`/api/gmb/locations/${locationId}/insights`);
    } catch (error) {
      console.error('GMB API error:', error);
      // Return mock data for demo
      return {
        views: Math.floor(Math.random() * 1000 + 500),
        searches: Math.floor(Math.random() * 800 + 400),
        actions: Math.floor(Math.random() * 100 + 50)
      };
    }
  }, [apiCall]);

  // YouTube Analytics integration
  const getYouTubeData = useCallback(async (channelId) => {
    try {
      return await apiCall(`/api/youtube/channels/${channelId}/analytics`);
    } catch (error) {
      console.error('YouTube API error:', error);
      // Return mock data for demo
      return {
        views: Math.floor(Math.random() * 50000 + 25000),
        subscribers: Math.floor(Math.random() * 5000 + 2500),
        watchTime: Math.floor(Math.random() * 100000 + 50000)
      };
    }
  }, [apiCall]);

  // Keyword ranking data
  const getKeywordRankings = useCallback(async (keywords = []) => {
    try {
      return await apiCall('/api/keywords/rankings', {
        method: 'POST',
        data: { keywords }
      });
    } catch (error) {
      console.error('Keywords API error:', error);
      // Return mock data for demo
      return keywords.map(keyword => ({
        keyword,
        position: Math.floor(Math.random() * 50 + 1),
        previousPosition: Math.floor(Math.random() * 50 + 1),
        searchVolume: Math.floor(Math.random() * 10000 + 1000),
        difficulty: Math.floor(Math.random() * 100),
        url: `/page-${Math.floor(Math.random() * 10 + 1)}`
      }));
    }
  }, [apiCall]);

  return {
    loading,
    error,
    apiCall,
    getAnalyticsData,
    getSearchConsoleData,
    getGMBData,
    getYouTubeData,
    getKeywordRankings
  };
};