import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SocialMediaContext = createContext();

const initialState = {
  posts: [],
  scheduledPosts: [],
  socialAccounts: [],
  aiSettings: {
    apiKey: '',
    brandVoice: 'professional',
    postingFrequency: 'daily',
    autoGenerate: false,
    contentThemes: []
  },
  analytics: {
    totalPosts: 0,
    totalEngagement: 0,
    topPerformingPost: null
  },
  loading: false,
  error: null
};

function socialMediaReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_POSTS':
      localStorage.setItem('sm_posts', JSON.stringify(action.payload));
      return { ...state, posts: action.payload, loading: false };
    
    case 'ADD_POST':
      const newPost = { ...action.payload, id: Date.now().toString(), createdAt: new Date().toISOString() };
      const updatedPosts = [...state.posts, newPost];
      localStorage.setItem('sm_posts', JSON.stringify(updatedPosts));
      return { ...state, posts: updatedPosts };
    
    case 'UPDATE_POST':
      const updatedPostsList = state.posts.map(post =>
        post.id === action.payload.id ? action.payload : post
      );
      localStorage.setItem('sm_posts', JSON.stringify(updatedPostsList));
      return { ...state, posts: updatedPostsList };
    
    case 'DELETE_POST':
      const filteredPosts = state.posts.filter(post => post.id !== action.payload);
      localStorage.setItem('sm_posts', JSON.stringify(filteredPosts));
      return { ...state, posts: filteredPosts };
    
    case 'SET_SCHEDULED_POSTS':
      localStorage.setItem('sm_scheduled_posts', JSON.stringify(action.payload));
      return { ...state, scheduledPosts: action.payload };
    
    case 'ADD_SCHEDULED_POST':
      const newScheduledPost = { ...action.payload, id: Date.now().toString() };
      const updatedScheduled = [...state.scheduledPosts, newScheduledPost];
      localStorage.setItem('sm_scheduled_posts', JSON.stringify(updatedScheduled));
      return { ...state, scheduledPosts: updatedScheduled };
    
    case 'SET_SOCIAL_ACCOUNTS':
      localStorage.setItem('sm_accounts', JSON.stringify(action.payload));
      return { ...state, socialAccounts: action.payload };
    
    case 'ADD_SOCIAL_ACCOUNT':
      const newAccount = { ...action.payload, id: Date.now().toString() };
      const updatedAccounts = [...state.socialAccounts, newAccount];
      localStorage.setItem('sm_accounts', JSON.stringify(updatedAccounts));
      return { ...state, socialAccounts: updatedAccounts };
    
    case 'UPDATE_AI_SETTINGS':
      const updatedSettings = { ...state.aiSettings, ...action.payload };
      localStorage.setItem('sm_ai_settings', JSON.stringify(updatedSettings));
      return { ...state, aiSettings: updatedSettings };
    
    case 'GENERATE_AI_CONTENT':
      return { ...state, loading: false, aiGeneratedContent: action.payload };
    
    default:
      return state;
  }
}

export function SocialMediaProvider({ children }) {
  const [state, dispatch] = useReducer(socialMediaReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on app start
    const savedPosts = localStorage.getItem('sm_posts');
    const savedScheduled = localStorage.getItem('sm_scheduled_posts');
    const savedAccounts = localStorage.getItem('sm_accounts');
    const savedAISettings = localStorage.getItem('sm_ai_settings');
    
    if (savedPosts) {
      dispatch({ type: 'SET_POSTS', payload: JSON.parse(savedPosts) });
    } else {
      dispatch({ type: 'SET_POSTS', payload: [] });
    }
    
    if (savedScheduled) {
      dispatch({ type: 'SET_SCHEDULED_POSTS', payload: JSON.parse(savedScheduled) });
    } else {
      dispatch({ type: 'SET_SCHEDULED_POSTS', payload: [] });
    }
    
    if (savedAccounts) {
      dispatch({ type: 'SET_SOCIAL_ACCOUNTS', payload: JSON.parse(savedAccounts) });
    } else {
      dispatch({ type: 'SET_SOCIAL_ACCOUNTS', payload: [] });
    }
    
    if (savedAISettings) {
      dispatch({ type: 'UPDATE_AI_SETTINGS', payload: JSON.parse(savedAISettings) });
    }
  }, []);

  return (
    <SocialMediaContext.Provider value={{ state, dispatch }}>
      {children}
    </SocialMediaContext.Provider>
  );
}

export function useSocialMedia() {
  const context = useContext(SocialMediaContext);
  if (!context) {
    throw new Error('useSocialMedia must be used within a SocialMediaProvider');
  }
  return context;
}