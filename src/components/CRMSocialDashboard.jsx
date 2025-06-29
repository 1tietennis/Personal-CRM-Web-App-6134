import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCRM } from '../context/CRMContext';
import { useSocialMedia } from '../context/SocialMediaContext';
import CRMSocialIntegration from '../services/crmSocialIntegration';

const { 
  FiUsers, FiMessageCircle, FiActivity, FiSettings, FiPlay, FiPause,
  FiRefreshCw, FiCheck, FiClock, FiTrendingUp, FiZap, FiCalendar,
  FiInstagram, FiTwitter, FiLinkedin, FiFacebook
} = FiIcons;

function CRMSocialDashboard() {
  const { state: crmState } = useCRM();
  const { state: socialState } = useSocialMedia();
  const [integration] = useState(new CRMSocialIntegration());
  const [automationStatus, setAutomationStatus] = useState(null);
  const [integrationMetrics, setIntegrationMetrics] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResults, setLastResults] = useState(null);

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [crmState.contacts, crmState.interactions]);

  const updateStatus = () => {
    const status = integration.getAutomationStatus();
    const metrics = integration.getIntegrationMetrics(crmState.contacts, crmState.interactions);
    setAutomationStatus(status);
    setIntegrationMetrics(metrics);
  };

  const handleManualSync = async () => {
    setIsProcessing(true);
    try {
      const results = await integration.triggerManualSync(crmState.contacts, crmState.interactions);
      setLastResults(results);
      updateStatus();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAutomation = () => {
    const newState = !automationStatus.isActive;
    integration.toggleAutomation(newState);
    updateStatus();
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return FiInstagram;
      case 'twitter': return FiTwitter;
      case 'linkedin': return FiLinkedin;
      case 'facebook': return FiFacebook;
      default: return FiActivity;
    }
  };

  if (!automationStatus || !integrationMetrics) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">CRM Social Integration</h2>
          <p className="text-gray-600">Automated social media posting based on CRM activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleAutomation}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              automationStatus.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={automationStatus.isActive ? FiPause : FiPlay} className="w-4 h-4 mr-2" />
            {automationStatus.isActive ? 'Automation ON' : 'Automation OFF'}
          </button>
          <button
            onClick={handleManualSync}
            disabled={isProcessing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <SafeIcon 
              icon={isProcessing ? FiRefreshCw : FiZap} 
              className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} 
            />
            {isProcessing ? 'Processing...' : 'Manual Sync'}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{integrationMetrics.totalContacts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600 mb-1">Weekly Interactions</p>
              <p className="text-2xl font-bold text-gray-900">{integrationMetrics.recentInteractions}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiMessageCircle} className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600 mb-1">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">{integrationMetrics.automationRulesActive}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <SafeIcon icon={FiSettings} className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Birthdays</p>
              <p className="text-2xl font-bold text-gray-900">{integrationMetrics.upcomingBirthdays}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(automationStatus.rules).map(([ruleId, rule]) => (
            <div key={ruleId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">
                  {ruleId.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Platforms: {rule.platforms.join(', ')}
              </p>
              {rule.frequency && (
                <p className="text-xs text-gray-500">Frequency: {rule.frequency}</p>
              )}
              {rule.delay && (
                <p className="text-xs text-gray-500">Delay: {rule.delay}h</p>
              )}
              {rule.intervals && (
                <p className="text-xs text-gray-500">Intervals: {rule.intervals.join(', ')} days</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Last Sync Results */}
      {lastResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Sync Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{lastResults.processed}</div>
              <div className="text-sm text-gray-600">Processed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{lastResults.successful}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{lastResults.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>

          {/* Workflow Results */}
          <div className="space-y-3">
            {lastResults.workflows.map((workflow, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {workflow.rule.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600">{workflow.successful} success</span>
                    <span className="text-sm text-red-600">{workflow.failed} failed</span>
                  </div>
                </div>
                
                {workflow.posts.length > 0 && (
                  <div className="space-y-2">
                    {workflow.posts.map((post, postIndex) => (
                      <div key={postIndex} className="bg-gray-50 rounded p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {post.contact || post.client || post.type}
                          </span>
                          <div className="flex space-x-1">
                            {post.platforms.map((platform) => (
                              <SafeIcon 
                                key={platform}
                                icon={getPlatformIcon(platform)} 
                                className="w-4 h-4 text-gray-600" 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{post.content}</p>
                        {post.followUpDays && (
                          <p className="text-xs text-gray-500 mt-1">
                            Follow-up after {post.followUpDays} days
                          </p>
                        )}
                        {post.interactions && (
                          <p className="text-xs text-gray-500 mt-1">
                            Based on {post.interactions} recent interactions
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Completed: {new Date(lastResults.timestamp).toLocaleString()}
          </div>
        </motion.div>
      )}

      {/* Integration Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">CRM Data</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Contacts</span>
                <span className="text-sm font-medium text-gray-900">{integrationMetrics.totalContacts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Client Contacts</span>
                <span className="text-sm font-medium text-gray-900">{integrationMetrics.clientContacts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recent Interactions</span>
                <span className="text-sm font-medium text-gray-900">{integrationMetrics.recentInteractions}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Social Media</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connected Platforms</span>
                <span className="text-sm font-medium text-gray-900">{socialState.socialAccounts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Posts</span>
                <span className="text-sm font-medium text-gray-900">{socialState.posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="text-sm font-medium text-gray-900">
                  {automationStatus.lastSync ? 
                    new Date(automationStatus.lastSync).toLocaleDateString() : 
                    'Never'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CRMSocialDashboard;