import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useSEO } from '../../context/SEOContext';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useRealTimeData } from '../../hooks/useRealTimeData';

const MainMenu = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { state } = useSEO();
  const { announceToScreenReader, handleKeyNavigation } = useAccessibility();
  const { liveData, isConnected } = useRealTimeData();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  // Menu structure with comprehensive navigation
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard Overview',
      href: '/dashboard',
      icon: Icons.BarChart3,
      badge: isConnected ? 'live' : null,
      description: 'Real-time SEO performance across all channels',
      testId: 'menu-dashboard',
      ariaLabel: 'Dashboard Overview - View real-time SEO performance metrics'
    },
    {
      id: 'keywords',
      name: 'Keyword Analysis',
      icon: Icons.Search,
      badge: state.keywords?.length || 0,
      description: 'Monitor and manage keyword performance',
      testId: 'menu-keywords',
      ariaLabel: 'Keyword Analysis - Manage keyword rankings and opportunities',
      submenu: [
        {
          id: 'keyword-rankings',
          name: 'Keyword Rankings',
          href: '/keywords/rankings',
          icon: Icons.TrendingUp,
          description: 'Track rankings with historical trends',
          testId: 'submenu-keyword-rankings'
        },
        {
          id: 'keyword-suggestions',
          name: 'AI Keyword Suggestions',
          href: '/keywords/suggestions',
          icon: Icons.Brain,
          description: 'AI-generated keyword opportunities',
          testId: 'submenu-keyword-suggestions',
          badge: 'ai'
        },
        {
          id: 'negative-keywords',
          name: 'Negative Keyword Manager',
          href: '/keywords/negative',
          icon: Icons.Shield,
          description: 'Filter irrelevant keywords',
          testId: 'submenu-negative-keywords'
        },
        {
          id: 'competitor-gap',
          name: 'Competitor Keyword Gap',
          href: '/keywords/competitor-gap',
          icon: Icons.Users,
          description: 'Compare with top competitors',
          testId: 'submenu-competitor-gap'
        }
      ]
    },
    {
      id: 'google-search',
      name: 'Google Search Optimization',
      icon: Icons.Globe,
      description: 'On-page, technical, and content SEO',
      testId: 'menu-google-search',
      ariaLabel: 'Google Search Optimization - Manage on-page and technical SEO',
      submenu: [
        {
          id: 'on-page-audit',
          name: 'On-Page Audit',
          href: '/google-search/on-page',
          icon: Icons.FileText,
          description: 'Analyze title tags, meta descriptions, schema',
          testId: 'submenu-on-page-audit'
        },
        {
          id: 'technical-seo',
          name: 'Technical SEO',
          href: '/google-search/technical',
          icon: Icons.Settings,
          description: 'Core Web Vitals, crawl errors, site speed',
          testId: 'submenu-technical-seo',
          badge: liveData.coreWebVitals?.status || null
        },
        {
          id: 'content-gaps',
          name: 'Content Gap Analysis',
          href: '/google-search/content-gaps',
          icon: Icons.Target,
          description: 'Identify missing topics and content clusters',
          testId: 'submenu-content-gaps'
        }
      ]
    },
    {
      id: 'gmb',
      name: 'Google My Business',
      icon: Icons.MapPin,
      description: 'Local SEO and GMB optimization',
      testId: 'menu-gmb',
      ariaLabel: 'Google My Business - Manage local SEO and GMB performance',
      submenu: [
        {
          id: 'gmb-analytics',
          name: 'Profile Analytics',
          href: '/gmb/analytics',
          icon: Icons.BarChart,
          description: 'Monitor views, clicks, and actions',
          testId: 'submenu-gmb-analytics'
        },
        {
          id: 'review-management',
          name: 'Review Management',
          href: '/gmb/reviews',
          icon: Icons.Star,
          description: 'Analyze sentiment and responses',
          testId: 'submenu-review-management',
          badge: liveData.reviews?.pending || null
        },
        {
          id: 'citation-tracker',
          name: 'Local Citation Tracker',
          href: '/gmb/citations',
          icon: Icons.Link,
          description: 'Monitor NAP consistency',
          testId: 'submenu-citation-tracker'
        }
      ]
    },
    {
      id: 'blog',
      name: 'Blog Performance',
      icon: Icons.BookOpen,
      description: 'Monitor blog rankings and engagement',
      testId: 'menu-blog',
      ariaLabel: 'Blog Performance - Track blog post rankings and optimization',
      submenu: [
        {
          id: 'post-analytics',
          name: 'Post Analytics',
          href: '/blog/analytics',
          icon: Icons.LineChart,
          description: 'Track views, dwell time, conversions',
          testId: 'submenu-post-analytics'
        },
        {
          id: 'content-optimization',
          name: 'Content Optimization',
          href: '/blog/optimization',
          icon: Icons.Zap,
          description: 'AI-driven optimization suggestions',
          testId: 'submenu-content-optimization',
          badge: 'ai'
        },
        {
          id: 'topic-ideation',
          name: 'Topic Ideation',
          href: '/blog/topics',
          icon: Icons.Lightbulb,
          description: 'AI-generated topic suggestions',
          testId: 'submenu-topic-ideation',
          badge: 'ai'
        }
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube SEO',
      icon: Icons.Video,
      description: 'Video performance and optimization',
      testId: 'menu-youtube',
      ariaLabel: 'YouTube SEO - Monitor and optimize video performance',
      submenu: [
        {
          id: 'video-analytics',
          name: 'Video Analytics',
          href: '/youtube/analytics',
          icon: Icons.PlayCircle,
          description: 'Monitor views, watch time, CTR',
          testId: 'submenu-video-analytics'
        },
        {
          id: 'keyword-optimization',
          name: 'Video Keyword Optimization',
          href: '/youtube/keywords',
          icon: Icons.Hash,
          description: 'Track video keyword rankings',
          testId: 'submenu-video-keywords'
        },
        {
          id: 'content-ideas',
          name: 'Content Ideas & Thumbnails',
          href: '/youtube/content',
          icon: Icons.Image,
          description: 'Generate topics and thumbnail suggestions',
          testId: 'submenu-video-content',
          badge: 'ai'
        }
      ]
    },
    {
      id: 'reporting',
      name: 'Client Reporting',
      icon: Icons.FileBarChart,
      description: 'Client-facing reports and dashboards',
      testId: 'menu-reporting',
      ariaLabel: 'Client Reporting - Generate and manage client reports',
      submenu: [
        {
          id: 'performance-reports',
          name: 'Performance Reports',
          href: '/reporting/performance',
          icon: Icons.TrendingUp,
          description: 'Comprehensive SEO performance summaries',
          testId: 'submenu-performance-reports'
        },
        {
          id: 'roi-tracker',
          name: 'ROI Tracker',
          href: '/reporting/roi',
          icon: Icons.DollarSign,
          description: 'Calculate campaign ROI',
          testId: 'submenu-roi-tracker'
        },
        {
          id: 'white-label',
          name: 'White-Label Dashboard',
          href: '/reporting/white-label',
          icon: Icons.Palette,
          description: 'Customizable client reports',
          testId: 'submenu-white-label'
        }
      ]
    },
    {
      id: 'clients',
      name: 'Client Management',
      href: '/clients',
      icon: Icons.Building,
      badge: state.clients?.length || 0,
      description: 'Manage client accounts and projects',
      testId: 'menu-clients',
      ariaLabel: 'Client Management - Manage client accounts and projects'
    },
    {
      id: 'settings',
      name: 'Settings & Integrations',
      href: '/settings',
      icon: Icons.Settings,
      description: 'Configure integrations and preferences',
      testId: 'menu-settings',
      ariaLabel: 'Settings and Integrations - Configure app settings and API connections'
    }
  ];

  // Filter menu items based on search
  const filteredMenuItems = menuItems.filter(item => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(searchLower);
    const descriptionMatch = item.description?.toLowerCase().includes(searchLower);
    const submenuMatch = item.submenu?.some(sub => 
      sub.name.toLowerCase().includes(searchLower) ||
      sub.description?.toLowerCase().includes(searchLower)
    );
    
    return nameMatch || descriptionMatch || submenuMatch;
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyNavigation(e, {
        onEscape: () => {
          setActiveSubmenu(null);
          setIsOpen(false);
        },
        onEnter: (target) => {
          if (target.getAttribute('data-menu-item')) {
            target.click();
          }
        },
        onArrowDown: () => {
          // Focus next menu item
          const currentFocus = document.activeElement;
          const menuItems = menuRef.current?.querySelectorAll('[data-menu-item]');
          if (menuItems) {
            const currentIndex = Array.from(menuItems).indexOf(currentFocus);
            const nextIndex = (currentIndex + 1) % menuItems.length;
            menuItems[nextIndex]?.focus();
          }
        },
        onArrowUp: () => {
          // Focus previous menu item
          const currentFocus = document.activeElement;
          const menuItems = menuRef.current?.querySelectorAll('[data-menu-item]');
          if (menuItems) {
            const currentIndex = Array.from(menuItems).indexOf(currentFocus);
            const prevIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
            menuItems[prevIndex]?.focus();
          }
        }
      });
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyNavigation]);

  // Handle submenu toggle
  const handleSubmenuToggle = (itemId, itemName) => {
    const newActiveSubmenu = activeSubmenu === itemId ? null : itemId;
    setActiveSubmenu(newActiveSubmenu);
    
    announceToScreenReader(
      newActiveSubmenu 
        ? `${itemName} submenu expanded`
        : `${itemName} submenu collapsed`
    );
  };

  // Get badge component
  const getBadge = (badge) => {
    if (!badge) return null;

    const badgeConfig = {
      'live': { 
        className: 'bg-green-500 text-white animate-pulse', 
        text: 'LIVE',
        ariaLabel: 'Live data connection active'
      },
      'ai': { 
        className: 'bg-purple-500 text-white', 
        text: 'AI',
        ariaLabel: 'AI-powered feature'
      }
    };

    const config = badgeConfig[badge] || {
      className: 'bg-blue-500 text-white',
      text: badge.toString(),
      ariaLabel: `${badge} items`
    };

    return (
      <span 
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
        aria-label={config.ariaLabel}
      >
        {config.text}
      </span>
    );
  };

  // Check if item is active
  const isItemActive = (item) => {
    if (item.href) {
      return location.pathname === item.href;
    }
    
    if (item.submenu) {
      return item.submenu.some(sub => location.pathname === sub.href);
    }
    
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        ref={menuRef}
        initial={false}
        animate={{ width: isOpen ? 320 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 shadow-lg overflow-hidden"
        role="navigation"
        aria-label="Main navigation"
        data-testid="main-navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icons.Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">SEO Pro</h1>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-500">
                      {isConnected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            data-testid="menu-toggle"
          >
            <Icons.Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border-b border-gray-200"
            >
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  aria-label="Search navigation menu"
                  data-testid="menu-search"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3" role="menubar">
            {filteredMenuItems.map((item, index) => {
              const isActive = isItemActive(item);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = activeSubmenu === item.id;
              const IconComponent = item.icon;

              return (
                <li key={item.id} role="none">
                  {/* Main Menu Item */}
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      role="menuitem"
                      aria-label={item.ariaLabel || item.name}
                      data-menu-item="true"
                      data-testid={item.testId}
                      tabIndex={0}
                    >
                      <IconComponent
                        className={`w-5 h-5 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                        aria-hidden="true"
                      />
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-3 flex-1 min-w-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium truncate">{item.name}</div>
                                <div className="text-xs text-gray-500 truncate">{item.description}</div>
                              </div>
                              {item.badge && (
                                <div className="ml-2 flex-shrink-0">
                                  {getBadge(item.badge)}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleSubmenuToggle(item.id, item.name)}
                      className={`group w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      role="menuitem"
                      aria-label={item.ariaLabel || item.name}
                      aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
                      aria-haspopup={hasSubmenu ? "menu" : undefined}
                      data-menu-item="true"
                      data-testid={item.testId}
                      tabIndex={0}
                    >
                      <IconComponent
                        className={`w-5 h-5 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                        aria-hidden="true"
                      />
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-3 flex-1 min-w-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium truncate">{item.name}</div>
                                <div className="text-xs text-gray-500 truncate">{item.description}</div>
                              </div>
                              <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                                {item.badge && getBadge(item.badge)}
                                {hasSubmenu && (
                                  <Icons.ChevronRight
                                    className={`w-4 h-4 transition-transform ${
                                      isSubmenuOpen ? 'rotate-90' : ''
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  )}

                  {/* Submenu */}
                  <AnimatePresence>
                    {hasSubmenu && isSubmenuOpen && isOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1 border-l-2 border-gray-100 pl-4"
                        role="menu"
                        aria-label={`${item.name} submenu`}
                      >
                        {item.submenu.map((subItem) => {
                          const SubIconComponent = subItem.icon;
                          const isSubActive = location.pathname === subItem.href;

                          return (
                            <li key={subItem.id} role="none">
                              <Link
                                to={subItem.href}
                                className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                  isSubActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                role="menuitem"
                                data-testid={subItem.testId}
                                tabIndex={0}
                              >
                                <SubIconComponent
                                  className={`w-4 h-4 flex-shrink-0 ${
                                    isSubActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                                  }`}
                                  aria-hidden="true"
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium truncate">{subItem.name}</div>
                                      <div className="text-xs text-gray-500 truncate">{subItem.description}</div>
                                    </div>
                                    {subItem.badge && (
                                      <div className="ml-2 flex-shrink-0">
                                        {getBadge(subItem.badge)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-t border-gray-200 p-4"
            >
              <div className="text-xs text-gray-500 space-y-1">
                <div>Version 2.0.0</div>
                <div className="flex items-center space-x-2">
                  <span>API Status:</span>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default MainMenu;