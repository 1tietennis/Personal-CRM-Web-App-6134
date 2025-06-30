import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useSEO } from '../context/SEOContext';
import ReactECharts from 'echarts-for-react';

function ProfitMargins() {
  const { state, dispatch } = useSEO();
  const { margins } = state;
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Pricing models based on margin percentages
  const pricingModels = {
    0: {
      name: 'Basic Package',
      margin: 0,
      price: 500,
      cost: 500,
      profit: 0,
      services: ['Basic SEO audit', 'Keyword research', 'On-page optimization'],
      description: 'Break-even package for new clients'
    },
    15: {
      name: 'Growth Package',
      margin: 15,
      price: 1200,
      cost: 1020,
      profit: 180,
      services: ['Everything in Basic', 'Content strategy', 'Technical SEO', 'Monthly reporting'],
      description: 'Sustainable growth with moderate profit'
    },
    30: {
      name: 'Premium Package',
      margin: 30,
      price: 2500,
      cost: 1750,
      profit: 750,
      services: ['Everything in Growth', 'AI optimization', 'Local SEO', 'Link building'],
      description: 'Recommended minimum for healthy margins'
    },
    45: {
      name: 'Enterprise Package',
      margin: 45,
      price: 5000,
      cost: 2750,
      profit: 2250,
      services: ['Everything in Premium', 'Multi-platform strategy', 'Dedicated account manager'],
      description: 'High-value comprehensive solution'
    },
    60: {
      name: 'Elite Package',
      margin: 60,
      price: 8500,
      cost: 3400,
      profit: 5100,
      services: ['Everything in Enterprise', 'Custom AI models', 'Real-time optimization'],
      description: 'Premium positioning with exceptional value'
    },
    75: {
      name: 'Platinum Package',
      margin: 75,
      price: 15000,
      cost: 3750,
      profit: 11250,
      services: ['Everything in Elite', 'Full ecosystem control', 'Executive consulting'],
      description: 'Market leadership positioning'
    },
    90: {
      name: 'Diamond Package',
      margin: 90,
      price: 25000,
      cost: 2500,
      profit: 22500,
      services: ['Revolutionary AI-powered SEO', 'Complete market dominance', 'Board-level strategy'],
      description: 'Ultra-premium transformation package'
    }
  };

  // ROI calculation chart
  const roiChartOption = {
    title: {
      text: 'Profit Margins by Package',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>
                Price: $${data.value.toLocaleString()}<br/>
                Profit: $${(data.value * data.data.margin / 100).toLocaleString()}<br/>
                Margin: ${data.data.margin}%`;
      }
    },
    xAxis: {
      type: 'category',
      data: Object.values(pricingModels).map(model => model.name),
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      name: 'Amount ($)'
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: Object.values(pricingModels).map(model => ({
          value: model.price,
          margin: model.margin
        })),
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Profit',
        type: 'bar',
        data: Object.values(pricingModels).map(model => model.profit),
        itemStyle: { color: '#10B981' }
      }
    ]
  };

  // Margin distribution chart
  const marginChartOption = {
    title: {
      text: 'Package Distribution',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)'
    },
    series: [
      {
        name: 'Revenue',
        type: 'pie',
        radius: '60%',
        data: Object.values(pricingModels).map(model => ({
          value: model.price,
          name: model.name
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

  const getMarginColor = (margin) => {
    if (margin < 30) return 'border-red-200 bg-red-50';
    if (margin < 45) return 'border-yellow-200 bg-yellow-50';
    if (margin < 60) return 'border-green-200 bg-green-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getMarginTextColor = (margin) => {
    if (margin < 30) return 'text-red-800';
    if (margin < 45) return 'text-yellow-800';
    if (margin < 60) return 'text-green-800';
    return 'text-blue-800';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profit Margins & Pricing</h1>
        <p className="text-gray-600">
          Optimize pricing strategies with adjustable margin targets from 0-90%
        </p>
      </div>

      {/* Current Margin Indicator */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Target Margin</h3>
            <span className={`px-4 py-2 rounded-lg font-bold text-xl ${getMarginTextColor(margins.targetMargin)} ${getMarginColor(margins.targetMargin)}`}>
              {margins.targetMargin}%
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Adjust Target Margin</span>
              <span>{margins.targetMargin}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={margins.targetMargin}
              onChange={(e) => {
                const newMargin = parseInt(e.target.value);
                dispatch({ type: 'UPDATE_MARGIN_TARGET', payload: newMargin });
                localStorage.setItem('seo_margins', JSON.stringify({ targetMargin: newMargin }));
              }}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0%</span>
              <span>30%</span>
              <span>60%</span>
              <span>90%</span>
            </div>
          </div>

          {margins.targetMargin < 30 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <Icons.AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Warning: Below recommended 30% minimum margin</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Models Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Pricing Strategy Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(pricingModels).map(([threshold, model]) => (
            <motion.div
              key={threshold}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parseInt(threshold) * 0.05 }}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                margins.targetMargin >= parseInt(threshold)
                  ? getMarginColor(model.margin)
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${selectedPackage === threshold ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedPackage(selectedPackage === threshold ? null : threshold)}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">{model.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  model.margin < 30 ? 'bg-red-100 text-red-800' :
                  model.margin < 60 ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {model.margin}%
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold">${model.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">${model.cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit:</span>
                  <span className="font-bold text-green-600">${model.profit.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{model.description}</p>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 text-sm">Included Services:</h5>
                <ul className="space-y-1">
                  {model.services.slice(0, 3).map((service, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-center">
                      <Icons.Check className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                  {model.services.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{model.services.length - 3} more services
                    </li>
                  )}
                </ul>
              </div>

              {margins.targetMargin >= parseInt(threshold) && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <span className="text-xs font-medium text-green-600">
                    ✓ Matches current target margin
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={roiChartOption} style={{ height: '350px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={marginChartOption} style={{ height: '350px' }} />
        </motion.div>
      </div>

      {/* Strategy Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Icons.Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          Strategy Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">0-29% Margin</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Focus on client acquisition</li>
              <li>• Build portfolio and testimonials</li>
              <li>• Establish baseline processes</li>
              <li>• Prepare for margin improvement</li>
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">30-59% Margin</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Optimize operational efficiency</li>
              <li>• Implement automation tools</li>
              <li>• Upsell additional services</li>
              <li>• Build premium positioning</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">60-90% Margin</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Focus on high-value clients</li>
              <li>• Develop proprietary solutions</li>
              <li>• Create premium service tiers</li>
              <li>• Scale with strategic partnerships</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Current Recommendation</h4>
          <p className="text-sm text-blue-700">
            {margins.targetMargin < 30 
              ? "Consider increasing prices or reducing costs to reach the recommended 30% minimum margin for sustainable growth."
              : margins.targetMargin < 60
              ? "Good margin range. Focus on value-added services and process optimization to increase profitability."
              : "Excellent margin! Focus on maintaining quality while scaling operations and developing premium offerings."
            }
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProfitMargins;