import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCRM } from '../context/CRMContext';
import ReactECharts from 'echarts-for-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, isWithinInterval } from 'date-fns';

const { FiTrendingUp, FiUsers, FiMessageCircle, FiCalendar, FiPhone, FiMail, FiVideo } = FiIcons;

function Analytics() {
  const { state } = useCRM();
  const { contacts, interactions } = state;

  // Calculate various metrics
  const totalContacts = contacts.length;
  const totalInteractions = interactions.length;
  
  // Interactions by type
  const interactionsByType = interactions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {});

  // Contacts by category
  const contactsByCategory = contacts.reduce((acc, contact) => {
    acc[contact.category] = (acc[contact.category] || 0) + 1;
    return acc;
  }, {});

  // Monthly interactions for the last 6 months
  const last6Months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i));
  const monthlyInteractions = last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const count = interactions.filter(interaction => 
      isWithinInterval(new Date(interaction.date), { start: monthStart, end: monthEnd })
    ).length;
    return {
      month: format(month, 'MMM yyyy'),
      count
    };
  });

  // Chart options
  const interactionTypeChartOption = {
    title: {
      text: 'Interactions by Type',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Interactions',
        type: 'pie',
        radius: '60%',
        data: Object.entries(interactionsByType).map(([type, count]) => ({
          value: count,
          name: type.charAt(0).toUpperCase() + type.slice(1)
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

  const contactCategoryChartOption = {
    title: {
      text: 'Contacts by Category',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: Object.keys(contactsByCategory).map(cat => 
        cat.charAt(0).toUpperCase() + cat.slice(1)
      )
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Contacts',
        type: 'bar',
        data: Object.values(contactsByCategory),
        itemStyle: {
          color: '#3B82F6'
        }
      }
    ]
  };

  const monthlyTrendChartOption = {
    title: {
      text: 'Monthly Interaction Trends',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: monthlyInteractions.map(item => item.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Interactions',
        type: 'line',
        data: monthlyInteractions.map(item => item.count),
        smooth: true,
        itemStyle: {
          color: '#10B981'
        },
        areaStyle: {
          color: 'rgba(16, 185, 129, 0.1)'
        }
      }
    ]
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call': return FiPhone;
      case 'email': return FiMail;
      case 'meeting': return FiVideo;
      default: return FiMessageCircle;
    }
  };

  const stats = [
    {
      name: 'Total Contacts',
      value: totalContacts,
      icon: FiUsers,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Interactions',
      value: totalInteractions,
      icon: FiMessageCircle,
      color: 'bg-green-500'
    },
    {
      name: 'Avg per Contact',
      value: totalContacts > 0 ? (totalInteractions / totalContacts).toFixed(1) : '0',
      icon: FiTrendingUp,
      color: 'bg-purple-500'
    },
    {
      name: 'This Month',
      value: interactions.filter(i => new Date(i.date).getMonth() === new Date().getMonth()).length,
      icon: FiCalendar,
      color: 'bg-orange-500'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights and trends from your CRM data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Interaction Types Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {Object.keys(interactionsByType).length > 0 ? (
            <ReactECharts option={interactionTypeChartOption} style={{ height: '300px' }} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <SafeIcon icon={FiMessageCircle} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No interaction data</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Categories Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {Object.keys(contactsByCategory).length > 0 ? (
            <ReactECharts option={contactCategoryChartOption} style={{ height: '300px' }} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No contact data</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Monthly Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <ReactECharts option={monthlyTrendChartOption} style={{ height: '400px' }} />
      </motion.div>

      {/* Interaction Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Interaction Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(interactionsByType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={getInteractionIcon(type)} className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Analytics;