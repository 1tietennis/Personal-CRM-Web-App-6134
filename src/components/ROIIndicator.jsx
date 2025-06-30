import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useSEO } from '../context/SEOContext';

function ROIIndicator() {
  const { state, dispatch } = useSEO();
  const { roiData, margins } = state;
  const [isExpanded, setIsExpanded] = useState(false);

  const getIndicatorColor = (margin) => {
    if (margin < 30) return 'from-red-500 to-red-600';
    if (margin < 45) return 'from-yellow-500 to-orange-500';
    if (margin < 60) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-purple-600';
  };

  const getStatusIcon = (margin) => {
    if (margin < 30) return Icons.TrendingDown;
    if (margin < 60) return Icons.TrendingUp;
    return Icons.Zap;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentStrategy = margins.strategies[
    Object.keys(margins.strategies)
      .map(Number)
      .filter(threshold => margins.targetMargin >= threshold)
      .sort((a, b) => b - a)[0]
  ];

  const StatusIcon = getStatusIcon(margins.targetMargin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div 
        className={`bg-gradient-to-r ${getIndicatorColor(margins.targetMargin)} p-6 text-white cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">ROI Growth Indicator</h3>
              <p className="text-white text-opacity-90 text-sm">
                Target Margin: {margins.targetMargin}%
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">
              {roiData.growthRate > 0 ? '+' : ''}{roiData.growthRate.toFixed(1)}%
            </div>
            <div className="text-sm text-white text-opacity-90">
              vs. Last 30 Days
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
            <span>Current Performance</span>
            <span>{margins.targetMargin}% of 90%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(margins.targetMargin / 90) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-white rounded-full h-2"
            />
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white"
          >
            <div className="p-6 space-y-6">
              {/* Revenue Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Icons.Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Current 30 Days</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(roiData.current30Days)}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Icons.History className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Previous 30 Days</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(roiData.previous30Days)}
                  </div>
                </div>
              </div>

              {/* Current Strategy */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Icons.Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Current Strategy</span>
                </div>
                <h4 className="font-bold text-blue-900 mb-1">{currentStrategy?.name}</h4>
                <p className="text-sm text-blue-700">{currentStrategy?.description}</p>
              </div>

              {/* Margin Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Adjust Target Margin
                  </label>
                  <span className="text-sm text-gray-500">
                    {margins.targetMargin}%
                  </span>
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>30%</span>
                  <span>60%</span>
                  <span>90%</span>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Icons.Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                  Improvement Plan
                </h4>
                <div className="space-y-2">
                  {roiData.improvements.slice(0, 3).map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-green-600">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategy Selector */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Available Strategies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(margins.strategies).map(([threshold, strategy]) => (
                    <button
                      key={threshold}
                      onClick={() => {
                        dispatch({ type: 'UPDATE_MARGIN_TARGET', payload: parseInt(threshold) });
                        localStorage.setItem('seo_margins', JSON.stringify({ targetMargin: parseInt(threshold) }));
                      }}
                      className={`p-3 text-left rounded-lg border transition-all ${
                        margins.targetMargin >= parseInt(threshold)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{strategy.name}</div>
                      <div className="text-xs text-gray-600">{threshold}% margin</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ROIIndicator;