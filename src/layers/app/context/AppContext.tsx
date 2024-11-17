import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AppState, AppStats } from '../types';
import { Campaign } from '../../campaign/types';
import { Session } from '../../session/types';
import { Entry } from '../../entry/types';

interface AppContextType {
  state: AppState;
  campaigns: Campaign[];
  sessions: Session[];
  entries: Entry[];
  stats: AppStats;
  activeCampaign: Campaign | null;
  activeSession: Session | null;
  setActiveCampaign: (campaignId: string | null) => void;
  setActiveSession: (sessionId: string | null) => void;
  createCampaign: (campaignData: Partial<Campaign>) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  setSessions: (sessions: Session[]) => void;
  setEntries: (entries: Entry[]) => void;
  handleBack: () => void;
  saveState: () => void;
}

const initialState: AppState = {
  theme: 'light',
  view: 'campaigns',
  activeCampaignId: null,
  activeSessionId: null,
  activeEntryId: null,
  isLoading: false,
  error: null,
};

type AppAction =
  | { type: 'SET_ACTIVE_CAMPAIGN'; payload: string | null }
  | { type: 'SET_ACTIVE_SESSION'; payload: string | null }
  | { type: 'SET_VIEW'; payload: 'campaigns' | 'sessions' | 'entries' }
  | { type: 'HANDLE_BACK' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' };

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_CAMPAIGN':
      return {
        ...state,
        activeCampaignId: action.payload,
        activeSessionId: null,
        activeEntryId: null,
        view: action.payload ? 'sessions' : 'campaigns'
      };
    
    case 'SET_ACTIVE_SESSION':
      return {
        ...state,
        activeSessionId: action.payload,
        activeEntryId: null,
        view: action.payload ? 'entries' : 'sessions'
      };
    
    case 'SET_VIEW':
      return {
        ...state,
        view: action.payload
      };
    
    case 'HANDLE_BACK':
      if (state.view === 'entries') {
        return {
          ...state,
          activeSessionId: null,
          view: 'sessions'
        };
      } else if (state.view === 'sessions') {
        return {
          ...state,
          activeCampaignId: null,
          view: 'campaigns'
        };
      }
      return state;
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [entries, setEntries] = React.useState<Entry[]>([]);

  const activeCampaign = React.useMemo(() => 
    campaigns.find(c => c.id === state.activeCampaignId) || null,
    [campaigns, state.activeCampaignId]
  );

  const activeSession = React.useMemo(() => 
    sessions.find(s => s.id === state.activeSessionId) || null,
    [sessions, state.activeSessionId]
  );

  const campaignSessions = React.useMemo(() => 
    sessions.filter(s => s.campaignId === state.activeCampaignId),
    [sessions, state.activeCampaignId]
  );

  const stats: AppStats = React.useMemo(() => ({
    totalCampaigns: campaigns.length,
    totalSessions: sessions.length,
    totalEntries: entries.length,
    recentActivity: []
  }), [campaigns.length, sessions.length, entries.length]);

  const setActiveCampaign = useCallback((campaignId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CAMPAIGN', payload: campaignId });
  }, []);

  const setActiveSession = useCallback((sessionId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_SESSION', payload: sessionId });
  }, []);

  const createCampaign = useCallback((campaignData: Partial<Campaign>) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      title: campaignData.title || '',
      description: campaignData.description || '',
      created: new Date(),
      updated: new Date(),
      tags: campaignData.tags || [],
      sessionIds: [],
      isActive: true,
      settings: {
        worldName: campaignData.settings?.worldName || '',
        startDate: campaignData.settings?.startDate || new Date(),
        theme: campaignData.settings?.theme || ''
      }
    };

    setCampaigns(prev => {
      const newCampaigns = [...prev, newCampaign];
      localStorage.setItem('campaigns', JSON.stringify(newCampaigns));
      return newCampaigns;
    });
    setActiveCampaign(newCampaign.id);
  }, [setActiveCampaign]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'HANDLE_BACK' });
  }, []);

  const saveState = useCallback(() => {
    localStorage.setItem('appState', JSON.stringify(state));
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
    localStorage.setItem('sessions', JSON.stringify(sessions));
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [state, campaigns, sessions, entries]);

  // Load initial state from localStorage
  React.useEffect(() => {
    const savedState = localStorage.getItem('appState');
    const savedCampaigns = localStorage.getItem('campaigns');
    const savedSessions = localStorage.getItem('sessions');
    const savedEntries = localStorage.getItem('entries');

    if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
  }, []);

  const value = {
    state,
    campaigns,
    sessions: campaignSessions,
    entries,
    stats,
    activeCampaign,
    activeSession,
    setActiveCampaign,
    setActiveSession,
    createCampaign,
    setCampaigns,
    setSessions,
    setEntries,
    handleBack,
    saveState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}