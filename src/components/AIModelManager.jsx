import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';

const {
  FiSettings, FiZap, FiKey, FiTrash2, FiCheck, FiX, FiRefreshCw,
  FiPlus, FiEdit2, FiEye, FiEyeOff, FiUpload, FiDownload, FiGlobe,
  FiCpu, FiStar, FiTrendingUp, FiShield, FiCode, FiLink
} = FiIcons;

function AIModelManager() {
  const { state, dispatch } = useSocialMedia();
  const { aiSettings } = state;
  
  const [providers, setProviders] = useState(() => {
    const saved = localStorage.getItem('ai_providers');
    return saved ? JSON.parse(saved) : {
      openai: {
        name: 'OpenAI GPT-4',
        enabled: true,
        apiKey: '',
        model: 'gpt-4-turbo',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        maxTokens: 4096,
        temperature: 0.7,
        status: 'disconnected',
        features: ['text', 'reasoning', 'code'],
        tier: 'premium'
      },
      gemini: {
        name: 'Google Gemini Pro',
        enabled: false,
        apiKey: '',
        model: 'gemini-pro',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        maxTokens: 8192,
        temperature: 0.7,
        status: 'disconnected',
        features: ['text', 'multimodal', 'reasoning'],
        tier: 'premium'
      },
      grok: {
        name: 'Grok 3',
        enabled: false,
        apiKey: '',
        model: 'grok-3',
        endpoint: 'https://api.x.ai/v1/chat/completions',
        maxTokens: 4096,
        temperature: 0.8,
        status: 'disconnected',
        features: ['text', 'realtime', 'humor'],
        tier: 'premium',
        upgradable: true,
        nextVersion: 'grok-4'
      },
      claude: {
        name: 'Anthropic Claude',
        enabled: false,
        apiKey: '',
        model: 'claude-3-sonnet-20240229',
        endpoint: 'https://api.anthropic.com/v1/messages',
        maxTokens: 4096,
        temperature: 0.7,
        status: 'disconnected',
        features: ['text', 'reasoning', 'safety'],
        tier: 'premium'
      }
    };
  });

  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showProviderConfig, setShowProviderConfig] = useState(null);
  const [testingProvider, setTestingProvider] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const [newProvider, setNewProvider] = useState({
    id: '',
    name: '',
    apiKey: '',
    model: '',
    endpoint: '',
    maxTokens: 4096,
    temperature: 0.7,
    features: [],
    tier: 'custom'
  });

  useEffect(() => {
    saveProviders();
  }, [providers]);

  const saveProviders = () => {
    localStorage.setItem('ai_providers', JSON.stringify(providers));
  };

  const testProvider = async (providerId) => {
    setTestingProvider(providerId);
    const provider = providers[providerId];
    
    try {
      let result;
      
      switch (providerId) {
        case 'openai':
          result = await testOpenAI(provider);
          break;
        case 'gemini':
          result = await testGemini(provider);
          break;
        case 'grok':
          result = await testGrok(provider);
          break;
        case 'claude':
          result = await testClaude(provider);
          break;
        default:
          result = await testCustomProvider(provider);
      }

      setProviders(prev => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          status: result.success ? 'connected' : 'error',
          lastTest: new Date().toISOString(),
          error: result.error || null
        }
      }));

    } catch (error) {
      setProviders(prev => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          status: 'error',
          error: error.message,
          lastTest: new Date().toISOString()
        }
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const testOpenAI = async (provider) => {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    return { success: true };
  };

  const testGemini = async (provider) => {
    const response = await fetch(`${provider.endpoint}?key=${provider.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Test connection' }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    return { success: true };
  };

  const testGrok = async (provider) => {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    return { success: true };
  };

  const testClaude = async (provider) => {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    return { success: true };
  };

  const testCustomProvider = async (provider) => {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        prompt: 'Test connection',
        max_tokens: 50
      })
    });

    if (!response.ok) {
      throw new Error(`Custom provider API error: ${response.status}`);
    }

    return { success: true };
  };

  const upgradeGrok = (providerId) => {
    setProviders(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        model: 'grok-4',
        name: 'Grok 4',
        maxTokens: 8192,
        features: [...prev[providerId].features, 'advanced-reasoning'],
        upgradable: false,
        upgraded: true,
        upgradeDate: new Date().toISOString()
      }
    }));
  };

  const removeProvider = (providerId) => {
    if (Object.keys(providers).length <= 1) {
      alert('Cannot remove the last provider. Add another provider first.');
      return;
    }

    setProviders(prev => {
      const newProviders = { ...prev };
      delete newProviders[providerId];
      return newProviders;
    });
  };

  const addCustomProvider = () => {
    const id = newProvider.id || `custom_${Date.now()}`;
    
    setProviders(prev => ({
      ...prev,
      [id]: {
        ...newProvider,
        id,
        status: 'disconnected',
        tier: 'custom'
      }
    }));

    setNewProvider({
      id: '',
      name: '',
      apiKey: '',
      model: '',
      endpoint: '',
      maxTokens: 4096,
      temperature: 0.7,
      features: [],
      tier: 'custom'
    });

    setShowAddProvider(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return FiCheck;
      case 'error': return FiX;
      case 'testing': return FiRefreshCw;
      default: return FiSettings;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'testing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Model Manager</h2>
          <p className="text-gray-600">
            Configure and manage AI providers including OpenAI, Gemini, Grok, and custom models
          </p>
        </div>
        
        <button
          onClick={() => setShowAddProvider(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Provider
        </button>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(providers).map(([providerId, provider]) => (
          <motion.div
            key={providerId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            {/* Provider Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiCpu} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {provider.name}
                    {provider.tier === 'premium' && (
                      <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-500 ml-1" />
                    )}
                    {provider.upgradable && (
                      <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-500 ml-1" />
                    )}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTierColor(provider.tier)}`}>
                      {provider.tier}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                      <SafeIcon 
                        icon={getStatusIcon(provider.status)} 
                        className={`w-3 h-3 mr-1 ${testingProvider === providerId ? 'animate-spin' : ''}`} 
                      />
                      {testingProvider === providerId ? 'Testing...' : provider.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => setShowProviderConfig(providerId)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                </button>
                {provider.tier === 'custom' && (
                  <button
                    onClick={() => removeProvider(providerId)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Model Info */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Model:</strong> {provider.model}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Max Tokens:</strong> {provider.maxTokens.toLocaleString()}
              </div>
              <div className="flex flex-wrap gap-1">
                {provider.features.map((feature) => (
                  <span key={feature} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => testProvider(providerId)}
                disabled={testingProvider === providerId || !provider.apiKey}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                <SafeIcon 
                  icon={testingProvider === providerId ? FiRefreshCw : FiShield} 
                  className={`w-4 h-4 mr-1 ${testingProvider === providerId ? 'animate-spin' : ''}`} 
                />
                Test
              </button>
              
              {providerId === 'grok' && provider.upgradable && (
                <button
                  onClick={() => upgradeGrok(providerId)}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
                  Upgrade
                </button>
              )}
            </div>

            {/* Upgrade Notification for Grok */}
            {providerId === 'grok' && provider.upgradable && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Grok 4 available! Enhanced reasoning & performance.
                  </span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {provider.status === 'error' && provider.error && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-800">{provider.error}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddProvider && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowAddProvider(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add Custom AI Provider</h3>
                  <button
                    onClick={() => setShowAddProvider(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provider Name
                      </label>
                      <input
                        type="text"
                        value={newProvider.name}
                        onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Custom GPT Provider"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model Name
                      </label>
                      <input
                        type="text"
                        value={newProvider.model}
                        onChange={(e) => setNewProvider(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., gpt-4, custom-model-v1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Endpoint
                    </label>
                    <input
                      type="url"
                      value={newProvider.endpoint}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, endpoint: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://api.example.com/v1/chat/completions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={newProvider.apiKey}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter API key"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Tokens
                      </label>
                      <input
                        type="number"
                        value={newProvider.maxTokens}
                        onChange={(e) => setNewProvider(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="100"
                        max="32000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature
                      </label>
                      <input
                        type="number"
                        value={newProvider.temperature}
                        onChange={(e) => setNewProvider(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="2"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddProvider(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomProvider}
                    disabled={!newProvider.name || !newProvider.endpoint || !newProvider.apiKey}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Provider
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Provider Configuration Modal */}
      <AnimatePresence>
        {showProviderConfig && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowProviderConfig(null)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
              >
                {providers[showProviderConfig] && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Configure {providers[showProviderConfig].name}
                      </h3>
                      <button
                        onClick={() => setShowProviderConfig(null)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiX} className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords[showProviderConfig] ? 'text' : 'password'}
                            value={providers[showProviderConfig].apiKey}
                            onChange={(e) => setProviders(prev => ({
                              ...prev,
                              [showProviderConfig]: {
                                ...prev[showProviderConfig],
                                apiKey: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter API key"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              [showProviderConfig]: !prev[showProviderConfig]
                            }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <SafeIcon icon={showPasswords[showProviderConfig] ? FiEyeOff : FiEye} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model
                          </label>
                          <input
                            type="text"
                            value={providers[showProviderConfig].model}
                            onChange={(e) => setProviders(prev => ({
                              ...prev,
                              [showProviderConfig]: {
                                ...prev[showProviderConfig],
                                model: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Tokens
                          </label>
                          <input
                            type="number"
                            value={providers[showProviderConfig].maxTokens}
                            onChange={(e) => setProviders(prev => ({
                              ...prev,
                              [showProviderConfig]: {
                                ...prev[showProviderConfig],
                                maxTokens: parseInt(e.target.value)
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="100"
                            max="32000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Temperature ({providers[showProviderConfig].temperature})
                        </label>
                        <input
                          type="range"
                          value={providers[showProviderConfig].temperature}
                          onChange={(e) => setProviders(prev => ({
                            ...prev,
                            [showProviderConfig]: {
                              ...prev[showProviderConfig],
                              temperature: parseFloat(e.target.value)
                            }
                          }))}
                          className="w-full"
                          min="0"
                          max="2"
                          step="0.1"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>More Focused</span>
                          <span>More Creative</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Endpoint
                        </label>
                        <input
                          type="url"
                          value={providers[showProviderConfig].endpoint}
                          onChange={(e) => setProviders(prev => ({
                            ...prev,
                            [showProviderConfig]: {
                              ...prev[showProviderConfig],
                              endpoint: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => setShowProviderConfig(null)}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          saveProviders();
                          setShowProviderConfig(null);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIModelManager;