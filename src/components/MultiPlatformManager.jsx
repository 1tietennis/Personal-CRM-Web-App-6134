import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SocialMediaAPI from '../services/socialMediaAPI';

const { 
  FiSettings, FiPlay, FiCheck, FiX, FiAlertTriangle, FiRefreshCw, 
  FiInstagram, FiTwitter, FiLinkedin, FiFacebook, FiMail, FiEye 
} = FiIcons;

function MultiPlatformManager() {
  const [api] = useState(new SocialMediaAPI());
  const [connectionStatus, setConnectionStatus] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [lastPostResults, setLastPostResults] = useState(null);
  
  const [postContent, setPostContent] = useState({
    text: '',
    scripture: '',
    cta: '',
    hashtags: [],
    brandVoice: 'bible-scholar'
  });

  const [credentials, setCredentials] = useState({
    instagram: { accessToken: '', businessAccountId: '' },
    twitter: { bearerToken: '', accessToken: '', accessTokenSecret: '' },
    linkedin: { accessToken: '', personalProfile: '', companyPage: '' },
    facebook: { accessToken: '', pageId: '' }
  });

  useEffect(() => {
    updateConnectionStatus();
  }, []);

  const updateConnectionStatus = () => {
    const status = api.getConnectionStatus();
    setConnectionStatus(status);
  };

  const handleConnect = async (platform) => {
    let result;
    
    switch (platform) {
      case 'instagram':
        result = await api.authenticateInstagram(
          credentials.instagram.accessToken,
          credentials.instagram.businessAccountId
        );
        break;
      case 'twitter':
        result = await api.authenticateTwitter(
          credentials.twitter.bearerToken,
          credentials.twitter.accessToken,
          credentials.twitter.accessTokenSecret
        );
        break;
      case 'linkedin':
        result = await api.authenticateLinkedIn(
          credentials.linkedin.accessToken,
          credentials.linkedin.personalProfile,
          credentials.linkedin.companyPage
        );
        break;
      case 'facebook':
        result = await api.authenticateFacebook(
          credentials.facebook.accessToken,
          credentials.facebook.pageId
        );
        break;
    }

    if (result.success) {
      updateConnectionStatus();
    } else {
      alert(`Failed to connect ${platform}: ${result.error}`);
    }
  };

  const runTestSuite = async () => {
    setTestResults([]); // Clear previous results
    const results = await api.runTestSuite();
    setTestResults(results);
  };

  const postToAllPlatforms = async () => {
    if (!postContent.text.trim()) {
      alert('Please enter content to post');
      return;
    }

    setIsPosting(true);
    
    try {
      const results = await api.postToAllPlatforms(postContent);
      setLastPostResults(results);
    } catch (error) {
      console.error('Posting failed:', error);
      alert('Posting failed: ' + error.message);
    } finally {
      setIsPosting(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return FiInstagram;
      case 'twitter': return FiTwitter;
      case 'linkedin_personal':
      case 'linkedin_company': return FiLinkedin;
      case 'facebook': return FiFacebook;
      default: return FiSettings;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-purple-600';
      case 'twitter': return 'from-blue-400 to-blue-600';
      case 'linkedin_personal':
      case 'linkedin_company': return 'from-blue-600 to-blue-800';
      case 'facebook': return 'from-blue-700 to-blue-900';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Multi-Platform Integration</h2>
        <p className="text-gray-600">Manage and automate posting across all social media platforms</p>
      </div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Platform Connections</h3>
          <button
            onClick={updateConnectionStatus}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {connectionStatus.map((platform) => (
            <div key={platform.platform} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getPlatformColor(platform.platform)} flex items-center justify-center`}>
                    <SafeIcon icon={getPlatformIcon(platform.platform)} className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 capitalize">
                    {platform.platform.replace('_', ' ')}
                  </span>
                </div>
                <SafeIcon 
                  icon={platform.connected ? FiCheck : FiX} 
                  className={`w-4 h-4 ${platform.connected ? 'text-green-600' : 'text-red-600'}`} 
                />
              </div>
              
              <div className="text-xs text-gray-500">
                {platform.lastTest ? `Last tested: ${new Date(platform.lastTest).toLocaleDateString()}` : 'Never tested'}
              </div>
              
              {!platform.connected && (
                <div className="mt-3 space-y-2">
                  {platform.platform === 'instagram' && (
                    <>
                      <input
                        type="password"
                        placeholder="Access Token"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.instagram.accessToken}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          instagram: { ...prev.instagram, accessToken: e.target.value }
                        }))}
                      />
                      <input
                        type="text"
                        placeholder="Business Account ID"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.instagram.businessAccountId}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          instagram: { ...prev.instagram, businessAccountId: e.target.value }
                        }))}
                      />
                    </>
                  )}
                  
                  {platform.platform === 'twitter' && (
                    <>
                      <input
                        type="password"
                        placeholder="Bearer Token"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.twitter.bearerToken}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          twitter: { ...prev.twitter, bearerToken: e.target.value }
                        }))}
                      />
                      <input
                        type="password"
                        placeholder="Access Token"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.twitter.accessToken}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          twitter: { ...prev.twitter, accessToken: e.target.value }
                        }))}
                      />
                      <input
                        type="password"
                        placeholder="Access Token Secret"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.twitter.accessTokenSecret}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          twitter: { ...prev.twitter, accessTokenSecret: e.target.value }
                        }))}
                      />
                    </>
                  )}
                  
                  {(platform.platform === 'linkedin_personal' || platform.platform === 'linkedin_company') && (
                    <>
                      <input
                        type="password"
                        placeholder="Access Token"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.linkedin.accessToken}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          linkedin: { ...prev.linkedin, accessToken: e.target.value }
                        }))}
                      />
                      <input
                        type="text"
                        placeholder="Personal Profile ID"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.linkedin.personalProfile}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          linkedin: { ...prev.linkedin, personalProfile: e.target.value }
                        }))}
                      />
                      <input
                        type="text"
                        placeholder="Company Page ID"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.linkedin.companyPage}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          linkedin: { ...prev.linkedin, companyPage: e.target.value }
                        }))}
                      />
                    </>
                  )}
                  
                  {platform.platform === 'facebook' && (
                    <>
                      <input
                        type="password"
                        placeholder="Access Token"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.facebook.accessToken}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          facebook: { ...prev.facebook, accessToken: e.target.value }
                        }))}
                      />
                      <input
                        type="text"
                        placeholder="Page ID"
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        value={credentials.facebook.pageId}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          facebook: { ...prev.facebook, pageId: e.target.value }
                        }))}
                      />
                    </>
                  )}
                  
                  <button
                    onClick={() => handleConnect(platform.platform.split('_')[0])}
                    className="w-full text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Content Composer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Multi-Platform Post Composer</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
            <textarea
              value={postContent.text}
              onChange={(e) => setPostContent(prev => ({ ...prev, text: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your main post content here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scripture Reference</label>
              <input
                type="text"
                value={postContent.scripture}
                onChange={(e) => setPostContent(prev => ({ ...prev, scripture: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., John 3:16"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
              <input
                type="text"
                value={postContent.cta}
                onChange={(e) => setPostContent(prev => ({ ...prev, cta: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Share your thoughts in the comments"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags (comma-separated)</label>
            <input
              type="text"
              value={postContent.hashtags.join(', ')}
              onChange={(e) => setPostContent(prev => ({ 
                ...prev, 
                hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="#BibleStudy, #Faith, #Scripture"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Voice</label>
            <select
              value={postContent.brandVoice}
              onChange={(e) => setPostContent(prev => ({ ...prev, brandVoice: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="inspirational">Inspirational</option>
              <option value="bible-scholar">Bible Scholar 📖</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={postToAllPlatforms}
            disabled={isPosting || !postContent.text.trim()}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPosting ? (
              <>
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2 animate-spin" />
                Posting to All Platforms...
              </>
            ) : (
              <>
                <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" />
                Post to All Platforms
              </>
            )}
          </button>

          <button
            onClick={runTestSuite}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
            Run Tests
          </button>
        </div>
      </motion.div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getPlatformColor(result.platform)} flex items-center justify-center`}>
                    <SafeIcon icon={getPlatformIcon(result.platform)} className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium capitalize">{result.platform.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    icon={result.success ? FiCheck : FiX} 
                    className={`w-4 h-4 ${result.success ? 'text-green-600' : 'text-red-600'}`} 
                  />
                  {!result.success && result.error && (
                    <span className="text-sm text-red-600">{result.error}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Last Post Results */}
      {lastPostResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Post Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Successes */}
            <div>
              <h4 className="font-medium text-green-800 mb-3">✅ Successful Posts ({lastPostResults.successes.length})</h4>
              <div className="space-y-2">
                {lastPostResults.successes.map((success, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{success.platform.replace('_', ' ')}</span>
                      <a
                        href={success.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        View Post
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Errors */}
            <div>
              <h4 className="font-medium text-red-800 mb-3">❌ Failed Posts ({lastPostResults.errors.length})</h4>
              <div className="space-y-2">
                {lastPostResults.errors.map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="font-medium capitalize mb-1">{error.platform.replace('_', ' ')}</div>
                    <div className="text-sm text-red-600">{error.error}</div>
                    {error.fallbackRequired && (
                      <div className="text-xs text-orange-600 mt-1">
                        <SafeIcon icon={FiMail} className="w-3 h-3 inline mr-1" />
                        Fallback email triggered
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {lastPostResults.fallbacksTriggered && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-800">
                  Some platforms failed. Fallback notifications have been sent to administrators.
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default MultiPlatformManager;