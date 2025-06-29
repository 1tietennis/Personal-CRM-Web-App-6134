import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';

const { FiX, FiImage, FiVideo, FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiCalendar, FiClock } = FiIcons;

function PostCreator({ isOpen, onClose }) {
  const { dispatch } = useSocialMedia();
  const [formData, setFormData] = useState({
    content: '',
    platforms: [],
    media: null,
    scheduleDate: '',
    scheduleTime: '',
    hashtags: ''
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, media: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1
  });

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: FiInstagram, color: 'from-pink-500 to-purple-600' },
    { id: 'twitter', name: 'Twitter', icon: FiTwitter, color: 'from-blue-400 to-blue-600' },
    { id: 'facebook', name: 'Facebook', icon: FiFacebook, color: 'from-blue-600 to-blue-800' },
    { id: 'linkedin', name: 'LinkedIn', icon: FiLinkedin, color: 'from-blue-700 to-blue-900' }
  ];

  const handlePlatformToggle = (platformId) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      status: formData.scheduleDate ? 'scheduled' : 'published',
      scheduledFor: formData.scheduleDate && formData.scheduleTime 
        ? new Date(`${formData.scheduleDate}T${formData.scheduleTime}`).toISOString()
        : null
    };

    dispatch({ type: 'ADD_POST', payload: postData });
    
    // Reset form
    setFormData({
      content: '',
      platforms: [],
      media: null,
      scheduleDate: '',
      scheduleTime: '',
      hashtags: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Post</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's on your mind?"
                  required
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media (Optional)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {formData.media ? (
                    <div className="space-y-2">
                      <img
                        src={formData.media}
                        alt="Upload preview"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-600">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SafeIcon icon={FiImage} className="w-8 h-8 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600">
                          {isDragActive ? 'Drop files here' : 'Drag & drop images or videos, or click to select'}
                        </p>
                        <p className="text-sm text-gray-400">PNG, JPG, GIF, MP4 up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Platforms
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        formData.platforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center mr-2`}>
                        <SafeIcon icon={platform.icon} className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags (Optional)
                </label>
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#marketing #socialmedia #content"
                />
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-1" />
                    Schedule Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiClock} className="w-4 h-4 inline mr-1" />
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.scheduleDate}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.content || formData.platforms.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {formData.scheduleDate ? 'Schedule Post' : 'Publish Now'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default PostCreator;