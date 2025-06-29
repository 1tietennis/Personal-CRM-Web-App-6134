import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';

const { FiPlus, FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiCheck, FiX, FiSettings } = FiIcons;

function SocialAccountManager() {
  const { state, dispatch } = useSocialMedia();
  const { socialAccounts } = state;
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: FiInstagram, color: 'from-pink-500 to-purple-600' },
    { id: 'twitter', name: 'Twitter', icon: FiTwitter, color: 'from-blue-400 to-blue-600' },
    { id: 'facebook', name: 'Facebook', icon: FiFacebook, color: 'from-blue-600 to-blue-800' },
    { id: 'linkedin', name: 'LinkedIn', icon: FiLinkedin, color: 'from-blue-700 to-blue-900' }
  ];

  const handleConnectAccount = (platformId) => {
    // Simulate account connection
    const platform = platforms.find(p => p.id === platformId);
    const newAccount = {
      platform: platformId,
      name: platform.name,
      username: `@your_${platformId}_handle`,
      connected: true,
      followers: Math.floor(Math.random() * 10000) + 1000,
      posts: Math.floor(Math.random() * 500) + 50
    };

    dispatch({ type: 'ADD_SOCIAL_ACCOUNT', payload: newAccount });
    setShowAddAccount(false);
    setSelectedPlatform('');
  };

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : FiSettings;
  };

  const getPlatformColor = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.color : 'from-gray-500 to-gray-700';
  };

  const connectedPlatforms = socialAccounts.map(account => account.platform);
  const availablePlatforms = platforms.filter(p => !connectedPlatforms.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Connected Accounts</h2>
          <p className="text-gray-600">Manage your social media accounts and connections</p>
        </div>
        
        {availablePlatforms.length > 0 && (
          <button
            onClick={() => setShowAddAccount(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Connect Account
          </button>
        )}
      </div>

      {/* Connected Accounts */}
      {socialAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPlatformColor(account.platform)} flex items-center justify-center`}>
                    <SafeIcon icon={getPlatformIcon(account.platform)} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600">{account.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <SafeIcon icon={FiCheck} className="w-3 h-3 mr-1" />
                    Connected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{account.posts}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Settings
                </button>
                <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                  Disconnect
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <SafeIcon icon={FiSettings} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
          <p className="text-gray-500 mb-6">Connect your social media accounts to start managing your content</p>
          <button
            onClick={() => setShowAddAccount(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Connect Your First Account
          </button>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowAddAccount(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Connect Social Account</h3>
                <button
                  onClick={() => setShowAddAccount(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600 mb-4">Choose a platform to connect:</p>
                
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleConnectAccount(platform.id)}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                        <SafeIcon icon={platform.icon} className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{platform.name}</span>
                    </div>
                    <SafeIcon icon={FiPlus} className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a demo. In a real application, you would be redirected to the platform's OAuth flow to authenticate your account.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialAccountManager;