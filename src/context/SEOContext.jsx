import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SEOContext = createContext();

const initialState = {
  clients: [],
  projects: [],
  keywords: [],
  rankings: [],
  analytics: {},
  margins: {
    targetMargin: 30, // Default 30% margin
    strategies: {
      0: { name: 'Basic Package', description: 'Essential SEO audit and optimization' },
      15: { name: 'Growth Package', description: 'Comprehensive SEO with content strategy' },
      30: { name: 'Premium Package', description: 'Full-service SEO with AI optimization' },
      45: { name: 'Enterprise Package', description: 'Advanced multi-platform dominance' },
      60: { name: 'Elite Package', description: 'AI-driven market domination strategy' },
      75: { name: 'Platinum Package', description: 'Complete digital ecosystem control' },
      90: { name: 'Diamond Package', description: 'Revolutionary AI-powered SEO leadership' }
    }
  },
  roiData: {
    current30Days: 0,
    previous30Days: 0,
    growthRate: 0,
    improvements: []
  },
  loading: false,
  error: null
};

function seoReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'UPDATE_MARGIN_TARGET':
      return {
        ...state,
        margins: { ...state.margins, targetMargin: action.payload }
      };
    
    case 'UPDATE_ROI_DATA':
      return {
        ...state,
        roiData: { ...state.roiData, ...action.payload }
      };
    
    case 'ADD_CLIENT':
      const newClient = { ...action.payload, id: Date.now().toString() };
      const updatedClients = [...state.clients, newClient];
      localStorage.setItem('seo_clients', JSON.stringify(updatedClients));
      return { ...state, clients: updatedClients };
    
    case 'UPDATE_CLIENT':
      const updatedClientsList = state.clients.map(client =>
        client.id === action.payload.id ? action.payload : client
      );
      localStorage.setItem('seo_clients', JSON.stringify(updatedClientsList));
      return { ...state, clients: updatedClientsList };
    
    case 'DELETE_CLIENT':
      const filteredClients = state.clients.filter(client => client.id !== action.payload);
      localStorage.setItem('seo_clients', JSON.stringify(filteredClients));
      return { ...state, clients: filteredClients };
    
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload, loading: false };
    
    case 'ADD_KEYWORD':
      const newKeyword = { ...action.payload, id: Date.now().toString() };
      const updatedKeywords = [...state.keywords, newKeyword];
      localStorage.setItem('seo_keywords', JSON.stringify(updatedKeywords));
      return { ...state, keywords: updatedKeywords };
    
    case 'SET_KEYWORDS':
      return { ...state, keywords: action.payload };
    
    case 'UPDATE_RANKINGS':
      localStorage.setItem('seo_rankings', JSON.stringify(action.payload));
      return { ...state, rankings: action.payload };
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    
    default:
      return state;
  }
}

export function SEOProvider({ children }) {
  const [state, dispatch] = useReducer(seoReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on app start
    const savedClients = localStorage.getItem('seo_clients');
    const savedKeywords = localStorage.getItem('seo_keywords');
    const savedRankings = localStorage.getItem('seo_rankings');
    const savedMargins = localStorage.getItem('seo_margins');

    if (savedClients) {
      dispatch({ type: 'SET_CLIENTS', payload: JSON.parse(savedClients) });
    } else {
      dispatch({ type: 'SET_CLIENTS', payload: [] });
    }

    if (savedKeywords) {
      dispatch({ type: 'SET_KEYWORDS', payload: JSON.parse(savedKeywords) });
    }

    if (savedRankings) {
      dispatch({ type: 'UPDATE_RANKINGS', payload: JSON.parse(savedRankings) });
    }

    if (savedMargins) {
      const margins = JSON.parse(savedMargins);
      dispatch({ type: 'UPDATE_MARGIN_TARGET', payload: margins.targetMargin });
    }

    // Simulate ROI data calculation
    calculateROI();
  }, []);

  const calculateROI = () => {
    // Simulate ROI calculation based on client data and performance
    const current30Days = Math.floor(Math.random() * 100000) + 50000;
    const previous30Days = Math.floor(Math.random() * 80000) + 40000;
    const growthRate = ((current30Days - previous30Days) / previous30Days) * 100;

    const improvements = [
      'Optimize page load speed for better Core Web Vitals',
      'Implement schema markup for rich snippets',
      'Create pillar content for target keywords',
      'Build high-quality backlinks from industry sites',
      'Improve local citations and GMB optimization'
    ];

    dispatch({
      type: 'UPDATE_ROI_DATA',
      payload: {
        current30Days,
        previous30Days,
        growthRate,
        improvements
      }
    });
  };

  return (
    <SEOContext.Provider value={{ state, dispatch, calculateROI }}>
      {children}
    </SEOContext.Provider>
  );
}

export function useSEO() {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
}