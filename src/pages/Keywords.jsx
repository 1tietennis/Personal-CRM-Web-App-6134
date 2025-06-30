import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useSEO } from '../context/SEOContext';
import toast from 'react-hot-toast';

function Keywords() {
  const { state, dispatch } = useSEO();
  const { keywords } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    searchVolume: '',
    difficulty: '',
    intent: 'informational',
    type: 'short-tail'
  });

  // Mock keyword data for demonstration
  const mockKeywords = [
    {
      id: '1',
      keyword: 'best running shoes',
      searchVolume: 49500,
      difficulty: 65,
      intent: 'commercial',
      type: 'short-tail',
      currentPosition: 2,
      previousPosition: 4,
      url: '/running-shoes-guide',
      traffic: 2840,
      cpc: 2.45
    },
    {
      id: '2',
      keyword: 'running shoes for flat feet',
      searchVolume: 8100,
      difficulty: 42,
      intent: 'commercial',
      type: 'long-tail',
      currentPosition: 1,
      previousPosition: 3,
      url: '/flat-feet-running-shoes',
      traffic: 1820,
      cpc: 3.20
    },
    {
      id: '3',
      keyword: 'how to choose running shoes',
      searchVolume: 12000,
      difficulty: 38,
      intent: 'informational',
      type: 'long-tail',
      currentPosition: 5,
      previousPosition: 8,
      url: '/choose-running-shoes',
      traffic: 890,
      cpc: 1.80
    }
  ];

  const allKeywords = keywords.length > 0 ? keywords : mockKeywords;

  const filteredKeywords = allKeywords.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterBy === 'all') return matchesSearch;
    return matchesSearch && keyword.type === filterBy;
  });

  const handleAddKeyword = () => {
    if (!newKeyword.keyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    dispatch({
      type: 'ADD_KEYWORD',
      payload: {
        ...newKeyword,
        searchVolume: parseInt(newKeyword.searchVolume) || 0,
        difficulty: parseInt(newKeyword.difficulty) || 0,
        currentPosition: null,
        previousPosition: null,
        traffic: 0,
        cpc: 0
      }
    });

    setNewKeyword({
      keyword: '',
      searchVolume: '',
      difficulty: '',
      intent: 'informational',
      type: 'short-tail'
    });
    setShowAddKeyword(false);
    toast.success('Keyword added successfully!');
  };

  const analyzeKeywords = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const suggestions = [
      'running shoes for beginners',
      'best marathon running shoes',
      'waterproof running shoes',
      'running shoes for wide feet',
      'minimalist running shoes'
    ];

    toast.success(`AI found ${suggestions.length} new keyword opportunities!`);
    setIsAnalyzing(false);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'text-green-600 bg-green-100';
    if (difficulty < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPositionChange = (current, previous) => {
    if (!current || !previous) return null;
    const change = previous - current;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Keyword Research</h1>
            <p className="text-gray-600">
              AI-powered keyword analysis and opportunity discovery
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={analyzeKeywords}
              disabled={isAnalyzing}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? (
                <Icons.RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Icons.Brain className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
            </button>
            
            <button
              onClick={() => setShowAddKeyword(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add Keyword
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="short-tail">Short-tail</option>
          <option value="long-tail">Long-tail</option>
        </select>
      </div>

      {/* Keywords Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keyword
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Traffic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKeywords.map((keyword, index) => {
                const positionChange = getPositionChange(keyword.currentPosition, keyword.previousPosition);
                
                return (
                  <motion.tr
                    key={keyword.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{keyword.keyword}</div>
                        <div className="text-sm text-gray-500 capitalize">{keyword.type}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {keyword.searchVolume.toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(keyword.difficulty)}`}>
                        {keyword.difficulty}%
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {keyword.currentPosition ? (
                          <>
                            <span className="font-medium text-gray-900">#{keyword.currentPosition}</span>
                            {positionChange && positionChange.direction !== 'same' && (
                              <span className={`flex items-center text-xs ${
                                positionChange.direction === 'up' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {positionChange.direction === 'up' ? (
                                  <Icons.TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <Icons.TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {positionChange.value}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">Not tracked</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{keyword.traffic}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        keyword.intent === 'commercial' ? 'bg-green-100 text-green-800' :
                        keyword.intent === 'transactional' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {keyword.intent}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Icons.BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Icons.FileText className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Keyword Modal */}
      <AnimatePresence>
        {showAddKeyword && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowAddKeyword(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Keyword</h3>
                  <button
                    onClick={() => setShowAddKeyword(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keyword
                    </label>
                    <input
                      type="text"
                      value={newKeyword.keyword}
                      onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter keyword"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search Volume
                      </label>
                      <input
                        type="number"
                        value={newKeyword.searchVolume}
                        onChange={(e) => setNewKeyword({ ...newKeyword, searchVolume: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newKeyword.difficulty}
                        onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intent
                      </label>
                      <select
                        value={newKeyword.intent}
                        onChange={(e) => setNewKeyword({ ...newKeyword, intent: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="informational">Informational</option>
                        <option value="commercial">Commercial</option>
                        <option value="transactional">Transactional</option>
                        <option value="navigational">Navigational</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={newKeyword.type}
                        onChange={(e) => setNewKeyword({ ...newKeyword, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="short-tail">Short-tail</option>
                        <option value="long-tail">Long-tail</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddKeyword(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddKeyword}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Keyword
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Keywords;