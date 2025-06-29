import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

const { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiClock, FiInstagram, FiTwitter, FiFacebook, FiLinkedin } = FiIcons;

function ContentCalendar() {
  const { state } = useSocialMedia();
  const { scheduledPosts, posts } = state;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return FiInstagram;
      case 'twitter': return FiTwitter;
      case 'facebook': return FiFacebook;
      case 'linkedin': return FiLinkedin;
      default: return FiInstagram;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'twitter': return 'bg-blue-100 text-blue-800';
      case 'facebook': return 'bg-blue-100 text-blue-900';
      case 'linkedin': return 'bg-blue-100 text-blue-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPostsForDay = (day) => {
    return scheduledPosts.filter(post => 
      post.scheduledFor && isSameDay(new Date(post.scheduledFor), day)
    );
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Calendar</h1>
            <p className="text-gray-600">Plan and schedule your social media content</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={prevMonth}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900 min-w-max">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Scheduled Posts</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledPosts.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledPosts.filter(post => 
                  post.scheduledFor && 
                  new Date(post.scheduledFor).getMonth() === currentDate.getMonth()
                ).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Published</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <SafeIcon icon={FiInstagram} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg per Day</p>
              <p className="text-2xl font-bold text-gray-900">2.3</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <SafeIcon icon={FiPlus} className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7">
          {days.map((day, dayIndex) => {
            const dayPosts = getPostsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: dayIndex * 0.01 }}
                className={`min-h-32 p-2 border-b border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-blue-50' : ''
                } ${isSelected ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayPosts.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {dayPosts.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post, index) => (
                    <div
                      key={post.id}
                      className="text-xs p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">
                          {post.content.substring(0, 20)}...
                        </span>
                        {post.platforms && post.platforms[0] && (
                          <SafeIcon 
                            icon={getPlatformIcon(post.platforms[0])} 
                            className="w-3 h-3 text-gray-600" 
                          />
                        )}
                      </div>
                      <div className="text-gray-500">
                        {format(new Date(post.scheduledFor), 'HH:mm')}
                      </div>
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Posts for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>

          {getPostsForDay(selectedDate).length > 0 ? (
            <div className="space-y-4">
              {getPostsForDay(selectedDate).map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {post.platforms?.map((platform) => (
                        <div
                          key={platform}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(platform)}`}
                        >
                          <SafeIcon icon={getPlatformIcon(platform)} className="w-3 h-3 mr-1" />
                          {platform}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                      {format(new Date(post.scheduledFor), 'HH:mm')}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 line-clamp-3">{post.content}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {post.aiGenerated ? 'AI Generated' : 'Manual'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No posts scheduled for this date</p>
              <button className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Schedule Post
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ContentCalendar;