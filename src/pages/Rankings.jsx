import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

function Rankings() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const rankingData = [
    { keyword: 'digital marketing services', position: 2, change: 1, volume: 12000, difficulty: 45 },
    { keyword: 'seo agency', position: 3, change: -1, volume: 8000, difficulty: 65 },
    { keyword: 'local seo services', position: 1, change: 2, volume: 5000, difficulty: 35 },
    { keyword: 'content marketing', position: 4, change: 0, volume: 15000, difficulty: 55 },
    { keyword: 'social media marketing', position: 5, change: 3, volume: 20000, difficulty: 50 }
  ];

  const getPositionColor = (position) => {
    if (position <= 3) return 'text-green-600';
    if (position <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return { icon: Icons.ArrowUpRight, class: 'text-green-600' };
    if (change < 0) return { icon: Icons.ArrowDownRight, class: 'text-red-600' };
    return { icon: Icons.Minus, class: 'text-gray-400' };
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Keyword Rankings</h1>
        <p className="text-gray-600">
          Track your keyword positions and performance in search results
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
          }}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
        >
          <Icons.RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Rankings
        </button>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keyword
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rankingData.map((keyword, index) => {
                const changeInfo = getChangeIcon(keyword.change);
                const ChangeIcon = changeInfo.icon;
                
                return (
                  <motion.tr
                    key={keyword.keyword}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {keyword.keyword}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getPositionColor(keyword.position)}`}>
                        #{keyword.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center text-sm ${changeInfo.class}`}>
                        <ChangeIcon className="w-4 h-4 mr-1" />
                        {keyword.change > 0 ? '+' : ''}{keyword.change}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {keyword.volume.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(keyword.difficulty)}`}>
                        {keyword.difficulty}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Rankings;