import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CRMContext = createContext();

const initialState = {
  contacts: [],
  interactions: [],
  loading: false,
  error: null
};

function crmReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload, loading: false };
    
    case 'ADD_CONTACT':
      const newContact = { ...action.payload, id: Date.now().toString() };
      const updatedContacts = [...state.contacts, newContact];
      localStorage.setItem('crm_contacts', JSON.stringify(updatedContacts));
      return { ...state, contacts: updatedContacts };
    
    case 'UPDATE_CONTACT':
      const updatedContactsList = state.contacts.map(contact =>
        contact.id === action.payload.id ? action.payload : contact
      );
      localStorage.setItem('crm_contacts', JSON.stringify(updatedContactsList));
      return { ...state, contacts: updatedContactsList };
    
    case 'DELETE_CONTACT':
      const filteredContacts = state.contacts.filter(contact => contact.id !== action.payload);
      localStorage.setItem('crm_contacts', JSON.stringify(filteredContacts));
      return { ...state, contacts: filteredContacts };
    
    case 'SET_INTERACTIONS':
      return { ...state, interactions: action.payload, loading: false };
    
    case 'ADD_INTERACTION':
      const newInteraction = { ...action.payload, id: Date.now().toString(), date: new Date().toISOString() };
      const updatedInteractions = [...state.interactions, newInteraction];
      localStorage.setItem('crm_interactions', JSON.stringify(updatedInteractions));
      return { ...state, interactions: updatedInteractions };
    
    case 'DELETE_INTERACTION':
      const filteredInteractions = state.interactions.filter(interaction => interaction.id !== action.payload);
      localStorage.setItem('crm_interactions', JSON.stringify(filteredInteractions));
      return { ...state, interactions: filteredInteractions };
    
    default:
      return state;
  }
}

export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on app start
    const savedContacts = localStorage.getItem('crm_contacts');
    const savedInteractions = localStorage.getItem('crm_interactions');
    
    if (savedContacts) {
      dispatch({ type: 'SET_CONTACTS', payload: JSON.parse(savedContacts) });
    } else {
      dispatch({ type: 'SET_CONTACTS', payload: [] });
    }
    
    if (savedInteractions) {
      dispatch({ type: 'SET_INTERACTIONS', payload: JSON.parse(savedInteractions) });
    } else {
      dispatch({ type: 'SET_INTERACTIONS', payload: [] });
    }
  }, []);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}