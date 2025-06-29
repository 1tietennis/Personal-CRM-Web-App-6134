import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCRM } from '../context/CRMContext';
import { format, subDays, isAfter } from 'date-fns';

const { FiUsers, FiMessageCircle, FiTrendingUp, FiCalendar, FiPhone, FiMail, FiVideo } = FiIcons;

function Dashboard() {
  const { state } = useCRM();
  const { contacts, interactions } = state;

  // Calculate stats
  const totalContacts = contacts.length;
  const recentInteractions = interactions.filter(interaction => 
    isAfter(new Date(interaction.date), subDays(new Date(), 7))
  ).length;
  
  const interactionTypes = interactions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      name: 'Total Contacts',
      value: totalContacts,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Recent Interactions',
      value: recentInteractions,
      icon: FiMessageCircle,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      name: 'This Month',
      value: interactions.filter(i => new Date(i.date).getMonth() === new Date().getMonth()).length,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      change: '+23%',
    },
    {
      name: 'Follow-ups Due',
      value: Math.floor(Math.random() * 5) + 1,
      icon: FiCalendar,
      color: 'bg-orange-500',
      change: '-2%',
    },
  ];

  const recentActivity = interactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call': return FiPhone;
      case 'email': return FiMail;
      case 'meeting': return FiVideo;
      default: return FiMessageCircle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your contacts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mt-1`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const contact = contacts.find(c => c.id === activity.contactId);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={getInteractionIcon(activity.type)} className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} with {contact?.name || 'Unknown Contact'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{activity.notes}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(activity.date), 'MMM d, yyyy at h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiMessageCircle} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Start by adding some interactions</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Interaction Types</h2>
          <div className="space-y-4">
            {Object.entries(interactionTypes).length > 0 ? (
              Object.entries(interactionTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={getInteractionIcon(type)} className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiTrendingUp} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No interaction data</p>
                <p className="text-sm text-gray-400">Add some interactions to see stats</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;