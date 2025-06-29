import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SocialMediaVerification from '../services/socialMediaVerification';

const { 
  FiCheck, FiX, FiAlertTriangle, FiRefreshCw, FiSettings, FiPlay,
  FiInstagram, FiTwitter, FiLinkedin, FiFacebook, FiShield, FiActivity,
  FiBell, FiInfo, FiExternalLink, FiClock, FiZap
} = FiIcons;

function PlatformVerificationDashboard() {
  const [verification] = useState(new SocialMediaVerification());
  const [verificationResults, setVerificationResults] = useState(null);
  const [healthCheck, setHealthCheck] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    // Initial verification on component mount
    handleVerifyAll();
  }, []);

  useEffect(() => {
    // Auto-refresh every 5 minutes if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        handleHealthCheck();
      }, 5 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleVerifyAll = async () => {
    setIsVerifying(true);
    try {
      const results = await verification.verifyAllPlatforms();
      setVerificationResults(results);
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleHealthCheck = async () => {
    setIsHealthChecking(true);
    try {
      const health = await verification.runHealthCheck();
      setHealthCheck(health);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsHealthChecking(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return FiInstagram;
      case 'twitter': return FiTwitter;
      case 'linkedin': return FiLinkedin;
      case 'facebook': return FiFacebook;
      default: return FiSettings;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-purple-600';
      case 'twitter': return 'from-blue-400 to-blue-600';
      case 'linkedin': return 'from-blue-600 to-blue-800';
      case 'facebook': return 'from-blue-700 to-blue-900';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'passed':
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning':
      case 'simulated': return 'text-yellow-600 bg-yellow-50';
      case 'failed':
      case 'auth_failed':
      case 'not_configured':
      case 'unhealthy': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'passed':
      case 'healthy': return FiCheck;
      case 'warning':
      case 'simulated': return FiAlertTriangle;
      case 'failed':
      case 'auth_failed':
      case 'not_configured':
      case 'unhealthy': return FiX;
      case 'pending': return FiClock;
      default: return FiInfo;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Verification</h2>
          <p className="text-gray-600">Verify and monitor all social media platform connections</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
              autoRefresh ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiActivity} className="w-4 h-4 mr-2" />
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={handleHealthCheck}
            disabled={isHealthChecking}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <SafeIcon 
              icon={isHealthChecking ? FiRefreshCw : FiShield} 
              className={`w-4 h-4 mr-2 ${isHealthChecking ? 'animate-spin' : ''}`} 
            />
            Health Check
          </button>
          <button
            onClick={handleVerifyAll}
            disabled={isVerifying}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <SafeIcon 
              icon={isVerifying ? FiRefreshCw : FiPlay} 
              className={`w-4 h-4 mr-2 ${isVerifying ? 'animate-spin' : ''}`} 
            />
            Verify All
          </button>
        </div>
      </div>

      {/* Overall Status */}
      {verificationResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Overall Status</h3>
            <div className="text-sm text-gray-500">
              Last verified: {formatTimestamp(verificationResults.timestamp)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {verificationResults.summary.total}
              </div>
              <div className="text-sm text-gray-600">Total Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {verificationResults.summary.connected}
              </div>
              <div className="text-sm text-gray-600">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {verificationResults.summary.warnings}
              </div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {verificationResults.summary.failed}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>

          {/* Overall Status Badge */}
          <div className="flex items-center justify-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              verificationResults.overall_status === 'all_connected' ? 'bg-green-100 text-green-800' :
              verificationResults.overall_status === 'partial_connected' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <SafeIcon 
                icon={
                  verificationResults.overall_status === 'all_connected' ? FiCheck :
                  verificationResults.overall_status === 'partial_connected' ? FiAlertTriangle :
                  FiX
                } 
                className="w-4 h-4 mr-2" 
              />
              {verificationResults.overall_status === 'all_connected' ? 'All Platforms Connected' :
               verificationResults.overall_status === 'partial_connected' ? 'Partially Connected' :
               'Connection Issues Detected'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Platform Details */}
      {verificationResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(verificationResults.platforms).map(([platform, result]) => (
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {/* Platform Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPlatformColor(platform)} flex items-center justify-center`}>
                    <SafeIcon icon={getPlatformIcon(platform)} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{platform}</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      <SafeIcon icon={getStatusIcon(result.status)} className="w-3 h-3 mr-1" />
                      {result.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
                {result.details?.page_url || result.details?.username ? (
                  <a
                    href={result.details.page_url || `https://${platform}.com/${result.details.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                  </a>
                ) : null}
              </div>

              {/* Platform Details */}
              {result.details && Object.keys(result.details).length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {result.details.account_name && (
                      <div><span className="font-medium">Account:</span> {result.details.account_name}</div>
                    )}
                    {result.details.name && (
                      <div><span className="font-medium">Name:</span> {result.details.name}</div>
                    )}
                    {result.details.username && (
                      <div><span className="font-medium">Username:</span> @{result.details.username}</div>
                    )}
                    {result.details.followers !== undefined && (
                      <div><span className="font-medium">Followers:</span> {result.details.followers.toLocaleString()}</div>
                    )}
                    {result.details.posts !== undefined && (
                      <div><span className="font-medium">Posts:</span> {result.details.posts.toLocaleString()}</div>
                    )}
                    {result.details.verified && (
                      <div><span className="font-medium">Verified:</span> ✓</div>
                    )}
                  </div>
                </div>
              )}

              {/* Test Results */}
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 text-sm mb-3">Verification Tests</h5>
                {Object.entries(result.tests).map(([test, testResult]) => (
                  <div key={test} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 capitalize">
                      {test.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <SafeIcon 
                        icon={getStatusIcon(testResult.status)} 
                        className={`w-4 h-4 ${
                          testResult.status === 'passed' ? 'text-green-600' :
                          testResult.status === 'warning' || testResult.status === 'simulated' ? 'text-yellow-600' :
                          testResult.status === 'failed' ? 'text-red-600' :
                          'text-gray-600'
                        }`} 
                      />
                      <span className="text-xs text-gray-600">{testResult.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h6 className="font-medium text-blue-900 text-sm mb-2">Recommendations</h6>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-xs text-blue-700 flex items-start">
                        <span className="text-blue-400 mr-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Health Check Results */}
      {healthCheck && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health Check</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              healthCheck.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <SafeIcon icon={healthCheck.status === 'healthy' ? FiCheck : FiAlertTriangle} className="w-4 h-4 mr-1" />
              {healthCheck.status.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(healthCheck.checks.api_endpoints).map(([platform, status]) => (
              <div key={platform} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 capitalize">{platform}</span>
                  <SafeIcon 
                    icon={status === 'healthy' ? FiCheck : FiX} 
                    className={`w-4 h-4 ${status === 'healthy' ? 'text-green-600' : 'text-red-600'}`} 
                  />
                </div>
                <div className="text-xs text-gray-600">API Endpoint</div>
                <div className={`text-xs font-medium ${status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </div>
              </div>
            ))}
          </div>

          {healthCheck.alerts && healthCheck.alerts.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 text-sm mb-2">Alerts</h4>
              <ul className="space-y-1">
                {healthCheck.alerts.map((alert, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-center">
                    <SafeIcon icon={FiBell} className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">{alert.platform}:</span>&nbsp;{alert.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            Last checked: {formatTimestamp(healthCheck.timestamp)}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {verificationResults?.recommendations && verificationResults.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {verificationResults.recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-2 ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{rec.message}</p>
                    <p className="text-xs text-gray-600">{rec.action}</p>
                  </div>
                  <SafeIcon 
                    icon={
                      rec.type === 'setup' ? FiSettings :
                      rec.type === 'fix' ? FiZap :
                      FiInfo
                    } 
                    className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading States */}
      {(isVerifying || isHealthChecking) && !verificationResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <SafeIcon icon={FiRefreshCw} className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isVerifying ? 'Verifying Platforms...' : 'Running Health Check...'}
              </h3>
              <p className="text-gray-600">
                {isVerifying ? 'Testing connections and permissions' : 'Checking system health'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PlatformVerificationDashboard;