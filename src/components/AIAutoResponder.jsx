import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';
import AIAutoResponderService from '../services/aiAutoResponderService';

const {
  FiMessageSquare, FiZap, FiSettings, FiPlay, FiPause, FiRefreshCw,
  FiCheck, FiX, FiAlertTriangle, FiClock, FiEye, FiEdit2, FiTrash2,
  FiPlus, FiSearch, FiFilter, FiBot, FiBook, FiHeart, FiShare2
} = FiIcons;

function AIAutoResponder() {
  const { state } = useSocialMedia();
  const { aiSettings } = state;
  const [autoResponder] = useState(new AIAutoResponderService());
  
  const [isActive, setIsActive] = useState(
    localStorage.getItem('ai_autoresponder_active') === 'true'
  );
  
  const [keywords, setKeywords] = useState(() => {
    const saved = localStorage.getItem('ai_autoresponder_keywords');
    return saved ? JSON.parse(saved) : [];
  });

  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem('ai_autoresponder_responses');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ai_autoresponder_settings');
    return saved ? JSON.parse(saved) : {
      responseDelay: 300, // 5 minutes in seconds
      maxResponsesPerHour: 10,
      requireApproval: false,
      brandVoice: aiSettings?.brandVoice || 'professional',
      platforms: ['instagram', 'twitter', 'facebook', 'linkedin'],
      respondToMentions: true,
      respondToComments: true,
      respondToDirectMessages: false
    };
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    category: 'general',
    priority: 'medium',
    responseType: 'ai_generated',
    customResponse: '',
    enabled: true
  });

  const [stats, setStats] = useState({
    totalResponses: 0,
    responsesThisHour: 0,
    avgResponseTime: 0,
    successRate: 0
  });

  useEffect(() => {
    if (isActive) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    // Update stats every minute
    const statsInterval = setInterval(updateStats, 60000);
    
    return () => {
      clearInterval(statsInterval);
    };
  }, [isActive]);

  const startMonitoring = () => {
    console.log('🤖 AI Auto-Responder started monitoring...');
    autoResponder.startMonitoring(keywords, settings, handleNewMention);
  };

  const stopMonitoring = () => {
    console.log('🤖 AI Auto-Responder stopped monitoring');
    autoResponder.stopMonitoring();
  };

  const handleNewMention = async (mention) => {
    console.log('📢 New mention detected:', mention);
    
    const response = await autoResponder.generateResponse(mention, keywords, settings);
    
    if (response.success) {
      setRecentActivity(prev => [response, ...prev.slice(0, 49)]); // Keep last 50
      
      if (!settings.requireApproval) {
        await autoResponder.postResponse(response);
      }
    }
  };

  const updateStats = () => {
    const stats = autoResponder.getStats();
    setStats(stats);
  };

  const toggleAutoResponder = () => {
    const newState = !isActive;
    setIsActive(newState);
    localStorage.setItem('ai_autoresponder_active', newState.toString());
  };

  const saveKeywords = () => {
    localStorage.setItem('ai_autoresponder_keywords', JSON.stringify(keywords));
  };

  const saveSettings = () => {
    localStorage.setItem('ai_autoresponder_settings', JSON.stringify(settings));
  };

  const addKeyword = () => {
    const keyword = {
      ...newKeyword,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setKeywords(prev => [...prev, keyword]);
    setNewKeyword({
      keyword: '',
      category: 'general',
      priority: 'medium',
      responseType: 'ai_generated',
      customResponse: '',
      enabled: true
    });
    setShowAddKeyword(false);
    saveKeywords();
  };

  const deleteKeyword = (keywordId) => {
    setKeywords(prev => prev.filter(k => k.id !== keywordId));
    saveKeywords();
  };

  const toggleKeyword = (keywordId) => {
    setKeywords(prev => prev.map(k => 
      k.id === keywordId ? { ...k, enabled: !k.enabled } : k
    ));
    saveKeywords();
  };

  const approveResponse = async (responseId) => {
    const response = recentActivity.find(r => r.id === responseId);
    if (response) {
      await autoResponder.postResponse(response);
      setRecentActivity(prev => prev.map(r => 
        r.id === responseId ? { ...r, status: 'approved', postedAt: new Date().toISOString() } : r
      ));
    }
  };

  const rejectResponse = (responseId) => {
    setRecentActivity(prev => prev.map(r => 
      r.id === responseId ? { ...r, status: 'rejected' } : r
    ));
  };

  const defaultKeywords = [
    // General Business Keywords
    { keyword: 'pricing', category: 'sales', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'cost', category: 'sales', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'support', category: 'customer_service', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'help', category: 'customer_service', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'thank you', category: 'appreciation', priority: 'medium', responseType: 'ai_generated' },
    
    // Bible Scholar Keywords (if using Bible Scholar voice)
    { keyword: 'baptism', category: 'doctrine', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'salvation', category: 'doctrine', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'church', category: 'fellowship', priority: 'medium', responseType: 'ai_generated' },
    { keyword: 'scripture', category: 'bible_study', priority: 'medium', responseType: 'ai_generated' },
    { keyword: 'gospel', category: 'evangelism', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'false teaching', category: 'apologetics', priority: 'high', responseType: 'ai_generated' },
    { keyword: 'denomination', category: 'unity', priority: 'medium', responseType: 'ai_generated' }
  ];

  const loadDefaultKeywords = () => {
    const filteredDefaults = settings.brandVoice === 'bible-scholar' 
      ? defaultKeywords 
      : defaultKeywords.filter(k => !['doctrine', 'fellowship', 'bible_study', 'evangelism', 'apologetics', 'unity'].includes(k.category));
    
    const newKeywords = filteredDefaults.map((kw, index) => ({
      ...kw,
      id: (Date.now() + index).toString(),
      createdAt: new Date().toISOString(),
      enabled: true
    }));
    
    setKeywords(prev => [...prev, ...newKeywords]);
    saveKeywords();
  };

  const categories = [
    'general',
    'sales',
    'customer_service',
    'appreciation',
    'complaints',
    'questions',
    ...(settings.brandVoice === 'bible-scholar' ? [
      'doctrine',
      'fellowship',
      'bible_study',
      'evangelism',
      'apologetics',
      'unity'
    ] : [])
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return FiClock;
      case 'approved': return FiCheck;
      case 'rejected': return FiX;
      case 'posted': return FiCheck;
      default: return FiAlertTriangle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'posted': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Auto-Responder</h2>
          <p className="text-gray-600">
            Automatically respond to mentions and comments using AI with keyword-based triggers
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiSettings} className="w-4 h-4 mr-2" />
            Settings
          </button>
          
          <button
            onClick={toggleAutoResponder}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <SafeIcon icon={isActive ? FiPause : FiPlay} className="w-4 h-4 mr-2" />
            {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
              <p className={`text-lg font-bold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <SafeIcon icon={FiBot} className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResponses}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Hour</p>
              <p className="text-2xl font-bold text-gray-900">{stats.responsesThisHour}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Keywords Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Keyword Triggers</h3>
          <div className="flex space-x-3">
            {keywords.length === 0 && (
              <button
                onClick={loadDefaultKeywords}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <SafeIcon icon={FiZap} className="w-4 h-4 mr-2" />
                Load Defaults
              </button>
            )}
            <button
              onClick={() => setShowAddKeyword(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Add Keyword
            </button>
          </div>
        </div>

        {keywords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywords.map((keyword, index) => (
              <motion.div
                key={keyword.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-4 ${keyword.enabled ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${keyword.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                    {keyword.keyword}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleKeyword(keyword.id)}
                      className={`p-1 rounded ${keyword.enabled ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <SafeIcon icon={keyword.enabled ? FiCheck : FiX} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteKeyword(keyword.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {keyword.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    priorities.find(p => p.id === keyword.priority)?.color
                  }`}>
                    {keyword.priority}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600">
                  {keyword.responseType === 'ai_generated' ? 'AI Generated' : 'Custom Response'}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No keywords configured yet</p>
            <button
              onClick={loadDefaultKeywords}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiZap} className="w-4 h-4 mr-2" />
              Load Default Keywords
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.slice(0, 10).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        @{activity.mention?.author || 'user'}
                      </span>
                      <span className="text-sm text-gray-500">
                        on {activity.mention?.platform}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        <SafeIcon icon={getStatusIcon(activity.status)} className="w-3 h-3 mr-1" />
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Original: "{activity.mention?.content}"
                    </p>
                    <p className="text-sm text-gray-800 bg-gray-50 rounded p-2">
                      Response: "{activity.response}"
                    </p>
                  </div>
                  
                  {activity.status === 'pending' && settings.requireApproval && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => approveResponse(activity.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiCheck} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectResponse(activity.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500">
                  {new Date(activity.createdAt).toLocaleString()}
                  {activity.postedAt && (
                    <span> • Posted: {new Date(activity.postedAt).toLocaleString()}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400">
              {isActive ? 'Monitoring for mentions...' : 'Start monitoring to see activity'}
            </p>
          </div>
        )}
      </div>

      {/* Add Keyword Modal */}
      <AnimatePresence>
        {showAddKeyword && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowAddKeyword(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add Keyword Trigger</h3>
                  <button
                    onClick={() => setShowAddKeyword(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keyword/Phrase
                    </label>
                    <input
                      type="text"
                      value={newKeyword.keyword}
                      onChange={(e) => setNewKeyword(prev => ({ ...prev, keyword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter keyword or phrase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newKeyword.category}
                      onChange={(e) => setNewKeyword(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newKeyword.priority}
                      onChange={(e) => setNewKeyword(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorities.map(priority => (
                        <option key={priority.id} value={priority.id}>
                          {priority.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Response Type
                    </label>
                    <select
                      value={newKeyword.responseType}
                      onChange={(e) => setNewKeyword(prev => ({ ...prev, responseType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ai_generated">AI Generated</option>
                      <option value="custom">Custom Response</option>
                    </select>
                  </div>

                  {newKeyword.responseType === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Response
                      </label>
                      <textarea
                        value={newKeyword.customResponse}
                        onChange={(e) => setNewKeyword(prev => ({ ...prev, customResponse: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your custom response"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddKeyword(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addKeyword}
                    disabled={!newKeyword.keyword.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Keyword
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowSettings(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Auto-Responder Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Response Delay (seconds)
                      </label>
                      <input
                        type="number"
                        value={settings.responseDelay}
                        onChange={(e) => setSettings(prev => ({ ...prev, responseDelay: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="60"
                        max="3600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Responses/Hour
                      </label>
                      <input
                        type="number"
                        value={settings.maxResponsesPerHour}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxResponsesPerHour: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Require Approval
                      </label>
                      <p className="text-sm text-gray-500">
                        Manually approve responses before posting
                      </p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, requireApproval: !prev.requireApproval }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.requireApproval ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.requireApproval ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Monitor Types
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'respondToMentions', label: 'Mentions' },
                        { key: 'respondToComments', label: 'Comments' },
                        { key: 'respondToDirectMessages', label: 'Direct Messages' }
                      ].map(option => (
                        <div key={option.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{option.label}</span>
                          <button
                            onClick={() => setSettings(prev => ({ ...prev, [option.key]: !prev[option.key] }))}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings[option.key] ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings[option.key] ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Active Platforms
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['instagram', 'twitter', 'facebook', 'linkedin'].map(platform => (
                        <div key={platform} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm capitalize">{platform}</span>
                          <button
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              platforms: prev.platforms.includes(platform)
                                ? prev.platforms.filter(p => p !== platform)
                                : [...prev.platforms, platform]
                            }))}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings.platforms.includes(platform) ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings.platforms.includes(platform) ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      saveSettings();
                      setShowSettings(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIAutoResponder;