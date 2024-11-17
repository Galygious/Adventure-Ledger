import { useState, useCallback } from 'react';
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

  const setActiveCampaign = useCallback((campaignId: string | null) => {
    setState(prev => {
      const newState = {
        ...prev,
        activeCampaignId: campaignId,
        activeSessionId: null,
        activeEntryId: null,
        view: campaignId ? 'sessions' : 'campaigns'
      };
      localStorage.setItem('appState', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const setActiveSession = useCallback((sessionId: string | null) => {
    setState(prev => {
      const newState = {
        ...prev,
        activeSessionId: sessionId,
        activeEntryId: null,
        view: sessionId ? 'entries' : 'sessions'
      };
      localStorage.setItem('appState', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const handleBack = useCallback(() => {
    setState(prev => {
      let newState;
      if (prev.view === 'entries') {
        newState = {
          ...prev,
          activeSessionId: null,
          view: 'sessions'
        };
      } else if (prev.view === 'sessions') {
        newState = {
          ...prev,
          activeCampaignId: null,
          view: 'campaigns'
        };
      } else {
        return prev;
      }
      localStorage.setItem('appState', JSON.stringify(newState));
      return newState;
    });
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

  // Save state changes to localStorage
  const saveState = useCallback(() => {
    localStorage.setItem('appState', JSON.stringify(state));
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
    localStorage.setItem('sessions', JSON.stringify(sessions));
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [state, campaigns, sessions, entries]);

  // Computed values
  const activeCampaign = campaigns.find(c => c.id === state.activeCampaignId);
  const activeSession = sessions.find(s => s.id === state.activeSessionId);
  const campaignSessions = sessions.filter(s => s.campaignId === state.activeCampaignId);

  const stats: AppStats = {
    totalCampaigns: campaigns.length,
    totalSessions: sessions.length,
    totalEntries: entries.length,
    recentActivity: []
  };

  return {
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
}