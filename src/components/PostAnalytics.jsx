import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';
import ReactECharts from 'echarts-for-react';

const { FiTrendingUp, FiHeart, FiMessageCircle, FiShare2, FiEye, FiInstagram, FiTwitter, FiFacebook, FiLinkedin } = FiIcons;

function PostAnalytics() {
  const { state } = useSocialMedia();
  const { posts } = state;

  // Mock analytics data
  const analyticsData = {
    totalReach: 15420,
    totalEngagement: 1250,
    totalShares: 89,
    engagementRate: 8.1,
    topPost: posts[0] || null,
    platformPerformance: [
      { platform: 'Instagram', posts: 12, engagement: 850, color: 'from-pink-500 to-purple-600' },
      { platform: 'Twitter', posts: 8, engagement: 620, color: 'from-blue-400 to-blue-600' },
      { platform: 'Facebook', posts: 6, engagement: 420, color: 'from-blue-600 to-blue-800' },
      { platform: 'LinkedIn', posts: 4, engagement: 280, color: 'from-blue-700 to-blue-900' }
    ]
  };

  const engagementChartOption = {
    title: {
      text: 'Engagement Over Time',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Likes',
        type: 'line',
        data: [120, 200, 150, 80, 70, 110, 130],
        smooth: true,
        itemStyle: { color: '#E91E63' }
      },
      {
        name: 'Comments',
        type: 'line',
        data: [20, 35, 25, 15, 12, 18, 22],
        smooth: true,
        itemStyle: { color: '#2196F3' }
      },
      {
        name: 'Shares',
        type: 'line',
        data: [5, 8, 6, 3, 2, 4, 6],
        smooth: true,
        itemStyle: { color: '#4CAF50' }
      }
    ]
  };

  const platformChartOption = {
    title: {
      text: 'Platform Performance',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Engagement',
        type: 'pie',
        radius: '60%',
        data: analyticsData.platformPerformance.map(p => ({
          value: p.engagement,
          name: p.platform
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const stats = [
    {
      name: 'Total Reach',
      value: analyticsData.totalReach.toLocaleString(),
      icon: FiEye,
      color: 'bg-blue-500',
      change: '+12.5%'
    },
    {
      name: 'Total Engagement',
      value: analyticsData.totalEngagement.toLocaleString(),
      icon: FiHeart,
      color: 'bg-pink-500',
      change: '+8.3%'
    },
    {
      name: 'Total Shares',
      value: analyticsData.totalShares,
      icon: FiShare2,
      color: 'bg-green-500',
      change: '+15.2%'
    },
    {
      name: 'Engagement Rate',
      value: `${analyticsData.engagementRate}%`,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      change: '+2.1%'
    }
  ];

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return FiInstagram;
      case 'twitter': return FiTwitter;
      case 'facebook': return FiFacebook;
      case 'linkedin': return FiLinkedin;
      default: return FiInstagram;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last week</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={engagementChartOption} style={{ height: '300px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={platformChartOption} style={{ height: '300px' }} />
        </motion.div>
      </div>

      {/* Platform Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Platform Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.platformPerformance.map((platform, index) => (
            <div key={platform.platform} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                    <SafeIcon icon={getPlatformIcon(platform.platform)} className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{platform.platform}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Posts</span>
                  <span className="text-sm font-medium text-gray-900">{platform.posts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="text-sm font-medium text-gray-900">{platform.engagement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg per Post</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(platform.engagement / platform.posts)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Performing Post */}
      {analyticsData.topPost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Post</h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Best Performance
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiHeart} className="w-4 h-4" />
                  <span>245</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiMessageCircle} className="w-4 h-4" />
                  <span>32</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiShare2} className="w-4 h-4" />
                  <span>18</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-800 line-clamp-3">{analyticsData.topPost.content}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PostAnalytics;