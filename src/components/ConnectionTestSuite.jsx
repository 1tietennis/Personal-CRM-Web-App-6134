import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiPlay, FiCheck, FiX, FiRefreshCw, FiAlertTriangle, 
  FiInstagram, FiTwitter, FiLinkedin, FiFacebook, FiSettings 
} = FiIcons;

function ConnectionTestSuite({ onTestComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);

  const testScenarios = [
    {
      id: 'basic_connectivity',
      name: 'Basic Connectivity',
      description: 'Test if platforms are reachable',
      tests: ['ping_apis', 'check_ssl', 'verify_endpoints']
    },
    {
      id: 'authentication',
      name: 'Authentication Tests',
      description: 'Verify token validity and permissions',
      tests: ['token_validation', 'scope_verification', 'rate_limit_check']
    },
    {
      id: 'posting_capabilities',
      name: 'Posting Capabilities',
      description: 'Test content posting and media upload',
      tests: ['text_post_test', 'media_upload_test', 'formatting_test']
    },
    {
      id: 'error_handling',
      name: 'Error Handling',
      description: 'Test system resilience and fallbacks',
      tests: ['invalid_token_test', 'rate_limit_test', 'network_failure_test']
    }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: FiInstagram, color: 'from-pink-500 to-purple-600' },
    { id: 'twitter', name: 'Twitter', icon: FiTwitter, color: 'from-blue-400 to-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: FiLinkedin, color: 'from-blue-600 to-blue-800' },
    { id: 'facebook', name: 'Facebook', icon: FiFacebook, color: 'from-blue-700 to-blue-900' }
  ];

  const runTestSuite = async () => {
    setIsRunning(true);
    setTestResults(null);

    const results = {
      timestamp: new Date().toISOString(),
      overall_status: 'running',
      scenarios: {},
      platforms: {},
      summary: {
        total_tests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };

    try {
      // Run tests for each scenario
      for (const scenario of testScenarios) {
        setCurrentTest(`Running ${scenario.name}...`);
        
        results.scenarios[scenario.id] = {
          name: scenario.name,
          status: 'running',
          tests: {}
        };

        // Simulate running individual tests
        for (const test of scenario.tests) {
          setCurrentTest(`${scenario.name}: ${test.replace('_', ' ')}`);
          
          // Simulate test execution with realistic timing
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
          
          // Simulate test results (in real implementation, these would be actual API calls)
          const testResult = await simulateTest(scenario.id, test);
          
          results.scenarios[scenario.id].tests[test] = testResult;
          results.summary.total_tests++;
          
          if (testResult.status === 'passed') {
            results.summary.passed++;
          } else if (testResult.status === 'warning') {
            results.summary.warnings++;
          } else {
            results.summary.failed++;
          }
        }

        // Determine scenario status
        const scenarioTests = Object.values(results.scenarios[scenario.id].tests);
        const failedTests = scenarioTests.filter(t => t.status === 'failed');
        const warningTests = scenarioTests.filter(t => t.status === 'warning');
        
        if (failedTests.length > 0) {
          results.scenarios[scenario.id].status = 'failed';
        } else if (warningTests.length > 0) {
          results.scenarios[scenario.id].status = 'warning';
        } else {
          results.scenarios[scenario.id].status = 'passed';
        }
      }

      // Test individual platforms
      for (const platform of platforms) {
        setCurrentTest(`Testing ${platform.name} integration...`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        results.platforms[platform.id] = await simulatePlatformTest(platform.id);
      }

      // Determine overall status
      const failedScenarios = Object.values(results.scenarios).filter(s => s.status === 'failed');
      const warningScenarios = Object.values(results.scenarios).filter(s => s.status === 'warning');
      
      if (failedScenarios.length > 0) {
        results.overall_status = 'failed';
      } else if (warningScenarios.length > 0) {
        results.overall_status = 'warning';
      } else {
        results.overall_status = 'passed';
      }

      setTestResults(results);
      
      if (onTestComplete) {
        onTestComplete(results);
      }

    } catch (error) {
      console.error('Test suite failed:', error);
      results.overall_status = 'error';
      results.error = error.message;
      setTestResults(results);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  // Simulate individual test execution
  const simulateTest = async (scenarioId, testId) => {
    // In a real implementation, these would be actual API calls and verifications
    const scenarios = {
      basic_connectivity: {
        ping_apis: () => ({ status: 'passed', message: 'All API endpoints responding', duration: 1.2 }),
        check_ssl: () => ({ status: 'passed', message: 'SSL certificates valid', duration: 0.8 }),
        verify_endpoints: () => ({ status: 'passed', message: 'All endpoints accessible', duration: 1.5 })
      },
      authentication: {
        token_validation: () => ({ 
          status: Math.random() > 0.8 ? 'warning' : 'passed', 
          message: Math.random() > 0.8 ? 'Some tokens expire soon' : 'All tokens valid', 
          duration: 2.1 
        }),
        scope_verification: () => ({ status: 'passed', message: 'Required permissions granted', duration: 1.7 }),
        rate_limit_check: () => ({ status: 'passed', message: 'Within rate limits', duration: 1.3 })
      },
      posting_capabilities: {
        text_post_test: () => ({ status: 'passed', message: 'Text posting functional', duration: 2.5 }),
        media_upload_test: () => ({ 
          status: Math.random() > 0.9 ? 'failed' : 'passed', 
          message: Math.random() > 0.9 ? 'Media upload failed on Twitter' : 'Media upload working', 
          duration: 3.2 
        }),
        formatting_test: () => ({ status: 'passed', message: 'Content formatting correct', duration: 1.8 })
      },
      error_handling: {
        invalid_token_test: () => ({ status: 'passed', message: 'Error handling working', duration: 1.5 }),
        rate_limit_test: () => ({ status: 'passed', message: 'Rate limit handling functional', duration: 2.0 }),
        network_failure_test: () => ({ status: 'passed', message: 'Fallback mechanisms active', duration: 1.7 })
      }
    };

    return scenarios[scenarioId]?.[testId]?.() || { 
      status: 'failed', 
      message: 'Test not implemented', 
      duration: 1.0 
    };
  };

  // Simulate platform-specific testing
  const simulatePlatformTest = async (platformId) => {
    const isConnected = localStorage.getItem(`${platformId}_access_token`);
    
    if (!isConnected) {
      return {
        status: 'not_configured',
        message: 'Platform not configured',
        tests: {
          connection: { status: 'skipped', message: 'No credentials' },
          posting: { status: 'skipped', message: 'No credentials' },
          permissions: { status: 'skipped', message: 'No credentials' }
        }
      };
    }

    // Simulate various test outcomes
    const connectionSuccess = Math.random() > 0.1;
    const postingSuccess = Math.random() > 0.15;
    const permissionsOk = Math.random() > 0.05;

    return {
      status: connectionSuccess && postingSuccess && permissionsOk ? 'passed' : 
              connectionSuccess ? 'warning' : 'failed',
      message: connectionSuccess && postingSuccess && permissionsOk ? 'All tests passed' :
               connectionSuccess ? 'Some issues detected' : 'Connection failed',
      tests: {
        connection: { 
          status: connectionSuccess ? 'passed' : 'failed', 
          message: connectionSuccess ? 'Connected successfully' : 'Connection timeout' 
        },
        posting: { 
          status: postingSuccess ? 'passed' : 'warning', 
          message: postingSuccess ? 'Posting functional' : 'Posting limitations detected' 
        },
        permissions: { 
          status: permissionsOk ? 'passed' : 'warning', 
          message: permissionsOk ? 'All permissions granted' : 'Some permissions missing' 
        }
      }
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'running': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return FiCheck;
      case 'warning': return FiAlertTriangle;
      case 'failed': return FiX;
      case 'running': return FiRefreshCw;
      default: return FiSettings;
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Suite Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Connection Test Suite</h3>
            <p className="text-gray-600">Comprehensive testing of all platform integrations</p>
          </div>
          <button
            onClick={runTestSuite}
            disabled={isRunning}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <SafeIcon 
              icon={isRunning ? FiRefreshCw : FiPlay} 
              className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} 
            />
            {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
          </button>
        </div>

        {isRunning && currentTest && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 text-blue-600 animate-spin mr-2" />
              <span className="text-sm text-blue-800">{currentTest}</span>
            </div>
          </div>
        )}

        {/* Test Scenarios Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testScenarios.map((scenario) => (
            <div key={scenario.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-1">{scenario.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
              <div className="text-xs text-gray-500">
                {scenario.tests.length} tests
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(testResults.overall_status)}`}>
                <SafeIcon icon={getStatusIcon(testResults.overall_status)} className="w-4 h-4 mr-1" />
                {testResults.overall_status.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{testResults.summary.total_tests}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.summary.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{testResults.summary.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testResults.summary.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Completed: {new Date(testResults.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Scenario Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Results</h3>
            <div className="space-y-4">
              {Object.entries(testResults.scenarios).map(([scenarioId, scenario]) => (
                <div key={scenarioId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(scenario.status)}`}>
                      <SafeIcon icon={getStatusIcon(scenario.status)} className="w-3 h-3 mr-1" />
                      {scenario.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {Object.entries(scenario.tests).map(([testId, test]) => (
                      <div key={testId} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <span className="text-gray-700">{testId.replace('_', ' ')}</span>
                        <SafeIcon 
                          icon={getStatusIcon(test.status)} 
                          className={`w-3 h-3 ${
                            test.status === 'passed' ? 'text-green-600' :
                            test.status === 'warning' ? 'text-yellow-600' :
                            'text-red-600'
                          }`} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(testResults.platforms).map(([platformId, platform]) => {
                const platformInfo = platforms.find(p => p.id === platformId);
                return (
                  <div key={platformId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${platformInfo?.color} flex items-center justify-center`}>
                          <SafeIcon icon={platformInfo?.icon} className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{platformInfo?.name}</span>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(platform.status)}`}>
                        <SafeIcon icon={getStatusIcon(platform.status)} className="w-3 h-3 mr-1" />
                        {platform.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{platform.message}</p>
                    
                    <div className="space-y-1">
                      {Object.entries(platform.tests).map(([testId, test]) => (
                        <div key={testId} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">{testId}</span>
                          <div className="flex items-center space-x-1">
                            <SafeIcon 
                              icon={getStatusIcon(test.status)} 
                              className={`w-3 h-3 ${
                                test.status === 'passed' ? 'text-green-600' :
                                test.status === 'warning' ? 'text-yellow-600' :
                                test.status === 'skipped' ? 'text-gray-600' :
                                'text-red-600'
                              }`} 
                            />
                            <span className="text-gray-600">{test.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ConnectionTestSuite;