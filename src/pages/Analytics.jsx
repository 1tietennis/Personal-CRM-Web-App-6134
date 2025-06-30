import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useSEO } from '../context/SEOContext';
import { useAPI } from '../hooks/useAPI';
import ReactECharts from 'echarts-for-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import ConnectionDiagnostics from '../components/Analytics/ConnectionDiagnostics';
import SetupWizard from '../components/Analytics/SetupWizard';
import TroubleshootingGuide from '../components/Analytics/TroubleshootingGuide';

function Analytics() {
  const { state } = useSEO();
  const { getAnalyticsData, getSearchConsoleData, getGMBData, getYouTubeData, loading } = useAPI();
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showTroubleshootingGuide, setShowTroubleshootingGuide] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Date range options
  const dateRanges = [
    { id: '7d', name: 'Last 7 Days', days: 7 },
    { id: '30d', name: 'Last 30 Days', days: 30 },
    { id: '90d', name: 'Last 90 Days', days: 90 },
    { id: '12m', name: 'Last 12 Months', days: 365 }
  ];

  // Platform options
  const platforms = [
    { id: 'all', name: 'All Platforms', icon: Icons.Globe },
    { id: 'google', name: 'Google Search', icon: Icons.Search },
    { id: 'gmb', name: 'Google My Business', icon: Icons.MapPin },
    { id: 'youtube', name: 'YouTube', icon: Icons.Play },
    { id: 'website', name: 'Website', icon: Icons.Monitor }
  ];

  useEffect(() => {
    checkConnectionStatus();
    loadAnalyticsData();
  }, [selectedDateRange, selectedPlatform]);

  const checkConnectionStatus = () => {
    const hasGoogleAnalytics = localStorage.getItem('google_analytics_api_key') && localStorage.getItem('google_analytics_view_id');
    const hasSearchConsole = localStorage.getItem('search_console_site_url');
    const hasGMB = localStorage.getItem('gmb_access_token');
    const hasYouTube = localStorage.getItem('youtube_api_key');

    if (!hasGoogleAnalytics && !hasSearchConsole && !hasGMB && !hasYouTube) {
      setConnectionStatus('not_configured');
    } else if (hasGoogleAnalytics || hasSearchConsole) {
      setConnectionStatus('partial');
    } else {
      setConnectionStatus('connected');
    }
  };

  const loadAnalyticsData = async () => {
    if (connectionStatus === 'not_configured') return;
    
    setIsRefreshing(true);
    try {
      const dateRange = dateRanges.find(range => range.id === selectedDateRange);
      const endDate = new Date();
      const startDate = subDays(endDate, dateRange.days);

      // Fetch data from all sources
      const [googleAnalytics, searchConsole, gmbData, youtubeData] = await Promise.all([
        getAnalyticsData({ 
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }),
        getSearchConsoleData({
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }),
        getGMBData('your-location-id'),
        getYouTubeData('your-channel-id')
      ]);

      // Combine and process data
      const processedData = processAnalyticsData({
        googleAnalytics,
        searchConsole,
        gmbData,
        youtubeData,
        dateRange: dateRange.days
      });

      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const processAnalyticsData = (data) => {
    const { googleAnalytics, searchConsole, gmbData, youtubeData, dateRange } = data;
    
    // Generate date series for charts
    const endDate = new Date();
    const startDate = subDays(endDate, dateRange);
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Mock trend data (in production, this would come from actual APIs)
    const organicTrafficTrend = dates.map(date => ({
      date: format(date, 'MMM dd'),
      sessions: Math.floor(Math.random() * 1000) + 500,
      users: Math.floor(Math.random() * 800) + 400,
      pageviews: Math.floor(Math.random() * 2000) + 1000
    }));

    const keywordPerformance = [
      { keyword: 'best running shoes', position: 2, clicks: 1240, impressions: 15600, ctr: 7.9 },
      { keyword: 'running shoes review', position: 4, clicks: 890, impressions: 12300, ctr: 7.2 },
      { keyword: 'athletic footwear', position: 1, clicks: 2100, impressions: 8900, ctr: 23.6 },
      { keyword: 'marathon shoes', position: 3, clicks: 650, impressions: 9800, ctr: 6.6 },
      { keyword: 'trail running gear', position: 5, clicks: 420, impressions: 7200, ctr: 5.8 }
    ];

    const conversionFunnel = [
      { stage: 'Impressions', value: 125000, percentage: 100 },
      { stage: 'Clicks', value: 8750, percentage: 7.0 },
      { stage: 'Sessions', value: 7200, percentage: 5.8 },
      { stage: 'Pageviews', value: 14400, percentage: 11.5 },
      { stage: 'Conversions', value: 360, percentage: 0.3 }
    ];

    return {
      summary: {
        totalSessions: googleAnalytics.sessions || 45230,
        totalUsers: googleAnalytics.users || 32150,
        totalPageviews: googleAnalytics.pageviews || 89650,
        avgSessionDuration: '2:34',
        bounceRate: 42.3,
        conversionRate: 2.8,
        organicTraffic: searchConsole.clicks || 12450,
        totalImpressions: searchConsole.impressions || 156000,
        avgPosition: parseFloat(searchConsole.position) || 3.2,
        ctr: parseFloat(searchConsole.ctr) || 8.1,
        gmbViews: gmbData.views || 2340,
        gmbActions: gmbData.actions || 180,
        youtubeViews: youtubeData.views || 15600,
        youtubeSubscribers: youtubeData.subscribers || 1250
      },
      trends: {
        organicTraffic: organicTrafficTrend,
        keywords: keywordPerformance,
        conversionFunnel
      },
      growth: {
        sessions: 23.5,
        users: 18.9,
        organicTraffic: 31.2,
        conversions: 45.7,
        rankings: -12.3, // Negative means improvement in position
        gmbViews: 28.4
      }
    };
  };

  const handleSetupComplete = (setupData) => {
    setShowSetupWizard(false);
    checkConnectionStatus();
    loadAnalyticsData();
  };

  // Chart configurations
  const trafficChartOption = {
    title: {
      text: 'Organic Traffic Trends',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Sessions', 'Users', 'Pageviews'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: analyticsData?.trends.organicTraffic.map(item => item.date) || []
    },
    yAxis: [
      {
        type: 'value',
        name: 'Sessions/Users',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Pageviews',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'Sessions',
        type: 'line',
        yAxisIndex: 0,
        data: analyticsData?.trends.organicTraffic.map(item => item.sessions) || [],
        smooth: true,
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Users',
        type: 'line',
        yAxisIndex: 0,
        data: analyticsData?.trends.organicTraffic.map(item => item.users) || [],
        smooth: true,
        itemStyle: { color: '#10B981' }
      },
      {
        name: 'Pageviews',
        type: 'line',
        yAxisIndex: 1,
        data: analyticsData?.trends.organicTraffic.map(item => item.pageviews) || [],
        smooth: true,
        itemStyle: { color: '#F59E0B' }
      }
    ]
  };

  const keywordChartOption = {
    title: {
      text: 'Top Keywords Performance',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: analyticsData?.trends.keywords.map(item => item.keyword) || [],
      axisLabel: { rotate: 45 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Clicks',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Position',
        position: 'right',
        inverse: true,
        min: 1,
        max: 10
      }
    ],
    series: [
      {
        name: 'Clicks',
        type: 'bar',
        yAxisIndex: 0,
        data: analyticsData?.trends.keywords.map(item => item.clicks) || [],
        itemStyle: { color: '#8B5CF6' }
      },
      {
        name: 'Position',
        type: 'line',
        yAxisIndex: 1,
        data: analyticsData?.trends.keywords.map(item => item.position) || [],
        itemStyle: { color: '#EF4444' }
      }
    ]
  };

  const conversionFunnelOption = {
    title: {
      text: 'Conversion Funnel',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Conversion Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: analyticsData?.trends.conversionFunnel.map(item => ({
          value: item.percentage,
          name: `${item.stage}\n${item.value.toLocaleString()}`
        })) || []
      }
    ]
  };

  // Connection Status Banner
  if (connectionStatus === 'not_configured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.BarChart3 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Set Up Analytics</h1>
          <p className="text-gray-600 mb-8">
            Connect your analytics accounts to start viewing comprehensive insights from Google Analytics,
            Search Console, GMB, and YouTube.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSetupWizard(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icons.Settings className="w-5 h-5 mr-2" />
              Setup Wizard
            </button>
            <button
              onClick={() => setShowTroubleshootingGuide(true)}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Icons.HelpCircle className="w-5 h-5 mr-2" />
              Troubleshooting Guide
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Sessions',
      value: analyticsData?.summary.totalSessions.toLocaleString() || '0',
      change: analyticsData?.growth.sessions || 0,
      icon: Icons.Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Organic Traffic',
      value: analyticsData?.summary.organicTraffic.toLocaleString() || '0',
      change: analyticsData?.growth.organicTraffic || 0,
      icon: Icons.Search,
      color: 'bg-green-500'
    },
    {
      title: 'Avg. Position',
      value: analyticsData?.summary.avgPosition.toFixed(1) || '0.0',
      change: analyticsData?.growth.rankings || 0,
      icon: Icons.TrendingUp,
      color: 'bg-purple-500',
      isInverted: true // Lower is better for rankings
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData?.summary.conversionRate || 0}%`,
      change: analyticsData?.growth.conversions || 0,
      icon: Icons.Target,
      color: 'bg-orange-500'
    },
    {
      title: 'GMB Views',
      value: analyticsData?.summary.gmbViews.toLocaleString() || '0',
      change: analyticsData?.growth.gmbViews || 0,
      icon: Icons.MapPin,
      color: 'bg-red-500'
    },
    {
      title: 'YouTube Views',
      value: analyticsData?.summary.youtubeViews.toLocaleString() || '0',
      change: 12.8,
      icon: Icons.Play,
      color: 'bg-pink-500'
    }
  ];

  const getChangeColor = (change, isInverted = false) => {
    if (change === 0) return 'text-gray-600';
    const isPositive = isInverted ? change < 0 : change > 0;
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change, isInverted = false) => {
    if (change === 0) return Icons.Minus;
    const isPositive = isInverted ? change < 0 : change > 0;
    return isPositive ? Icons.TrendingUp : Icons.TrendingDown;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
            <p className="text-gray-600">
              Comprehensive insights across Google Search, GMB, YouTube, and website performance
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowDiagnostics(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Icons.Stethoscope className="w-4 h-4 mr-2" />
              Diagnostics
            </button>
            <button
              onClick={() => setShowTroubleshootingGuide(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Icons.HelpCircle className="w-4 h-4 mr-2" />
              Help
            </button>
            <button
              onClick={loadAnalyticsData}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Icons.RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status Warning */}
      {connectionStatus === 'partial' && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icons.AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Partial Analytics Setup</h3>
              <p className="text-sm text-yellow-700">
                Some analytics connections are missing. Complete the setup for full insights.
              </p>
            </div>
            <button
              onClick={() => setShowSetupWizard(true)}
              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateRanges.map(range => (
              <option key={range.id} value={range.id}>{range.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>{platform.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          const ChangeIcon = getChangeIcon(metric.change, metric.isInverted);
          
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${getChangeColor(metric.change, metric.isInverted)}`}>
                  <ChangeIcon className="w-4 h-4 mr-1" />
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {analyticsData ? (
            <ReactECharts option={trafficChartOption} style={{ height: '400px' }} />
          ) : (
            <div className="flex items-center justify-center h-96">
              <Icons.Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
        </motion.div>

        {/* Keyword Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {analyticsData ? (
            <ReactECharts option={keywordChartOption} style={{ height: '400px' }} />
          ) : (
            <div className="flex items-center justify-center h-96">
              <Icons.Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        {analyticsData ? (
          <ReactECharts option={conversionFunnelOption} style={{ height: '400px' }} />
        ) : (
          <div className="flex items-center justify-center h-96">
            <Icons.Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
      </motion.div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Keywords Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Icons.Search className="w-5 h-5 text-blue-600 mr-2" />
            Top Performing Keywords
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData?.trends.keywords.map((keyword, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{keyword.keyword}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">#{keyword.position}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{keyword.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{keyword.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Icons.BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
            Performance Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icons.Eye className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Total Impressions</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {analyticsData?.summary.totalImpressions.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icons.MousePointer className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Click-Through Rate</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {analyticsData?.summary.ctr.toFixed(1) || '0.0'}%
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icons.Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">Avg. Session Duration</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {analyticsData?.summary.avgSessionDuration || '0:00'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icons.Percent className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">Bounce Rate</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {analyticsData?.summary.bounceRate.toFixed(1) || '0.0'}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDiagnostics && (
          <ConnectionDiagnostics onClose={() => setShowDiagnostics(false)} />
        )}
        {showSetupWizard && (
          <SetupWizard 
            onClose={() => setShowSetupWizard(false)} 
            onComplete={handleSetupComplete}
          />
        )}
        {showTroubleshootingGuide && (
          <TroubleshootingGuide onClose={() => setShowTroubleshootingGuide(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Analytics;