import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiUsers, FiMessageCircle, FiBarChart3, FiMenu, FiX, FiInstagram, FiSettings, FiCalendar } = FiIcons;

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Contacts', href: '/contacts', icon: FiUsers },
  { name: 'Interactions', href: '/interactions', icon: FiMessageCircle },
  { name: 'Social Media', href: '/social-media', icon: FiInstagram },
  { name: 'Content Calendar', href: '/content-calendar', icon: FiCalendar },
  { name: 'Analytics', href: '/analytics', icon: FiBarChart3 },
  { name: 'Settings', href: '/settings', icon: FiSettings },
];

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 256 : 64 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 shadow-lg"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <motion.div
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            {isOpen && (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiUsers} className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Personal CRM</span>
              </>
            )}
          </motion.div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon
                    icon={item.icon}
                    className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  />
                  <motion.span
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                    className={`ml-3 font-medium ${isOpen ? 'block' : 'hidden'}`}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </nav>
      </motion.div>
    </>
  );
}

export default Sidebar;