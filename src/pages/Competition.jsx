import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

function Competition() {
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);

  // Mock data
  const competitors = [
    {
      id: 1,
      name: 'Competitor A',
      domain: 'competitora.com',
      metrics: {
        domainAuthority: 45,
        backlinks: 15000,
        keywords: 8500,
        traffic: 125000
      },
      growth: {
        keywords: 12,
        traffic: 8,
        backlinks: 15
      }
    },
    {
      id: 2,
      name: 'Competitor B',
      domain: 'competitorb.com',
      metrics: {
        domainAuthority: 52,
        backlinks: 22000,
        keywords: 12000,
        traffic: 180000
      },
      growth: {
        keywords: -5,
        traffic: 15,
        backlinks: 10
      }
    },
    {
      id: 3,
      name: 'Competitor C',
      domain: 'competitorc.com',
      metrics: {
        domainAuthority: 38,
        backlinks: 8500,
        keywords: 5000,
        traffic: 75000
      },
      growth: {
        keywords: 20,
        traffic: 25,
        backlinks: 5
      }
    }
  ];

  const getGrowthColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return Icons.TrendingUp;
    if (value < 0) return Icons.TrendingDown;
    return Icons.Minus;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitor Analysis</h1>
        <p className="text-gray-600">
          Track and analyze your competitors' performance and strategies
        </p>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {competitors.map((competitor, index) => (
          <motion.div
            key={competitor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm border ${
              selectedCompetitor === competitor.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200'
            } p-6 cursor-pointer hover:shadow-md transition-all`}
            onClick={() => setSelectedCompetitor(competitor.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{competitor.name}</h3>
                <p className="text-sm text-gray-600">{competitor.domain}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icons.Building className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Domain Authority</span>
                <span className="font-medium text-gray-900">{competitor.metrics.domainAuthority}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Backlinks</span>
                <span className="font-medium text-gray-900">
                  {competitor.metrics.backlinks.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Keywords</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {competitor.metrics.keywords.toLocaleString()}
                  </span>
                  <div className={`flex items-center ${getGrowthColor(competitor.growth.keywords)}`}>
                    {React.createElement(getGrowthIcon(competitor.growth.keywords), { className: 'w-4 h-4' })}
                    <span className="text-xs ml-1">
                      {competitor.growth.keywords > 0 && '+'}
                      {competitor.growth.keywords}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Traffic</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {competitor.metrics.traffic.toLocaleString()}
                  </span>
                  <div className={`flex items-center ${getGrowthColor(competitor.growth.traffic)}`}>
                    {React.createElement(getGrowthIcon(competitor.growth.traffic), { className: 'w-4 h-4' })}
                    <span className="text-xs ml-1">
                      {competitor.growth.traffic > 0 && '+'}
                      {competitor.growth.traffic}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Icons.ChartBar className="w-4 h-4 mr-2" />
              View Full Analysis
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
          <Icons.Search className="w-6 h-6 text-purple-600 mb-2" />
          <h3 className="font-medium text-purple-900">Find New Competitors</h3>
          <p className="text-sm text-purple-700">Discover emerging competitors in your space</p>
        </button>

        <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
          <Icons.FileSpreadsheet className="w-6 h-6 text-green-600 mb-2" />
          <h3 className="font-medium text-green-900">Export Analysis</h3>
          <p className="text-sm text-green-700">Download detailed competitor reports</p>
        </button>

        <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
          <Icons.Bell className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-medium text-blue-900">Set Up Alerts</h3>
          <p className="text-sm text-blue-700">Get notified of competitor changes</p>
        </button>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Icons.Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          Competitive Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Key Opportunities</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <Icons.Target className="w-4 h-4 text-green-600 mt-1" />
                <span className="text-sm text-gray-700">
                  Target "content marketing" keyword - competitors ranking lower
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Icons.Link className="w-4 h-4 text-green-600 mt-1" />
                <span className="text-sm text-gray-700">
                  Build backlinks from high-authority industry sites
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Icons.FileText className="w-4 h-4 text-green-600 mt-1" />
                <span className="text-sm text-gray-700">
                  Create comprehensive guides on trending topics
                </span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Competitive Threats</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <Icons.AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                <span className="text-sm text-gray-700">
                  Competitor B gaining traction in local SEO keywords
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Icons.TrendingUp className="w-4 h-4 text-red-600 mt-1" />
                <span className="text-sm text-gray-700">
                  Rising competition for "digital marketing" terms
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Icons.Shield className="w-4 h-4 text-red-600 mt-1" />
                <span className="text-sm text-gray-700">
                  New competitor entering market with strong domain authority
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Competition;