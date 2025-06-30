import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useSEO } from '../context/SEOContext';
import ROIIndicator from '../components/ROIIndicator';
import ReactECharts from 'echarts-for-react';

function Dashboard() {
  const { state } = useSEO();
  const { clients, keywords, rankings } = state;

  // Mock data for dashboard metrics
  const metrics = {
    totalClients: clients.length || 12,
    activeKeywords: keywords.length || 847,
    avgPosition: 3.2,
    organicTraffic: 125847,
    conversions: 2341,
    revenue: 89750
  };

  // Chart options for ranking trends
  const rankingChartOption = {
    title: {
      text: 'Ranking Trends - Last 30 Days',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Average Position', 'Top 3 Rankings', 'Page 1 Rankings'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    },
    yAxis: [
      {
        type: 'value',
        name: 'Position',
        inverse: true,
        min: 1,
        max: 10
      },
      {
        type: 'value',
        name: 'Count',
        min: 0
      }
    ],
    series: [
      {
        name: 'Average Position',
        type: 'line',
        yAxisIndex: 0,
        data: Array.from({ length: 30 }, () => Math.random() * 3 + 1),
        smooth: true,
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Top 3 Rankings',
        type: 'bar',
        yAxisIndex: 1,
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 100),
        itemStyle: { color: '#10B981' }
      },
      {
        name: 'Page 1 Rankings',
        type: 'bar',
        yAxisIndex: 1,
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 200),
        itemStyle: { color: '#F59E0B' }
      }
    ]
  };

  // Traffic chart options
  const trafficChartOption = {
    title: {
      text: 'Organic Traffic Growth',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
      type: 'value',
      name: 'Sessions'
    },
    series: [
      {
        name: 'Organic Traffic',
        type: 'line',
        data: [45000, 52000, 61000, 74000, 89000, 125847],
        smooth: true,
        areaStyle: { opacity: 0.3 },
        itemStyle: { color: '#8B5CF6' }
      }
    ]
  };

  const statCards = [
    {
      title: 'Total Clients',
      value: metrics.totalClients,
      change: '+12%',
      icon: Icons.Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Keywords',
      value: metrics.activeKeywords.toLocaleString(),
      change: '+23%',
      icon: Icons.Search,
      color: 'bg-green-500'
    },
    {
      title: 'Avg. Position',
      value: metrics.avgPosition.toFixed(1),
      change: '-15%',
      icon: Icons.TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Organic Traffic',
      value: metrics.organicTraffic.toLocaleString(),
      change: '+34%',
      icon: Icons.BarChart3,
      color: 'bg-orange-500'
    },
    {
      title: 'Conversions',
      value: metrics.conversions.toLocaleString(),
      change: '+28%',
      icon: Icons.Target,
      color: 'bg-pink-500'
    },
    {
      title: 'Revenue',
      value: `$${metrics.revenue.toLocaleString()}`,
      change: '+41%',
      icon: Icons.DollarSign,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Dashboard</h1>
        <p className="text-gray-600">
          AI-driven SEO strategies to dominate Google Search, GMB, and content platforms
        </p>
      </div>

      {/* ROI Indicator */}
      <div className="mb-8">
        <ROIIndicator />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={rankingChartOption} style={{ height: '350px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={trafficChartOption} style={{ height: '350px' }} />
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Icons.Zap className="w-5 h-5 text-blue-600 mr-2" />
            AI-Powered Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
              <Icons.Search className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-medium text-gray-900">Keyword Research</div>
              <div className="text-sm text-gray-600">Find profitable keywords</div>
            </button>
            
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
              <Icons.FileText className="w-6 h-6 text-green-600 mb-2" />
              <div className="font-medium text-gray-900">Content Brief</div>
              <div className="text-sm text-gray-600">AI-generated briefs</div>
            </button>
            
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
              <Icons.MapPin className="w-6 h-6 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900">Local SEO</div>
              <div className="text-sm text-gray-600">Optimize GMB listing</div>
            </button>
            
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
              <Icons.Link className="w-6 h-6 text-orange-600 mb-2" />
              <div className="font-medium text-gray-900">Backlink Analysis</div>
              <div className="text-sm text-gray-600">Find link opportunities</div>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Icons.Activity className="w-5 h-5 text-green-600 mr-2" />
            Recent SEO Activity
          </h3>
          
          <div className="space-y-4">
            {[
              {
                icon: Icons.TrendingUp,
                title: 'Keyword "best running shoes" moved to position #2',
                time: '2 hours ago',
                type: 'ranking'
              },
              {
                icon: Icons.FileText,
                title: 'New content brief generated for "yoga for beginners"',
                time: '4 hours ago',
                type: 'content'
              },
              {
                icon: Icons.MapPin,
                title: 'GMB listing optimized for "Local Fitness Center"',
                time: '6 hours ago',
                type: 'local'
              },
              {
                icon: Icons.Link,
                title: '5 new backlinks acquired from fitness blogs',
                time: '1 day ago',
                type: 'backlinks'
              }
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;