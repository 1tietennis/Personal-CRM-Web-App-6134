import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiBuilding } = FiIcons;

function ContactCard({ contact, index, onEdit, onDelete }) {
  const getCategoryColor = (category) => {
    const colors = {
      personal: 'bg-green-100 text-green-800',
      professional: 'bg-blue-100 text-blue-800',
      client: 'bg-purple-100 text-purple-800',
      vendor: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(contact.name)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{contact.name}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(contact.category)}`}>
              {contact.category}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(contact)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {contact.company && (
          <div className="flex items-center text-gray-600">
            <SafeIcon icon={FiBuilding} className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{contact.company}</span>
          </div>
        )}
        
        <div className="flex items-center text-gray-600">
          <SafeIcon icon={FiMail} className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{contact.email}</span>
        </div>
        
        {contact.phone && (
          <div className="flex items-center text-gray-600">
            <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{contact.phone}</span>
          </div>
        )}
        
        {contact.location && (
          <div className="flex items-center text-gray-600">
            <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{contact.location}</span>
          </div>
        )}
      </div>

      {contact.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{contact.notes}</p>
        </div>
      )}
    </motion.div>
  );
}

export default ContactCard;