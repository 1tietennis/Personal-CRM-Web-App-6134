import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import WebhookService from '../services/webhookService';

const {
  FiGlobe, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiRefreshCw,
  FiCopy, FiEye, FiActivity, FiSettings, FiZap, FiCode, FiSend,
  FiClock, FiAlertTriangle, FiShield, FiLink, FiFilter
} = FiIcons;

function WebhookManager() {
  const [webhookService] = useState(new WebhookService());
  const [webhooks, setWebhooks] = useState([]);
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [showEditWebhook, setShowEditWebhook] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(null);
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [copied, setCopied] = useState(false);

  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [],
    headers: {},
    secret: '',
    enabled: true,
    retryAttempts: 3,
    timeout: 30000
  });

  const availableEvents = [
    { id: 'post.created', name: 'Post Created', description: 'When a new post is published' },
    { id: 'post.scheduled', name: 'Post Scheduled', description: 'When a post is scheduled' },
    { id: 'response.generated', name: 'AI Response Generated', description: 'When auto-responder generates a response' },
    { id: 'response.posted', name: 'Response Posted', description: 'When auto-response is posted' },
    { id: 'platform.connected', name: 'Platform Connected', description: 'When a social platform is connected' },
    { id: 'platform.error', name: 'Platform Error', description: 'When a platform encounters an error' },
    { id: 'contact.added', name: 'Contact Added', description: 'When a new contact is added' },
    { id: 'interaction.logged', name: 'Interaction Logged', description: 'When an interaction is recorded' },
    { id: 'automation.triggered', name: 'Automation Triggered', description: 'When CRM automation runs' },
    { id: 'test.webhook', name: 'Test Webhook', description: 'Test webhook functionality' }
  ];

  useEffect(() => {
    loadWebhooks();
    loadWebhookLogs();
  }, []);

  const loadWebhooks = () => {
    const saved = localStorage.getItem('webhooks');
    if (saved) {
      const webhookData = JSON.parse(saved);
      setWebhooks(webhookData);
      webhookService.setWebhooks(webhookData);
    }
  };

  const loadWebhookLogs = () => {
    const logs = webhookService.getLogs();
    setWebhookLogs(logs);
  };

  const saveWebhooks = (webhookData) => {
    localStorage.setItem('webhooks', JSON.stringify(webhookData));
    webhookService.setWebhooks(webhookData);
  };

  const addWebhook = () => {
    const webhook = {
      ...newWebhook,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0
    };

    const updatedWebhooks = [...webhooks, webhook];
    setWebhooks(updatedWebhooks);
    saveWebhooks(updatedWebhooks);

    setNewWebhook({
      name: '',
      url: '',
      events: [],
      headers: {},
      secret: '',
      enabled: true,
      retryAttempts: 3,
      timeout: 30000
    });
    setShowAddWebhook(false);
  };

  const updateWebhook = (webhookId, updates) => {
    const updatedWebhooks = webhooks.map(webhook =>
      webhook.id === webhookId ? { ...webhook, ...updates } : webhook
    );
    setWebhooks(updatedWebhooks);
    saveWebhooks(updatedWebhooks);
  };

  const deleteWebhook = (webhookId) => {
    const updatedWebhooks = webhooks.filter(webhook => webhook.id !== webhookId);
    setWebhooks(updatedWebhooks);
    saveWebhooks(updatedWebhooks);
  };

  const testWebhook = async (webhookId) => {
    setTestingWebhook(webhookId);
    
    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook) return;

    const testPayload = {
      event: 'test.webhook',
      timestamp: new Date().toISOString(),
      data: {
        test: true,
        message: 'This is a test webhook call',
        webhook_id: webhookId
      }
    };

    try {
      const result = await webhookService.triggerWebhook(webhook, testPayload);
      
      if (result.success) {
        updateWebhook(webhookId, {
          lastTriggered: new Date().toISOString(),
          totalCalls: webhook.totalCalls + 1,
          successfulCalls: webhook.successfulCalls + 1
        });
      } else {
        updateWebhook(webhookId, {
          lastTriggered: new Date().toISOString(),
          totalCalls: webhook.totalCalls + 1,
          failedCalls: webhook.failedCalls + 1
        });
      }

      loadWebhookLogs();
    } catch (error) {
      console.error('Webhook test failed:', error);
    } finally {
      setTestingWebhook(null);
    }
  };

  const toggleWebhook = (webhookId) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    updateWebhook(webhookId, { enabled: !webhook.enabled });
  };

  const copyWebhookUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getStatusColor = (webhook) => {
    if (!webhook.enabled) return 'text-gray-600 bg-gray-50';
    if (webhook.failedCalls > webhook.successfulCalls) return 'text-red-600 bg-red-50';
    if (webhook.successfulCalls > 0) return 'text-green-600 bg-green-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getSuccessRate = (webhook) => {
    if (webhook.totalCalls === 0) return 0;
    return Math.round((webhook.successfulCalls / webhook.totalCalls) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Webhook Management</h2>
          <p className="text-gray-600">
            Configure webhooks to receive real-time notifications about events in your application
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowLogs(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiActivity} className="w-4 h-4 mr-2" />
            View Logs
          </button>
          <button
            onClick={() => setShowAddWebhook(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Webhook
          </button>
        </div>
      </div>

      {/* Webhooks List */}
      <div className="grid grid-cols-1 gap-6">
        {webhooks.length > 0 ? (
          webhooks.map((webhook, index) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{webhook.name}</h3>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webhook)}`}>
                      <SafeIcon icon={webhook.enabled ? FiCheck : FiX} className="w-3 h-3 mr-1" />
                      {webhook.enabled ? 'Active' : 'Disabled'}
                    </div>
                    {webhook.totalCalls > 0 && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {getSuccessRate(webhook)}% success
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiGlobe} className="w-4 h-4" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{webhook.url}</code>
                      <button
                        onClick={() => copyWebhookUrl(webhook.url)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiCopy} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {webhook.events.map((event) => {
                      const eventInfo = availableEvents.find(e => e.id === event);
                      return (
                        <span key={event} className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          {eventInfo?.name || event}
                        </span>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Calls:</span>
                      <span className="font-medium ml-1">{webhook.totalCalls}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Successful:</span>
                      <span className="font-medium ml-1 text-green-600">{webhook.successfulCalls}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failed:</span>
                      <span className="font-medium ml-1 text-red-600">{webhook.failedCalls}</span>
                    </div>
                  </div>

                  {webhook.lastTriggered && (
                    <div className="text-xs text-gray-500 mt-2">
                      Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => testWebhook(webhook.id)}
                    disabled={testingWebhook === webhook.id}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <SafeIcon 
                      icon={testingWebhook === webhook.id ? FiRefreshCw : FiSend} 
                      className={`w-4 h-4 ${testingWebhook === webhook.id ? 'animate-spin' : ''}`} 
                    />
                  </button>
                  <button
                    onClick={() => toggleWebhook(webhook.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      webhook.enabled 
                        ? 'text-yellow-600 hover:bg-yellow-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <SafeIcon icon={webhook.enabled ? FiEye : FiEye} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowEditWebhook(webhook.id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteWebhook(webhook.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <SafeIcon icon={FiGlobe} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
            <p className="text-gray-500 mb-6">
              Add webhooks to receive real-time notifications about events
            </p>
            <button
              onClick={() => setShowAddWebhook(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Add Your First Webhook
            </button>
          </div>
        )}
      </div>

      {/* Add Webhook Modal */}
      <AnimatePresence>
        {showAddWebhook && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowAddWebhook(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Webhook</h3>
                  <button
                    onClick={() => setShowAddWebhook(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Webhook Name
                      </label>
                      <input
                        type="text"
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="My Webhook"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://your-server.com/webhook"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Events to Subscribe
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {availableEvents.map((event) => (
                        <label key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newWebhook.events.includes(event.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewWebhook(prev => ({ ...prev, events: [...prev.events, event.id] }));
                              } else {
                                setNewWebhook(prev => ({ 
                                  ...prev, 
                                  events: prev.events.filter(id => id !== event.id) 
                                }));
                              }
                            }}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{event.name}</div>
                            <div className="text-sm text-gray-600">{event.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secret (Optional)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newWebhook.secret}
                          onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="webhook_secret_key"
                        />
                        <button
                          type="button"
                          onClick={() => setNewWebhook(prev => ({ ...prev, secret: generateSecret() }))}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Generate
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timeout (ms)
                      </label>
                      <input
                        type="number"
                        value={newWebhook.timeout}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1000"
                        max="60000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Headers (JSON)
                    </label>
                    <textarea
                      value={JSON.stringify(newWebhook.headers, null, 2)}
                      onChange={(e) => {
                        try {
                          const headers = JSON.parse(e.target.value);
                          setNewWebhook(prev => ({ ...prev, headers }));
                        } catch (error) {
                          // Invalid JSON, ignore
                        }
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddWebhook(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addWebhook}
                    disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Webhook
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Webhook Logs Modal */}
      <AnimatePresence>
        {showLogs && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowLogs(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Webhook Logs</h3>
                  <button
                    onClick={() => setShowLogs(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {webhookLogs.length > 0 ? (
                    webhookLogs.slice(0, 50).map((log, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <SafeIcon 
                              icon={log.success ? FiCheck : FiX} 
                              className={`w-4 h-4 ${log.success ? 'text-green-600' : 'text-red-600'}`} 
                            />
                            <span className="font-medium text-gray-900">{log.webhookName}</span>
                            <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {log.event}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <div><strong>URL:</strong> {log.url}</div>
                          <div><strong>Status:</strong> {log.status}</div>
                          <div><strong>Response Time:</strong> {log.responseTime}ms</div>
                          {log.error && (
                            <div className="text-red-600 mt-1"><strong>Error:</strong> {log.error}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <SafeIcon icon={FiActivity} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No webhook logs yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="w-4 h-4" />
              <span>URL copied to clipboard!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebhookManager;