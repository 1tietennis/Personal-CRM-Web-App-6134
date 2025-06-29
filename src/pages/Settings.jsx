import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';

const { FiSettings, FiZap, FiKey, FiUser, FiGlobe, FiSave, FiCheck, FiBook } = FiIcons;

function Settings() {
  const { state, dispatch } = useSocialMedia();
  const { aiSettings } = state;
  const [formData, setFormData] = useState(aiSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_AI_SETTINGS', payload: formData });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const brandVoices = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Formal, business-focused tone'
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Friendly, conversational tone'
    },
    {
      id: 'humorous',
      name: 'Humorous',
      description: 'Fun, witty, and entertaining'
    },
    {
      id: 'inspirational',
      name: 'Inspirational',
      description: 'Motivational and uplifting'
    },
    {
      id: 'educational',
      name: 'Educational',
      description: 'Informative and instructional'
    },
    {
      id: 'bible-scholar',
      name: 'Bible Scholar',
      description: 'Bold, Biblical, Unapologetic - Speaks with Scripture\'s authority',
      icon: FiBook,
      detailed: {
        motto: 'Bold, Biblical, Unapologetic',
        description: 'This brand speaks with the clarity of Scripture, the conviction of a prophet, and the urgency of eternity. It is a voice that teaches, warns, and restores, always with reverence to God\'s Word.',
        pillars: [
          {
            title: 'Authoritative (Not Arrogant)',
            points: [
              'Speaks with the weight of Scripture, not opinion',
              'Commands attention by citing book, chapter, and verse',
              'Delivers truth without hesitation, but not without compassion'
            ],
            example: '"God has already spoken—your response determines your eternity (John 12:48)."'
          },
          {
            title: 'Confrontational (Not Condemning)',
            points: [
              'Exposes error with courage and love',
              'Names false doctrines plainly',
              'Speaks like Jesus, Paul, or Peter: bold truth for the soul\'s sake'
            ],
            example: '"False doctrine doesn\'t save—it damns. (Galatians 1:8-9)"'
          },
          {
            title: 'Expository (Not Emotional)',
            points: [
              'Explains what the Bible means, not what people want it to mean',
              'Uses historical and grammatical context',
              'Always applies Scripture after proper exegesis'
            ],
            example: '"Context matters. This passage was written to X, about Y, teaching Z. Only then can we apply it today."'
          },
          {
            title: 'Evangelistic (Not Entertaining)',
            points: [
              'Prioritizes soul-winning over platform-building',
              'Never posts for trends or applause',
              'Always includes a call to obey the Gospel, not just believe it'
            ],
            example: '"The Gospel isn\'t a suggestion—it\'s a command (Acts 17:30)."'
          },
          {
            title: 'Unifying in Truth (Not Tolerant of Error)',
            points: [
              'Seeks unity only in the doctrine of Christ (2 John 9-11)',
              'Avoids vague phrases like "all churches are good"',
              'Refuses to share space with error'
            ],
            example: '"Jesus prayed for unity—but only in truth (John 17:17, 20-21)."'
          }
        ],
        style: {
          tone: 'Direct, scriptural, urgent',
          structure: 'Short, declarative, often includes full Bible verses',
          vocabulary: 'Clear, plain-spoken, doctrinally precise (uses "baptism," "repent," not "faith journey")',
          appeal: 'To the conscience, not just the emotion (Hebrews 4:12)'
        }
      }
    }
  ];

  const postingFrequencies = [
    {
      id: 'daily',
      name: 'Daily',
      description: 'Post once per day'
    },
    {
      id: 'twice-daily',
      name: 'Twice Daily',
      description: 'Post twice per day'
    },
    {
      id: 'weekly',
      name: 'Weekly',
      description: 'Post 3-4 times per week'
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Set your own schedule'
    }
  ];

  const selectedVoice = brandVoices.find(voice => voice.id === formData.brandVoice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your AI settings and preferences</p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* AI Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiZap} className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">AI Configuration</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiKey} className="w-4 h-4 inline mr-1" />
                OpenAI API Key
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your OpenAI API key"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your API key is stored locally and never shared. Get one from{' '}
                <a
                  href="https://openai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  OpenAI
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Brand Voice
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {brandVoices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => handleChange('brandVoice', voice.id)}
                    className={`text-left p-4 rounded-lg border transition-all ${
                      formData.brandVoice === voice.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${voice.id === 'bible-scholar' ? 'border-2' : ''}`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {voice.icon && (
                        <SafeIcon icon={voice.icon} className="w-4 h-4 text-purple-600" />
                      )}
                      <div className="font-medium text-gray-900">{voice.name}</div>
                      {voice.id === 'bible-scholar' && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{voice.description}</div>
                    {voice.detailed && (
                      <div className="text-xs text-purple-600 mt-1 font-medium">
                        {voice.detailed.motto}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bible Scholar Voice Details */}
            {formData.brandVoice === 'bible-scholar' && selectedVoice?.detailed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-purple-50 border border-purple-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <SafeIcon icon={FiBook} className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-900">Bible Scholar Voice Guide</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-purple-800 italic mb-2">"{selectedVoice.detailed.motto}"</p>
                  <p className="text-sm text-purple-700">{selectedVoice.detailed.description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-purple-900">🧱 Voice Pillars:</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {selectedVoice.detailed.pillars.map((pillar, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                        <h5 className="font-semibold text-purple-900 mb-2">{pillar.title}</h5>
                        <ul className="text-xs text-purple-700 space-y-1 mb-2">
                          {pillar.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start">
                              <span className="text-purple-400 mr-1">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                        <div className="bg-purple-100 rounded p-2 mt-2">
                          <p className="text-xs text-purple-800 italic">Example: {pillar.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">🔠 Voice Style:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-purple-800">Tone:</span>
                      <span className="text-purple-700 ml-1">{selectedVoice.detailed.style.tone}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-800">Structure:</span>
                      <span className="text-purple-700 ml-1">{selectedVoice.detailed.style.structure}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-800">Vocabulary:</span>
                      <span className="text-purple-700 ml-1">{selectedVoice.detailed.style.vocabulary}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-800">Appeal:</span>
                      <span className="text-purple-700 ml-1">{selectedVoice.detailed.style.appeal}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Auto-Posting Frequency
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {postingFrequencies.map((frequency) => (
                  <button
                    key={frequency.id}
                    onClick={() => handleChange('postingFrequency', frequency.id)}
                    className={`text-left p-4 rounded-lg border transition-all ${
                      formData.postingFrequency === frequency.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{frequency.name}</div>
                    <div className="text-sm text-gray-600">{frequency.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Auto-Generation
                </label>
                <p className="text-sm text-gray-500">
                  Automatically generate content based on your settings
                </p>
              </div>
              <button
                onClick={() => handleChange('autoGenerate', !formData.autoGenerate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.autoGenerate ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.autoGenerate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Themes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiGlobe} className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Content Themes</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add content themes (one per line)
            </label>
            <textarea
              value={formData.contentThemes?.join('\n') || ''}
              onChange={(e) =>
                handleChange(
                  'contentThemes',
                  e.target.value.split('\n').filter(theme => theme.trim())
                )
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                formData.brandVoice === 'bible-scholar'
                  ? "Biblical Doctrine Explained\nFalse Teaching Exposed\nGospel Obedience\nScriptural Authority\nChurch of Christ Distinctives\nBaptism for Salvation\nFaith vs Works Balance\nProphecy Fulfilled"
                  : "Digital Marketing Tips\nIndustry News\nBehind the Scenes\nCustomer Success Stories\nProduct Updates"
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              AI will use these themes to generate relevant content for your brand
              {formData.brandVoice === 'bible-scholar' && (
                <span className="block text-purple-600 font-medium mt-1">
                  📖 Bible Scholar themes should focus on doctrinal teaching, Scripture exposition, and Gospel truth
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.brandVoice === 'bible-scholar' ? 'Ministry/Church Name' : 'Business Name'}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={
                  formData.brandVoice === 'bible-scholar'
                    ? "Your church or ministry name"
                    : "Your business name"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.brandVoice === 'bible-scholar' ? 'Ministry Focus' : 'Industry'}
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                {formData.brandVoice === 'bible-scholar' ? (
                  <>
                    <option>Select your ministry focus</option>
                    <option>Local Church Ministry</option>
                    <option>Biblical Teaching</option>
                    <option>Evangelism</option>
                    <option>Apologetics</option>
                    <option>Youth Ministry</option>
                    <option>Biblical Counseling</option>
                    <option>Missions</option>
                    <option>Other</option>
                  </>
                ) : (
                  <>
                    <option>Select your industry</option>
                    <option>Technology</option>
                    <option>Marketing</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Retail</option>
                    <option>Other</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={
                  formData.brandVoice === 'bible-scholar'
                    ? "Describe your audience (e.g., seeking souls, church members, fellow Christians, denominational friends, etc.)"
                    : "Describe your target audience..."
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : formData.brandVoice === 'bible-scholar'
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <SafeIcon icon={saved ? FiCheck : FiSave} className="w-5 h-5 mr-2" />
            {saved ? 'Saved!' : 'Save Settings'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Settings;