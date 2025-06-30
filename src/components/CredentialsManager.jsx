import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SocialMediaAPI from '../services/socialMediaAPI';

const { 
  FiInstagram, FiTwitter, FiLinkedin, FiFacebook, FiEye, FiEyeOff, 
  FiCheck, FiX, FiAlertTriangle, FiRefreshCw, FiExternalLink, FiKey,
  FiShield, FiSettings, FiSave, FiTestTube
} = FiIcons;

function CredentialsManager() {
  const [socialAPI] = useState(new SocialMediaAPI());
  const [credentials, setCredentials] = useState({
    instagram: {
      accessToken: localStorage.getItem('instagram_access_token') || '',
      businessAccountId: localStorage.getItem('instagram_business_id') || '',
      connected: false,
      testing: false,
      testResult: null
    },
    twitter: {
      bearerToken: localStorage.getItem('twitter_bearer_token') || '',
      accessToken: localStorage.getItem('twitter_access_token') || '',
      accessTokenSecret: localStorage.getItem('twitter_access_token_secret') || '',
      connected: false,
      testing: false,
      testResult: null
    },
    linkedin: {
      accessToken: localStorage.getItem('linkedin_access_token') || '',
      personalProfile: localStorage.getItem('linkedin_personal_profile') || '',
      companyPage: localStorage.getItem('linkedin_company_page') || '',
      connected: false,
      testing: false,
      testResult: null
    },
    facebook: {
      accessToken: localStorage.getItem('facebook_access_token') || '',
      pageId: localStorage.getItem('facebook_page_id') || '',
      connected: false,
      testing: false,
      testResult: null
    }
  });

  const [showPasswords, setShowPasswords] = useState({
    instagram: false,
    twitter: false,
    linkedin: false,
    facebook: false
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check connection status on load
    checkAllConnections();
  }, []);

  const checkAllConnections = async () => {
    const platforms = ['instagram', 'twitter', 'linkedin', 'facebook'];
    
    for (const platform of platforms) {
      if (hasRequiredFields(platform)) {
        await testConnection(platform, false); // Silent test
      }
    }
  };

  const hasRequiredFields = (platform) => {
    const creds = credentials[platform];
    
    switch (platform) {
      case 'instagram':
        return creds.accessToken && creds.businessAccountId;
      case 'twitter':
        return creds.bearerToken && creds.accessToken && creds.accessTokenSecret;
      case 'linkedin':
        return creds.accessToken;
      case 'facebook':
        return creds.accessToken && creds.pageId;
      default:
        return false;
    }
  };

  const handleCredentialChange = (platform, field, value) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
        connected: false,
        testResult: null
      }
    }));
  };

  const saveCredentials = (platform) => {
    const creds = credentials[platform];
    
    switch (platform) {
      case 'instagram':
        localStorage.setItem('instagram_access_token', creds.accessToken);
        localStorage.setItem('instagram_business_id', creds.businessAccountId);
        break;
      case 'twitter':
        localStorage.setItem('twitter_bearer_token', creds.bearerToken);
        localStorage.setItem('twitter_access_token', creds.accessToken);
        localStorage.setItem('twitter_access_token_secret', creds.accessTokenSecret);
        break;
      case 'linkedin':
        localStorage.setItem('linkedin_access_token', creds.accessToken);
        localStorage.setItem('linkedin_personal_profile', creds.personalProfile);
        localStorage.setItem('linkedin_company_page', creds.companyPage);
        break;
      case 'facebook':
        localStorage.setItem('facebook_access_token', creds.accessToken);
        localStorage.setItem('facebook_page_id', creds.pageId);
        break;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testConnection = async (platform, showFeedback = true) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        testing: true,
        testResult: null
      }
    }));

    try {
      let result;
      const creds = credentials[platform];

      switch (platform) {
        case 'instagram':
          result = await socialAPI.authenticateInstagram(
            creds.accessToken,
            creds.businessAccountId
          );
          break;
        case 'twitter':
          result = await socialAPI.authenticateTwitter(
            creds.bearerToken,
            creds.accessToken,
            creds.accessTokenSecret
          );
          break;
        case 'linkedin':
          result = await socialAPI.authenticateLinkedIn(
            creds.accessToken,
            creds.personalProfile,
            creds.companyPage
          );
          break;
        case 'facebook':
          result = await socialAPI.authenticateFacebook(
            creds.accessToken,
            creds.pageId
          );
          break;
      }

      setCredentials(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          testing: false,
          connected: result.success,
          testResult: result
        }
      }));

      if (result.success) {
        saveCredentials(platform);
      }

    } catch (error) {
      setCredentials(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          testing: false,
          connected: false,
          testResult: { success: false, error: error.message }
        }
      }));
    }
  };

  const togglePasswordVisibility = (platform) => {
    setShowPasswords(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const clearCredentials = (platform) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        accessToken: '',
        businessAccountId: '',
        bearerToken: '',
        accessTokenSecret: '',
        personalProfile: '',
        companyPage: '',
        pageId: '',
        connected: false,
        testResult: null
      }
    }));

    // Clear from localStorage
    switch (platform) {
      case 'instagram':
        localStorage.removeItem('instagram_access_token');
        localStorage.removeItem('instagram_business_id');
        break;
      case 'twitter':
        localStorage.removeItem('twitter_bearer_token');
        localStorage.removeItem('twitter_access_token');
        localStorage.removeItem('twitter_access_token_secret');
        break;
      case 'linkedin':
        localStorage.removeItem('linkedin_access_token');
        localStorage.removeItem('linkedin_personal_profile');
        localStorage.removeItem('linkedin_company_page');
        break;
      case 'facebook':
        localStorage.removeItem('facebook_access_token');
        localStorage.removeItem('facebook_page_id');
        break;
    }
  };

  const getStatusColor = (platform) => {
    const creds = credentials[platform];
    if (creds.connected) return 'text-green-600 bg-green-50';
    if (creds.testResult && !creds.testResult.success) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusIcon = (platform) => {
    const creds = credentials[platform];
    if (creds.testing) return FiRefreshCw;
    if (creds.connected) return FiCheck;
    if (creds.testResult && !creds.testResult.success) return FiX;
    return FiAlertTriangle;
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

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram Business',
      description: 'Connect your Instagram Business account for automated posting',
      setupUrl: 'https://developers.facebook.com/docs/instagram-api',
      fields: [
        { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
        { key: 'businessAccountId', label: 'Business Account ID', type: 'text', required: true }
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter API v2',
      description: 'Connect your Twitter account using API v2 credentials',
      setupUrl: 'https://developer.twitter.com/en/docs/twitter-api',
      fields: [
        { key: 'bearerToken', label: 'Bearer Token', type: 'password', required: true },
        { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
        { key: 'accessTokenSecret', label: 'Access Token Secret', type: 'password', required: true }
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn OAuth',
      description: 'Connect your LinkedIn personal and/or company profiles',
      setupUrl: 'https://docs.microsoft.com/en-us/linkedin/marketing/',
      fields: [
        { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
        { key: 'personalProfile', label: 'Personal Profile ID', type: 'text', required: false },
        { key: 'companyPage', label: 'Company Page ID', type: 'text', required: false }
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook Pages',
      description: 'Connect your Facebook Page for automated posting',
      setupUrl: 'https://developers.facebook.com/docs/pages-api',
      fields: [
        { key: 'accessToken', label: 'Page Access Token', type: 'password', required: true },
        { key: 'pageId', label: 'Page ID', type: 'text', required: true }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Credentials</h2>
        <p className="text-gray-600">Configure your API credentials for automated social media posting</p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiShield} className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Security Notice</h3>
            <p className="text-sm text-blue-800 mt-1">
              All credentials are stored locally in your browser and never sent to external servers. 
              Your API tokens remain completely private and secure.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Configuration Cards */}
      <div className="space-y-6">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Platform Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPlatformColor(platform.id)} flex items-center justify-center`}>
                    <SafeIcon icon={getPlatformIcon(platform.id)} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Connection Status */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(platform.id)}`}>
                    <SafeIcon 
                      icon={getStatusIcon(platform.id)} 
                      className={`w-4 h-4 mr-1 ${credentials[platform.id].testing ? 'animate-spin' : ''}`} 
                    />
                    {credentials[platform.id].connected ? 'Connected' : 
                     credentials[platform.id].testing ? 'Testing...' : 
                     'Not Connected'}
                  </div>
                  
                  {/* Setup Guide Link */}
                  <a
                    href={platform.setupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Setup Guide"
                  >
                    <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Credentials Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {platform.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiKey} className="w-4 h-4 inline mr-1" />
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !showPasswords[platform.id] ? 'password' : 'text'}
                        value={credentials[platform.id][field.key]}
                        onChange={(e) => handleCredentialChange(platform.id, field.key, e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(platform.id)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <SafeIcon icon={showPasswords[platform.id] ? FiEyeOff : FiEye} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Result */}
              {credentials[platform.id].testResult && (
                <div className={`mb-4 p-3 rounded-lg ${credentials[platform.id].testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-start space-x-2">
                    <SafeIcon 
                      icon={credentials[platform.id].testResult.success ? FiCheck : FiX} 
                      className={`w-4 h-4 mt-0.5 ${credentials[platform.id].testResult.success ? 'text-green-600' : 'text-red-600'}`} 
                    />
                    <div>
                      <p className={`text-sm font-medium ${credentials[platform.id].testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {credentials[platform.id].testResult.success ? 'Connection Successful!' : 'Connection Failed'}
                      </p>
                      {credentials[platform.id].testResult.error && (
                        <p className="text-sm text-red-700 mt-1">
                          {credentials[platform.id].testResult.error}
                        </p>
                      )}
                      {credentials[platform.id].testResult.success && credentials[platform.id].testResult.data && (
                        <div className="text-sm text-green-700 mt-1">
                          <p>✓ Account verified: {credentials[platform.id].testResult.data.name || credentials[platform.id].testResult.data.username || 'Connected successfully'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => testConnection(platform.id)}
                  disabled={!hasRequiredFields(platform.id) || credentials[platform.id].testing}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SafeIcon 
                    icon={credentials[platform.id].testing ? FiRefreshCw : FiTestTube} 
                    className={`w-4 h-4 mr-2 ${credentials[platform.id].testing ? 'animate-spin' : ''}`} 
                  />
                  {credentials[platform.id].testing ? 'Testing...' : 'Test Connection'}
                </button>
                
                <button
                  onClick={() => saveCredentials(platform.id)}
                  disabled={!hasRequiredFields(platform.id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  Save
                </button>
                
                <button
                  onClick={() => clearCredentials(platform.id)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
                  Clear
                </button>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="bg-gray-50 px-6 py-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700">
                  <span>Setup Instructions for {platform.name}</span>
                  <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-gray-400 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="mt-3 text-sm text-gray-600 space-y-2">
                  {platform.id === 'instagram' && (
                    <>
                      <p><strong>1.</strong> Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Developers</a></p>
                      <p><strong>2.</strong> Create a new app and add "Instagram Basic Display" product</p>
                      <p><strong>3.</strong> Get your Instagram Business Account ID from Instagram settings</p>
                      <p><strong>4.</strong> Generate a long-lived access token</p>
                      <p><strong>5.</strong> Add both credentials above and test the connection</p>
                    </>
                  )}
                  {platform.id === 'twitter' && (
                    <>
                      <p><strong>1.</strong> Apply for a <a href="https://developer.twitter.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter Developer account</a></p>
                      <p><strong>2.</strong> Create a new Twitter App in your developer portal</p>
                      <p><strong>3.</strong> Generate Bearer Token and Access Tokens</p>
                      <p><strong>4.</strong> Enable read and write permissions for your app</p>
                      <p><strong>5.</strong> Copy all three tokens and test the connection</p>
                    </>
                  )}
                  {platform.id === 'linkedin' && (
                    <>
                      <p><strong>1.</strong> Create a <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Developer account</a></p>
                      <p><strong>2.</strong> Create a new LinkedIn App</p>
                      <p><strong>3.</strong> Add "Share on LinkedIn" and "Marketing Developer Platform" permissions</p>
                      <p><strong>4.</strong> Complete OAuth flow to get access token</p>
                      <p><strong>5.</strong> Optionally add your personal profile ID and company page ID</p>
                    </>
                  )}
                  {platform.id === 'facebook' && (
                    <>
                      <p><strong>1.</strong> Use your existing <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Developer account</a></p>
                      <p><strong>2.</strong> Create a Facebook App with Pages permissions</p>
                      <p><strong>3.</strong> Get your Facebook Page ID from your page settings</p>
                      <p><strong>4.</strong> Generate a Page Access Token</p>
                      <p><strong>5.</strong> Test the connection with both credentials</p>
                    </>
                  )}
                </div>
              </details>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="w-4 h-4" />
              <span>Credentials saved successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CredentialsManager;