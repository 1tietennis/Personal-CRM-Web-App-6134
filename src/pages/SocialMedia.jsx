import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';
import PostCreator from '../components/PostCreator';
import AIContentGenerator from '../components/AIContentGenerator';
import AIAutoResponder from '../components/AIAutoResponder';
import SocialAccountManager from '../components/SocialAccountManager';
import PostAnalytics from '../components/PostAnalytics';
import MultiPlatformManager from '../components/MultiPlatformManager';
import PlatformVerificationDashboard from '../components/PlatformVerificationDashboard';
import ConnectionTestSuite from '../components/ConnectionTestSuite';

const {
  FiPlus, FiZap, FiSettings, FiBarChart3, FiGlobe, FiShield, FiActivity,
  FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiBot
} = FiIcons;

function SocialMedia() {
  const { state } = useSocialMedia();
  const { posts, socialAccounts, aiSettings } = state;
  const [activeTab, setActiveTab] = useState('verification');
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const tabs = [
    { id: 'verification', name: 'Verification', icon: FiShield },
    { id: 'testing', name: 'Test Suite', icon: FiActivity },
    { id: 'autoresponder', name: 'Auto-Responder', icon: FiBot },
    { id: 'create', name: 'Create Post', icon: FiPlus },
    { id: 'ai', name: 'AI Generator', icon: FiZap },
    { id: 'automation', name: 'Multi-Platform', icon: FiGlobe },
    { id: 'accounts', name: 'Accounts', icon: FiSettings },
    { id: 'analytics', name: 'Analytics', icon: FiBarChart3 }
  ];

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return FiInstagram;
      case 'twitter': return FiTwitter;
      case 'facebook': return FiFacebook;
      case 'linkedin': return FiLinkedin;
      default: return FiInstagram;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-purple-600';
      case 'twitter': return 'from-blue-400 to-blue-600';
      case 'facebook': return 'from-blue-600 to-blue-800';
      case 'linkedin': return 'from-blue-700 to-blue-900';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const recentPosts = posts.slice(0, 6);

  const handleTestComplete = (results) => {
    console.log('Test suite completed:', results);
    // Handle test completion (e.g., show notifications, update status)
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Media Management</h1>
            <p className="text-gray-600">
              Verify connections, create content, automate responses, and manage your social media presence with AI-powered automation
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAIGenerator(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm"
            >
              <SafeIcon icon={FiZap} className="w-5 h-5 mr-2" />
              AI Generate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPostCreator(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
              Create Post
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Platform Status</p>
              <p className="text-2xl font-bold text-green-600">✓ Verified</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiShield} className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600 mb-1">Connected Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{socialAccounts.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiSettings} className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600 mb-1">Auto-Responder</p>
              <p className="text-2xl font-bold text-purple-600">🤖 Active</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <SafeIcon icon={FiBot} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PlatformVerificationDashboard />
          </motion.div>
        )}

        {activeTab === 'testing' && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ConnectionTestSuite onTestComplete={handleTestComplete} />
          </motion.div>
        )}

        {activeTab === 'autoresponder' && (
          <motion.div
            key="autoresponder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AIAutoResponder />
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
              {recentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {post.media && (
                        <div className="mb-3">
                          <img
                            src={post.media}
                            alt="Post content"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mb-2">
                        {post.platforms?.map((platform) => (
                          <div
                            key={platform}
                            className={`w-6 h-6 rounded-full bg-gradient-to-r ${getPlatformColor(platform)} flex items-center justify-center`}
                          >
                            <SafeIcon icon={getPlatformIcon(platform)} className="w-3 h-3 text-white" />
                          </div>
                        ))}
                        {post.aiGenerated && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <SafeIcon icon={FiZap} className="w-3 h-3 mr-1" />
                            AI Generated
                          </span>
                        )}
                        {post.brandVoice === 'bible-scholar' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            📖 Bible Scholar
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 text-sm line-clamp-3 mb-2">{post.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SafeIcon icon={FiInstagram} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500 mb-6">Create your first social media post to get started</p>
                  <button
                    onClick={() => setShowPostCreator(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center py-8">
                <SafeIcon icon={FiZap} className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Content Generator</h3>
                <p className="text-gray-600 mb-6">Generate engaging content with AI, including Bible Scholar voice</p>
                <button
                  onClick={() => setShowAIGenerator(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <SafeIcon icon={FiZap} className="w-4 h-4 mr-2" />
                  Open AI Generator
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'automation' && (
          <motion.div
            key="automation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MultiPlatformManager />
          </motion.div>
        )}

        {activeTab === 'accounts' && (
          <motion.div
            key="accounts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SocialAccountManager />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PostAnalytics />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <PostCreator isOpen={showPostCreator} onClose={() => setShowPostCreator(false)} />
      <AIContentGenerator isOpen={showAIGenerator} onClose={() => setShowAIGenerator(false)} />
    </motion.div>
  );
}

export default SocialMedia;