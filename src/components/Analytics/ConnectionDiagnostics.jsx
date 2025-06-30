import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

function ConnectionDiagnostics({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [connectionIssues, setConnectionIssues] = useState([]);

  const diagnosticSteps = [
    {
      id: 'network',
      name: 'Network Connectivity',
      description: 'Testing internet connection and DNS resolution',
      tests: [
        { name: 'Internet Connection', endpoint: 'https://www.google.com' },
        { name: 'DNS Resolution', endpoint: 'https://analytics.google.com' },
        { name: 'CDN Access', endpoint: 'https://cdn.jsdelivr.net' }
      ]
    },
    {
      id: 'google_analytics',
      name: 'Google Analytics API',
      description: 'Verifying Google Analytics connection and permissions',
      tests: [
        { name: 'API Endpoint', endpoint: 'https://analyticsreporting.googleapis.com' },
        { name: 'Authentication', endpoint: 'oauth_check' },
        { name: 'Data Access', endpoint: 'analytics_data' }
      ]
    },
    {
      id: 'search_console',
      name: 'Google Search Console',
      description: 'Testing Search Console API connectivity',
      tests: [
        { name: 'API Endpoint', endpoint: 'https://searchconsole.googleapis.com' },
        { name: 'Site Verification', endpoint: 'site_verification' },
        { name: 'Query Access', endpoint: 'search_analytics' }
      ]
    },
    {
      id: 'gmb',
      name: 'Google My Business',
      description: 'Checking GMB API access and location data',
      tests: [
        { name: 'API Endpoint', endpoint: 'https://mybusiness.googleapis.com' },
        { name: 'Location Access', endpoint: 'locations' },
        { name: 'Insights Data', endpoint: 'insights' }
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube Analytics',
      description: 'Verifying YouTube Data API connection',
      tests: [
        { name: 'API Endpoint', endpoint: 'https://youtubeanalytics.googleapis.com' },
        { name: 'Channel Access', endpoint: 'channels' },
        { name: 'Analytics Data', endpoint: 'reports' }
      ]
    }
  ];

  const runDiagnostics = async () => {
    setIsRunning(true);
    setTestResults({});
    setConnectionIssues([]);

    for (let stepIndex = 0; stepIndex < diagnosticSteps.length; stepIndex++) {
      setCurrentStep(stepIndex);
      const step = diagnosticSteps[stepIndex];
      
      const stepResults = {};
      
      for (const test of step.tests) {
        try {
          const result = await runTest(test, step.id);
          stepResults[test.name] = result;
          
          if (!result.success) {
            setConnectionIssues(prev => [...prev, {
              step: step.name,
              test: test.name,
              error: result.error,
              solution: result.solution
            }]);
          }
        } catch (error) {
          stepResults[test.name] = {
            success: false,
            error: error.message,
            solution: 'Check console for detailed error information'
          };
        }
        
        // Update results in real-time
        setTestResults(prev => ({
          ...prev,
          [step.id]: stepResults
        }));
        
        // Delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsRunning(false);
  };

  const runTest = async (test, stepId) => {
    switch (stepId) {
      case 'network':
        return await testNetworkConnectivity(test);
      case 'google_analytics':
        return await testGoogleAnalytics(test);
      case 'search_console':
        return await testSearchConsole(test);
      case 'gmb':
        return await testGMB(test);
      case 'youtube':
        return await testYouTube(test);
      default:
        return { success: false, error: 'Unknown test type' };
    }
  };

  const testNetworkConnectivity = async (test) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(test.endpoint, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      
      return {
        success: true,
        message: 'Connection successful',
        responseTime: Date.now()
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Connection timeout',
          solution: 'Check your internet connection and try again'
        };
      }
      
      return {
        success: false,
        error: error.message,
        solution: 'Verify network connectivity and firewall settings'
      };
    }
  };

  const testGoogleAnalytics = async (test) => {
    const apiKey = localStorage.getItem('google_analytics_api_key');
    const viewId = localStorage.getItem('google_analytics_view_id');
    
    if (test.name === 'Authentication') {
      if (!apiKey) {
        return {
          success: false,
          error: 'Missing API key',
          solution: 'Add your Google Analytics API key in Settings'
        };
      }
      
      if (!viewId) {
        return {
          success: false,
          error: 'Missing View ID',
          solution: 'Configure your Google Analytics View ID in Settings'
        };
      }
      
      return { success: true, message: 'Credentials found' };
    }
    
    if (test.name === 'API Endpoint') {
      try {
        const response = await fetch('https://analyticsreporting.googleapis.com/v4/reports:batchGet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reportRequests: [{
              viewId: viewId,
              dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
              metrics: [{ expression: 'ga:sessions' }]
            }]
          })
        });
        
        return {
          success: response.status !== 403,
          message: response.status === 403 ? 'Authentication required' : 'API accessible',
          solution: response.status === 403 ? 'Check API credentials and permissions' : null
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          solution: 'Verify API endpoint accessibility'
        };
      }
    }
    
    return { success: true, message: 'Test completed' };
  };

  const testSearchConsole = async (test) => {
    const accessToken = localStorage.getItem('search_console_access_token');
    const siteUrl = localStorage.getItem('search_console_site_url');
    
    if (test.name === 'Site Verification') {
      if (!siteUrl) {
        return {
          success: false,
          error: 'Missing site URL',
          solution: 'Add your verified site URL in Settings'
        };
      }
      return { success: true, message: 'Site URL configured' };
    }
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Missing access token',
        solution: 'Authenticate with Google Search Console'
      };
    }
    
    return { success: true, message: 'Access token found' };
  };

  const testGMB = async (test) => {
    const accessToken = localStorage.getItem('gmb_access_token');
    const locationId = localStorage.getItem('gmb_location_id');
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Missing GMB access token',
        solution: 'Authenticate with Google My Business'
      };
    }
    
    if (!locationId && test.name === 'Location Access') {
      return {
        success: false,
        error: 'Missing location ID',
        solution: 'Configure your GMB location ID'
      };
    }
    
    return { success: true, message: 'GMB credentials configured' };
  };

  const testYouTube = async (test) => {
    const apiKey = localStorage.getItem('youtube_api_key');
    const channelId = localStorage.getItem('youtube_channel_id');
    
    if (!apiKey) {
      return {
        success: false,
        error: 'Missing YouTube API key',
        solution: 'Add your YouTube Data API key in Settings'
      };
    }
    
    if (!channelId && test.name === 'Channel Access') {
      return {
        success: false,
        error: 'Missing channel ID',
        solution: 'Configure your YouTube channel ID'
      };
    }
    
    return { success: true, message: 'YouTube credentials configured' };
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep && isRunning) return 'running';
    if (stepIndex > currentStep) return 'pending';
    return 'idle';
  };

  const getOverallStatus = () => {
    const totalTests = Object.values(testResults).reduce((acc, step) => 
      acc + Object.keys(step).length, 0
    );
    const passedTests = Object.values(testResults).reduce((acc, step) => 
      acc + Object.values(step).filter(test => test.success).length, 0
    );
    
    if (totalTests === 0) return { status: 'idle', percentage: 0 };
    
    const percentage = (passedTests / totalTests) * 100;
    let status = 'good';
    
    if (percentage < 50) status = 'critical';
    else if (percentage < 80) status = 'warning';
    
    return { status, percentage: Math.round(percentage) };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Analytics Connection Diagnostics</h3>
              <p className="text-gray-600">Comprehensive testing of all analytics integrations</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>

          {/* Overall Status */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Overall Connection Health</h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                overallStatus.status === 'good' ? 'bg-green-100 text-green-800' :
                overallStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {overallStatus.percentage}% Healthy
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallStatus.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-2 rounded-full ${
                  overallStatus.status === 'good' ? 'bg-green-500' :
                  overallStatus.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={runDiagnostics}
                disabled={isRunning}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isRunning ? (
                  <Icons.RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Icons.Play className="w-4 h-4 mr-2" />
                )}
                {isRunning ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
              </button>
              
              {connectionIssues.length > 0 && (
                <span className="text-sm text-red-600">
                  {connectionIssues.length} issue{connectionIssues.length !== 1 ? 's' : ''} detected
                </span>
              )}
            </div>
          </div>

          {/* Diagnostic Steps */}
          <div className="space-y-6">
            {diagnosticSteps.map((step, stepIndex) => {
              const status = getStepStatus(stepIndex);
              const stepResults = testResults[step.id] || {};
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stepIndex * 0.1 }}
                  className={`border rounded-lg p-4 ${
                    status === 'completed' ? 'border-green-200 bg-green-50' :
                    status === 'running' ? 'border-blue-200 bg-blue-50' :
                    'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'running' ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`}>
                        {status === 'completed' ? (
                          <Icons.Check className="w-4 h-4 text-white" />
                        ) : status === 'running' ? (
                          <Icons.RefreshCw className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <span className="text-white text-sm font-bold">{stepIndex + 1}</span>
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{step.name}</h5>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    
                    {Object.keys(stepResults).length > 0 && (
                      <div className="text-sm text-gray-500">
                        {Object.values(stepResults).filter(r => r.success).length} of {Object.keys(stepResults).length} passed
                      </div>
                    )}
                  </div>

                  {/* Test Results */}
                  {Object.keys(stepResults).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      {step.tests.map((test) => {
                        const result = stepResults[test.name];
                        if (!result) return null;
                        
                        return (
                          <div
                            key={test.name}
                            className={`p-3 rounded border ${
                              result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{test.name}</span>
                              {result.success ? (
                                <Icons.Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Icons.X className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <p className={`text-xs ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                              {result.success ? result.message : result.error}
                            </p>
                            {result.solution && (
                              <p className="text-xs text-blue-600 mt-1">💡 {result.solution}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Connection Issues Summary */}
          {connectionIssues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg"
            >
              <h4 className="text-lg font-medium text-red-900 mb-4 flex items-center">
                <Icons.AlertTriangle className="w-5 h-5 mr-2" />
                Connection Issues Detected
              </h4>
              <div className="space-y-3">
                {connectionIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-white border border-red-200 rounded">
                    <div className="font-medium text-red-900">{issue.step} - {issue.test}</div>
                    <div className="text-sm text-red-700 mt-1">{issue.error}</div>
                    <div className="text-sm text-blue-600 mt-2">
                      <strong>Solution:</strong> {issue.solution}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ConnectionDiagnostics;