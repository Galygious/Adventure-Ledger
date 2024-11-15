import { useState, useCallback } from 'react';
import { Campaign, CampaignId, CampaignStats } from '../types';
import { Session } from '../../session/types';
import { useSession } from '../../session/hooks/useSession';

interface UseCampaignResult {
  campaign: Campaign | null;
  sessions: Session[];
  stats: CampaignStats;
  isValid: boolean;
  addSession: (sessionId: string) => void;
  removeSession: (sessionId: string) => void;
  updateCampaign: (updates: Partial<Campaign>) => void;
  getCampaignStats: () => CampaignStats;
}

export function useCampaign(campaignId: CampaignId | null): UseCampaignResult {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = useCallback((sessionId: string) => {
    if (!campaign) return;

    setCampaign(prev => ({
      ...prev!,
      sessionIds: [...prev!.sessionIds, sessionId],
      updated: new Date()
    }));
  }, [campaign]);

  const removeSession = useCallback((sessionId: string) => {
    if (!campaign) return;

    setCampaign(prev => ({
      ...prev!,
      sessionIds: prev!.sessionIds.filter(id => id !== sessionId),
      updated: new Date()
    }));
  }, [campaign]);

  const updateCampaign = useCallback((updates: Partial<Campaign>) => {
    if (!campaign) return;

    setCampaign(prev => ({
      ...prev!,
      ...updates,
      updated: new Date()
    }));
  }, [campaign]);

  const getCampaignStats = useCallback((): CampaignStats => {
    if (!sessions.length) {
      return {
        totalSessions: 0,
        totalEntries: 0,
        entryTypeBreakdown: {},
        lastPlayed: null,
        nextSession: null
      };
    }

    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const now = new Date();
    const lastPlayed = sortedSessions.find(s => new Date(s.date) <= now)?.date || null;
    const nextSession = sortedSessions.find(s => new Date(s.date) > now)?.date || null;

    return {
      totalSessions: sessions.length,
      totalEntries: sessions.reduce((acc, session) => acc + session.entryIds.length, 0),
      entryTypeBreakdown: {},
      lastPlayed,
      nextSession
    };
  }, [sessions]);

  return {
    campaign,
    sessions,
    stats: getCampaignStats(),
    isValid: !!campaign && campaign.title.length > 0,
    addSession,
    removeSession,
    updateCampaign,
    getCampaignStats
  };
}