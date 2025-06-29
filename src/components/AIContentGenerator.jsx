import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSocialMedia } from '../context/SocialMediaContext';

const { FiZap, FiX, FiRefreshCw, FiCopy, FiCheck, FiImage, FiTrendingUp, FiTarget, FiHeart, FiBook } = FiIcons;

function AIContentGenerator({ isOpen, onClose }) {
  const { state, dispatch } = useSocialMedia();
  const { aiSettings } = state;
  
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [copied, setCopied] = useState(false);
  
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState(aiSettings?.brandVoice || 'professional');
  const [platform, setPlatform] = useState('instagram');

  const contentTypes = [
    { id: 'post', name: 'Social Post', icon: FiImage },
    { id: 'story', name: 'Story Content', icon: FiTrendingUp },
    { id: 'campaign', name: 'Campaign', icon: FiTarget },
    { id: 'engagement', name: 'Engagement Post', icon: FiHeart }
  ];

  const tones = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual & Friendly' },
    { id: 'humorous', name: 'Humorous' },
    { id: 'inspirational', name: 'Inspirational' },
    { id: 'educational', name: 'Educational' },
    { id: 'promotional', name: 'Promotional' },
    { id: 'bible-scholar', name: 'Bible Scholar', icon: FiBook }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'linkedin', name: 'LinkedIn' }
  ];

  // Generate content based on selected tone
  const generateContent = async () => {
    setGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let sampleContent;
    
    if (tone === 'bible-scholar') {
      sampleContent = [
        {
          id: 1,
          content: `"Be baptized every one of you in the name of Jesus Christ for the remission of sins" (Acts 2:38).

The Gospel is clear—belief, repentance, and baptism for salvation. Not baptism because you're saved, but baptism FOR salvation.

Peter didn't stutter. The Holy Spirit didn't misspeak. The Greek word "eis" means "in order to obtain."

Modern denominationalism has twisted this plain command into a mere symbol. But God's Word stands unchanged.

Your soul depends on obeying the Gospel, not redefining it.

Have you been baptized for the remission of sins? (Romans 6:3-4)`,
          hashtags: ['#BaptismForSalvation', '#ActsChapter2', '#GospelTruth', '#Scripture'],
          engagement_score: 9.1
        },
        {
          id: 2,
          content: `FALSE TEACHING ALERT: "Once saved, always saved" 

Paul warned the Galatians: "You have fallen from grace" (Galatians 5:4).

If you can't fall, why the warning? If salvation is eternal regardless of behavior, why did Paul fear for their souls?

The doctrine of eternal security contradicts:
• Hebrews 6:4-6 (falling away)
• 2 Peter 2:20-22 (returning to sin)
• 1 Corinthians 9:27 (Paul's own concern)

God's grace is conditional on faithful obedience. We can forfeit our salvation through willful sin.

Guard your heart. Work out your salvation with fear and trembling (Philippians 2:12).`,
          hashtags: ['#FalseDoctrine', '#EternalSecurity', '#BiblicalTruth', '#Salvation'],
          engagement_score: 8.8
        },
        {
          id: 3,
          content: `CONTEXT MATTERS.

"For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast" (Ephesians 2:8-9).

Denominationalism stops here. But Paul continues:

"For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them" (v. 10).

Paul isn't condemning obedience—he's condemning works of merit (earning salvation).

The "works" Paul condemns are works of the Law of Moses, not Gospel obedience.

Read the whole passage. Context saves souls from error.

Faith obeys. Always. (James 2:24)`,
          hashtags: ['#Context', '#FaithAndWorks', '#Ephesians2', '#BiblicalStudy'],
          engagement_score: 9.3
        }
      ];
    } else {
      // Original content for other tones
      sampleContent = [
        {
          id: 1,
          content: `🚀 Exciting news! We're thriving in today's digital landscape by leveraging innovative strategies that connect with our audience. Here's what we've learned:\n\n✨ Authenticity builds trust\n💡 Consistency drives engagement\n🎯 Quality over quantity always wins\n\nWhat's your secret to social media success? Share in the comments! 👇\n\n#DigitalMarketing #SocialMedia #Growth #Success`,
          hashtags: ['#DigitalMarketing', '#SocialMedia', '#Growth', '#Success'],
          engagement_score: 8.5
        },
        {
          id: 2,
          content: `Did you know that 73% of marketers believe social media marketing has been effective for their business? 📊\n\nHere are 3 game-changing tips to boost your social presence:\n\n1️⃣ Post consistently (but don't sacrifice quality)\n2️⃣ Engage with your community authentically\n3️⃣ Use data to guide your content strategy\n\nReady to level up your social game? Let's connect! 🤝\n\n#MarketingTips #SocialMediaStrategy #BusinessGrowth`,
          hashtags: ['#MarketingTips', '#SocialMediaStrategy', '#BusinessGrowth'],
          engagement_score: 9.2
        },
        {
          id: 3,
          content: `Behind every successful brand is a story worth telling. ✨\n\nYour audience doesn't just want to see your products – they want to connect with your mission, values, and the people behind the brand.\n\n💭 What's your brand story?\n🎯 How do you share it authentically?\n💪 What makes you different?\n\nStorytelling isn't just marketing – it's human connection. And that's what builds lasting relationships with your audience.\n\n#Storytelling #BrandStrategy #Authenticity #Connection`,
          hashtags: ['#Storytelling', '#BrandStrategy', '#Authenticity', '#Connection'],
          engagement_score: 7.8
        }
      ];
    }
    
    setGeneratedContent(sampleContent);
    setGenerating(false);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseContent = (content) => {
    dispatch({
      type: 'ADD_POST',
      payload: {
        content: content.content,
        platforms: [platform],
        aiGenerated: true,
        hashtags: content.hashtags.join(' '),
        engagementScore: content.engagement_score,
        brandVoice: tone
      }
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
            className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${tone === 'bible-scholar' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'} rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={tone === 'bible-scholar' ? FiBook : FiZap} className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {tone === 'bible-scholar' ? 'Biblical Content Generator' : 'AI Content Generator'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {tone === 'bible-scholar' && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  📖 <strong>Bible Scholar Mode:</strong> Content will be generated with scriptural authority, doctrinal precision, and evangelistic urgency. All posts will include relevant Bible verses and sound doctrine.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={
                      tone === 'bible-scholar'
                        ? "Describe the biblical topic or doctrine to teach..."
                        : "Describe what you want to create..."
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setContentType(type.id)}
                        className={`flex items-center justify-center p-2 rounded-lg border text-sm ${
                          contentType === type.id
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <SafeIcon icon={type.icon} className="w-4 h-4 mr-1" />
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Voice
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {tones.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.id === 'bible-scholar' ? '📖' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generateContent}
                  disabled={generating}
                  className={`w-full flex items-center justify-center px-4 py-2 ${
                    tone === 'bible-scholar'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  } text-white rounded-lg disabled:opacity-50 transition-all`}
                >
                  {generating ? (
                    <>
                      <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2 animate-spin" />
                      {tone === 'bible-scholar' ? 'Studying Scripture...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={tone === 'bible-scholar' ? FiBook : FiZap} className="w-4 h-4 mr-2" />
                      {tone === 'bible-scholar' ? 'Generate Biblical Content' : 'Generate Content'}
                    </>
                  )}
                </button>
              </div>

              {/* Generated Content */}
              <div className="lg:col-span-2">
                {generating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className={`w-16 h-16 ${
                        tone === 'bible-scholar'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      } rounded-full flex items-center justify-center mb-4 mx-auto`}>
                        <SafeIcon icon={FiRefreshCw} className="w-8 h-8 text-white animate-spin" />
                      </div>
                      <p className="text-gray-600">
                        {tone === 'bible-scholar'
                          ? 'Searching the Scriptures and preparing biblical content...'
                          : 'AI is crafting your content...'
                        }
                      </p>
                    </div>
                  </div>
                ) : generatedContent.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {tone === 'bible-scholar' ? 'Biblical Content Options' : 'Generated Content Options'}
                    </h4>
                    {generatedContent.map((content) => (
                      <motion.div
                        key={content.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              tone === 'bible-scholar'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {tone === 'bible-scholar' ? '📖 Biblical Content' : `Engagement Score: ${content.engagement_score}/10`}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(content.content)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                            >
                              <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-800 whitespace-pre-line">{content.content}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {content.hashtags.map((tag, index) => (
                              <span key={index} className={`text-xs px-2 py-1 rounded ${
                                tone === 'bible-scholar'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => handleUseContent(content)}
                            className={`px-3 py-1 text-white text-sm rounded-lg transition-colors ${
                              tone === 'bible-scholar'
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            Use This Content
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <SafeIcon icon={tone === 'bible-scholar' ? FiBook : FiZap} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {tone === 'bible-scholar' ? 'Biblical Content Generator' : 'AI Content Generator'}
                      </h4>
                      <p className="text-gray-500">
                        {tone === 'bible-scholar'
                          ? 'Configure your settings and generate biblical content with scriptural authority'
                          : 'Configure your settings and click generate to create engaging content'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default AIContentGenerator;