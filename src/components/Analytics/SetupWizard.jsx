import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

function SetupWizard({ onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState({
    googleAnalytics: {
      apiKey: '',
      viewId: '',
      trackingId: ''
    },
    searchConsole: {
      siteUrl: '',
      accessToken: ''
    },
    gmb: {
      accessToken: '',
      locationId: ''
    },
    youtube: {
      apiKey: '',
      channelId: ''
    }
  });

  const setupSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Analytics Setup',
      description: 'Let\'s connect your analytics accounts step by step',
      component: WelcomeStep
    },
    {
      id: 'google_analytics',
      title: 'Google Analytics',
      description: 'Connect your Google Analytics account',
      component: GoogleAnalyticsStep
    },
    {
      id: 'search_console',
      title: 'Search Console',
      description: 'Set up Google Search Console integration',
      component: SearchConsoleStep
    },
    {
      id: 'gmb',
      title: 'Google My Business',
      description: 'Connect your GMB location',
      component: GMBStep
    },
    {
      id: 'youtube',
      title: 'YouTube Analytics',
      description: 'Add your YouTube channel',
      component: YouTubeStep
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'Your analytics are ready to use',
      component: CompleteStep
    }
  ];

  const nextStep = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateSetupData = (section, data) => {
    setSetupData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleComplete = () => {
    // Save setup data to localStorage
    Object.entries(setupData).forEach(([section, data]) => {
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          localStorage.setItem(`${section}_${key}`, value);
        }
      });
    });
    
    onComplete(setupData);
  };

  const CurrentStepComponent = setupSteps[currentStep].component;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Analytics Setup</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              {setupSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep ? 'bg-green-500 text-white' :
                    index === currentStep ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <Icons.Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < setupSteps.length - 1 && (
                    <div className={`flex-1 h-1 rounded ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {setupSteps.length}: {setupSteps[currentStep].title}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent
                data={setupData}
                updateData={updateSetupData}
                onNext={nextStep}
                onPrev={prevStep}
                onComplete={handleComplete}
                isFirst={currentStep === 0}
                isLast={currentStep === setupSteps.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep({ onNext }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icons.BarChart3 className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Analytics Setup</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We'll help you connect all your analytics accounts in just a few steps. 
        This ensures you get comprehensive insights from all your digital channels.
      </p>
      <div className="space-y-3 text-left max-w-md mx-auto mb-8">
        <div className="flex items-center space-x-3">
          <Icons.Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">Google Analytics integration</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icons.Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">Search Console data</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icons.Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">Google My Business metrics</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icons.Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">YouTube analytics</span>
        </div>
      </div>
      <button
        onClick={onNext}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}

function GoogleAnalyticsStep({ data, updateData, onNext, onPrev }) {
  const [formData, setFormData] = useState(data.googleAnalytics);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('googleAnalytics', formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Analytics Setup</h3>
        <p className="text-gray-600 mb-6">
          Connect your Google Analytics account to track website performance and user behavior.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your Google Analytics API key"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from the <a href="https://console.developers.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Developer Console</a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            View ID
          </label>
          <input
            type="text"
            value={formData.viewId}
            onChange={(e) => setFormData({...formData, viewId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123456789"
          />
          <p className="text-xs text-gray-500 mt-1">
            Find your View ID in Google Analytics under Admin → View → View Settings
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking ID (Optional)
          </label>
          <input
            type="text"
            value={formData.trackingId}
            onChange={(e) => setFormData({...formData, trackingId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}

function SearchConsoleStep({ data, updateData, onNext, onPrev }) {
  const [formData, setFormData] = useState(data.searchConsole);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('searchConsole', formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Search Console</h3>
        <p className="text-gray-600 mb-6">
          Connect Search Console to track your search performance and keyword rankings.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site URL
          </label>
          <input
            type="url"
            value={formData.siteUrl}
            onChange={(e) => setFormData({...formData, siteUrl: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourwebsite.com"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This must match exactly with your verified property in Search Console
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Access Token
          </label>
          <input
            type="password"
            value={formData.accessToken}
            onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your Search Console access token"
          />
          <p className="text-xs text-gray-500 mt-1">
            Generate an access token through Google OAuth 2.0 flow
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Verify your website in Google Search Console</li>
            <li>2. Enable the Search Console API in Google Developer Console</li>
            <li>3. Create OAuth 2.0 credentials</li>
            <li>4. Generate an access token with appropriate scopes</li>
          </ol>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}

function GMBStep({ data, updateData, onNext, onPrev }) {
  const [formData, setFormData] = useState(data.gmb);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('gmb', formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Google My Business</h3>
        <p className="text-gray-600 mb-6">
          Connect your GMB location to track local search performance and customer actions.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Access Token
          </label>
          <input
            type="password"
            value={formData.accessToken}
            onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your GMB access token"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location ID
          </label>
          <input
            type="text"
            value={formData.locationId}
            onChange={(e) => setFormData({...formData, locationId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your GMB location ID"
          />
          <p className="text-xs text-gray-500 mt-1">
            Find your location ID in the GMB API or through the My Business API
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icons.Info className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Optional Setup</h4>
              <p className="text-sm text-amber-800">
                GMB integration is optional. You can skip this step and set it up later in Settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Skip
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}

function YouTubeStep({ data, updateData, onNext, onPrev }) {
  const [formData, setFormData] = useState(data.youtube);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('youtube', formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">YouTube Analytics</h3>
        <p className="text-gray-600 mb-6">
          Connect your YouTube channel to track video performance and audience engagement.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            YouTube API Key
          </label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your YouTube Data API key"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Channel ID
          </label>
          <input
            type="text"
            value={formData.channelId}
            onChange={(e) => setFormData({...formData, channelId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="UCxxxxxxxxxxxxxxxxxx"
          />
          <p className="text-xs text-gray-500 mt-1">
            Find your Channel ID in YouTube Studio under Settings → Channel → Advanced settings
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icons.Info className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Optional Setup</h4>
              <p className="text-sm text-amber-800">
                YouTube integration is optional. You can skip this step and set it up later in Settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Skip
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}

function CompleteStep({ onComplete }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icons.Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Setup Complete!</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your analytics connections are now configured. You can start viewing comprehensive 
        insights from all your connected platforms.
      </p>
      <div className="space-y-3 text-left max-w-md mx-auto mb-8">
        <div className="flex items-center space-x-3">
          <Icons.BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-700">Real-time analytics dashboard</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icons.TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">Performance tracking</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icons.Target className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-gray-700">Goal conversion monitoring</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icons.Bell className="w-5 h-5 text-orange-600" />
          <span className="text-sm text-gray-700">Automated alerts and insights</span>
        </div>
      </div>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Start Using Analytics
      </button>
    </div>
  );
}

export default SetupWizard;