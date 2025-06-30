import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

function TroubleshootingGuide({ onClose }) {
  const [activeCategory, setActiveCategory] = useState('common');
  const [expandedItem, setExpandedItem] = useState(null);

  const troubleshootingCategories = [
    {
      id: 'common',
      name: 'Common Issues',
      icon: Icons.HelpCircle,
      items: [
        {
          id: 'no_data',
          title: 'No Data Showing',
          symptoms: ['Empty charts and graphs', 'Zero metrics displayed', 'Loading indicators persist'],
          causes: [
            'Missing API credentials',
            'Incorrect configuration',
            'Network connectivity issues',
            'API rate limits exceeded'
          ],
          solutions: [
            {
              step: 'Check API Credentials',
              details: 'Verify all API keys and tokens are correctly entered in Settings',
              action: 'Go to Settings → Analytics → Verify credentials'
            },
            {
              step: 'Test Network Connection',
              details: 'Ensure your internet connection is stable and APIs are accessible',
              action: 'Run Connection Diagnostics'
            },
            {
              step: 'Verify Date Range',
              details: 'Check if the selected date range has available data',
              action: 'Try selecting "Last 30 Days" or a different range'
            },
            {
              step: 'Clear Cache and Refresh',
              details: 'Clear browser cache and refresh the page',
              action: 'Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)'
            }
          ]
        },
        {
          id: 'slow_loading',
          title: 'Slow Loading Times',
          symptoms: ['Charts take long to load', 'Page feels unresponsive', 'Timeout errors'],
          causes: [
            'Large data sets',
            'Slow API responses',
            'Multiple concurrent requests',
            'Browser performance issues'
          ],
          solutions: [
            {
              step: 'Reduce Date Range',
              details: 'Use shorter date ranges for faster loading',
              action: 'Select "Last 7 Days" instead of longer periods'
            },
            {
              step: 'Enable Data Caching',
              details: 'Allow the app to cache API responses',
              action: 'Check browser storage permissions'
            },
            {
              step: 'Close Other Browser Tabs',
              details: 'Reduce memory usage by closing unnecessary tabs',
              action: 'Close unused tabs and extensions'
            }
          ]
        },
        {
          id: 'incorrect_data',
          title: 'Data Appears Incorrect',
          symptoms: ['Metrics don\'t match other tools', 'Unexpected spikes or drops', 'Missing time periods'],
          causes: [
            'Time zone differences',
            'Different calculation methods',
            'API data delays',
            'Filter misconfigurations'
          ],
          solutions: [
            {
              step: 'Check Time Zone Settings',
              details: 'Ensure time zones match between this app and your analytics accounts',
              action: 'Verify time zone in Google Analytics and other platforms'
            },
            {
              step: 'Review Filters',
              details: 'Check if any filters are applied that might affect data',
              action: 'Reset filters and compare with original sources'
            },
            {
              step: 'Allow for Data Processing Delays',
              details: 'Analytics platforms may have 24-48 hour delays',
              action: 'Compare data from 2-3 days ago instead of today'
            }
          ]
        }
      ]
    },
    {
      id: 'google_analytics',
      name: 'Google Analytics',
      icon: Icons.BarChart3,
      items: [
        {
          id: 'ga_auth_error',
          title: 'Authentication Errors',
          symptoms: ['401 Unauthorized errors', 'Invalid credentials message', 'Access denied'],
          causes: [
            'Expired API key',
            'Incorrect View ID',
            'Insufficient permissions',
            'API not enabled'
          ],
          solutions: [
            {
              step: 'Regenerate API Key',
              details: 'Create a new API key in Google Developer Console',
              action: 'Visit console.developers.google.com → Credentials → Create API Key'
            },
            {
              step: 'Verify View ID',
              details: 'Double-check your Google Analytics View ID',
              action: 'GA → Admin → View → View Settings → View ID'
            },
            {
              step: 'Enable Analytics API',
              details: 'Ensure the Analytics Reporting API is enabled',
              action: 'Google Developer Console → Library → Analytics Reporting API → Enable'
            },
            {
              step: 'Check Permissions',
              details: 'Verify your account has read access to the Analytics property',
              action: 'GA → Admin → Account/Property → User Management'
            }
          ]
        },
        {
          id: 'ga_quota_exceeded',
          title: 'Quota Exceeded Errors',
          symptoms: ['403 Quota exceeded', 'Rate limit errors', 'API requests failing'],
          causes: [
            'Too many API requests',
            'Exceeded daily quota',
            'Concurrent request limits',
            'Free tier limitations'
          ],
          solutions: [
            {
              step: 'Reduce Request Frequency',
              details: 'Implement request throttling and caching',
              action: 'Wait before making additional requests'
            },
            {
              step: 'Optimize Date Ranges',
              details: 'Use smaller date ranges to reduce data volume',
              action: 'Select shorter time periods for analysis'
            },
            {
              step: 'Monitor Quota Usage',
              details: 'Check your API usage in Google Cloud Console',
              action: 'Google Cloud Console → APIs → Analytics Reporting API → Quotas'
            }
          ]
        }
      ]
    },
    {
      id: 'search_console',
      name: 'Search Console',
      icon: Icons.Search,
      items: [
        {
          id: 'sc_verification',
          title: 'Site Verification Issues',
          symptoms: ['Site not found error', 'Verification failed', 'Access denied to site data'],
          causes: [
            'Site not verified in Search Console',
            'Incorrect site URL format',
            'Verification method expired',
            'Insufficient permissions'
          ],
          solutions: [
            {
              step: 'Verify Site Ownership',
              details: 'Ensure your site is verified in Google Search Console',
              action: 'Visit search.google.com/search-console → Add Property'
            },
            {
              step: 'Check URL Format',
              details: 'Use the exact URL format from Search Console',
              action: 'Include protocol (https://) and match exactly'
            },
            {
              step: 'Re-verify Site',
              details: 'Re-run the verification process if it expired',
              action: 'Search Console → Settings → Ownership verification'
            }
          ]
        }
      ]
    },
    {
      id: 'api_keys',
      name: 'API Keys & Tokens',
      icon: Icons.Key,
      items: [
        {
          id: 'missing_keys',
          title: 'Missing or Invalid API Keys',
          symptoms: ['Configuration incomplete', 'Authentication required', 'Invalid key format'],
          causes: [
            'API keys not entered',
            'Incorrect key format',
            'Keys copied incorrectly',
            'Expired credentials'
          ],
          solutions: [
            {
              step: 'Double-Check Key Format',
              details: 'Ensure API keys are copied completely without extra spaces',
              action: 'Copy keys directly from source without manual typing'
            },
            {
              step: 'Verify Key Permissions',
              details: 'Check that API keys have the necessary scopes and permissions',
              action: 'Review API key restrictions in Google Cloud Console'
            },
            {
              step: 'Test Keys Independently',
              details: 'Test API keys using API testing tools',
              action: 'Use Postman or similar tools to verify key functionality'
            }
          ]
        }
      ]
    },
    {
      id: 'browser',
      name: 'Browser Issues',
      icon: Icons.Globe,
      items: [
        {
          id: 'cors_errors',
          title: 'CORS and Security Errors',
          symptoms: ['CORS policy errors', 'Blocked by browser security', 'Mixed content warnings'],
          causes: [
            'Browser security policies',
            'CORS restrictions',
            'HTTPS/HTTP mixed content',
            'Ad blockers or extensions'
          ],
          solutions: [
            {
              step: 'Disable Ad Blockers',
              details: 'Temporarily disable ad blockers and privacy extensions',
              action: 'Turn off extensions like uBlock Origin, Privacy Badger'
            },
            {
              step: 'Use HTTPS',
              details: 'Ensure you\'re accessing the app via HTTPS',
              action: 'Check URL starts with https:// not http://'
            },
            {
              step: 'Clear Browser Data',
              details: 'Clear cookies, cache, and local storage',
              action: 'Browser Settings → Privacy → Clear browsing data'
            },
            {
              step: 'Try Incognito Mode',
              details: 'Test in private/incognito browsing mode',
              action: 'Open new incognito window and test functionality'
            }
          ]
        }
      ]
    }
  ];

  const getCurrentCategory = () => {
    return troubleshootingCategories.find(cat => cat.id === activeCategory);
  };

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
          className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Analytics Troubleshooting Guide</h3>
              <p className="text-gray-600">Step-by-step solutions for common analytics connection issues</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2">
                {troubleshootingCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {getCurrentCategory()?.name} Issues
                  </h4>
                  
                  <div className="space-y-4">
                    {getCurrentCategory()?.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900">{item.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.symptoms.slice(0, 2).join(', ')}
                              {item.symptoms.length > 2 && '...'}
                            </p>
                          </div>
                          <Icons.ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedItem === item.id ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        <AnimatePresence>
                          {expandedItem === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-gray-200"
                            >
                              <div className="p-4 space-y-6">
                                {/* Symptoms */}
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <Icons.AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                    Symptoms
                                  </h6>
                                  <ul className="space-y-1">
                                    {item.symptoms.map((symptom, index) => (
                                      <li key={index} className="text-sm text-gray-600 flex items-center">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                        {symptom}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Possible Causes */}
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <Icons.Search className="w-4 h-4 text-yellow-500 mr-2" />
                                    Possible Causes
                                  </h6>
                                  <ul className="space-y-1">
                                    {item.causes.map((cause, index) => (
                                      <li key={index} className="text-sm text-gray-600 flex items-center">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                        {cause}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Solutions */}
                                <div>
                                  <h6 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <Icons.Wrench className="w-4 h-4 text-green-500 mr-2" />
                                    Step-by-Step Solutions
                                  </h6>
                                  <div className="space-y-4">
                                    {item.solutions.map((solution, index) => (
                                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                          </div>
                                          <h7 className="font-medium text-gray-900">{solution.step}</h7>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{solution.details}</p>
                                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                          <p className="text-sm text-blue-800">
                                            <strong>Action:</strong> {solution.action}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Help Footer */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Still Need Help?</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icons.MessageCircle className="w-4 h-4 text-blue-500" />
                <span>Run Connection Diagnostics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Settings className="w-4 h-4 text-purple-500" />
                <span>Check Settings Configuration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.RefreshCw className="w-4 h-4 text-green-500" />
                <span>Try Setup Wizard Again</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TroubleshootingGuide;