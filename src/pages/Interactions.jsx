import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCRM } from '../context/CRMContext';
import InteractionModal from '../components/InteractionModal';
import { format } from 'date-fns';

const { FiPlus, FiSearch, FiPhone, FiMail, FiVideo, FiMessageCircle, FiTrash2, FiFilter } = FiIcons;

function Interactions() {
  const { state, dispatch } = useCRM();
  const { interactions, contacts } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInteractions = interactions
    .filter(interaction => {
      const contact = contacts.find(c => c.id === interaction.contactId);
      const matchesSearch = contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === 'all') return matchesSearch;
      return matchesSearch && interaction.type === filterBy;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddInteraction = (interactionData) => {
    dispatch({ type: 'ADD_INTERACTION', payload: interactionData });
    setIsModalOpen(false);
  };

  const handleDeleteInteraction = (interactionId) => {
    dispatch({ type: 'DELETE_INTERACTION', payload: interactionId });
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call': return FiPhone;
      case 'email': return FiMail;
      case 'meeting': return FiVideo;
      default: return FiMessageCircle;
    }
  };

  const getInteractionColor = (type) => {
    switch (type) {
      case 'call': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactions</h1>
            <p className="text-gray-600">Track all your communications and meetings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
            Add Interaction
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search interactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Interactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <AnimatePresence>
          {filteredInteractions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredInteractions.map((interaction, index) => {
                const contact = contacts.find(c => c.id === interaction.contactId);
                return (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getInteractionColor(interaction.type)}`}>
                            <SafeIcon icon={getInteractionIcon(interaction.type)} className="w-5 h-5" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)} with {contact?.name || 'Unknown Contact'}
                            </h3>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getInteractionColor(interaction.type)}`}>
                              {interaction.type}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{interaction.notes}</p>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{format(new Date(interaction.date), 'MMM d, yyyy at h:mm a')}</span>
                            {contact?.company && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{contact.company}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteInteraction(interaction.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <SafeIcon icon={FiMessageCircle} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterBy !== 'all' ? 'No interactions found' : 'No interactions yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start tracking your communications and meetings'
                }
              </p>
              {!searchTerm && filterBy === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
                  Add Your First Interaction
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interaction Modal */}
      <InteractionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddInteraction}
        contacts={contacts}
      />
    </motion.div>
  );
}

export default Interactions;