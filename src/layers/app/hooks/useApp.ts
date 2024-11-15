import { useState, useCallback, useEffect } from 'react';
import { AppState, AppStats } from '../types';
import { Campaign } from '../../campaign/types';
import { Session } from '../../session/types';
import { Entry } from '../../entry/types';

const initialState: AppState = {
  theme: 'light',
  view: 'campaigns',
  activeCampaignId: null,
  activeSessionId: null,
  activeEntryId: null,
  isLoading: false,
  error: null,
};

export function useApp() {
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('appState');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const savedCampaigns = localStorage.getItem('campaigns');
    return savedCampaigns ? JSON.parse(savedCampaigns) : [];
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem('sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  const [entries, setEntries] = useState<Entry[]>(() => {
    const savedEntries = localStorage.getItem('entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  // Theme management
  const setTheme = useCallback((theme: AppState['theme']) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  // View management
  const setView = useCallback((view: AppState['view']) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  // Campaign management
  const setActiveCampaign = useCallback((campaignId: string | null) => {
    setState(prev => ({
      ...prev,
      activeCampaignId: campaignId,
      activeSessionId: null,
      activeEntryId: null,
      view: campaignId ? 'sessions' : 'campaigns'
    }));
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

    setCampaigns(prev => [...prev, newCampaign]);
    setActiveCampaign(newCampaign.id);
  }, [setActiveCampaign]);

  // Session management
  const setActiveSession = useCallback((sessionId: string | null) => {
    setState(prev => ({
      ...prev,
      activeSessionId: sessionId,
      activeEntryId: null,
      view: sessionId ? 'entries' : 'sessions'
    }));
  }, []);

  // Entry management
  const setActiveEntry = useCallback((entryId: string | null) => {
    setState(prev => ({
      ...prev,
      activeEntryId: entryId
    }));
  }, []);

  // Get active items
  const activeCampaign = campaigns.find(c => c.id === state.activeCampaignId);
  const activeSession = sessions.find(s => s.id === state.activeSessionId);
  const activeEntry = entries.find(e => e.id === state.activeEntryId);

  // Calculate stats
  const stats: AppStats = {
    totalCampaigns: campaigns.length,
    totalSessions: sessions.length,
    totalEntries: entries.length,
    recentActivity: [], // Implement activity tracking if needed
  };

  return {
    state,
    campaigns,
    sessions,
    entries,
    stats,
    activeCampaign,
    activeSession,
    activeEntry,
    setTheme,
    setView,
    setActiveCampaign,
    setActiveSession,
    setActiveEntry,
    createCampaign,
    setCampaigns,
    setSessions,
    setEntries
  };
}