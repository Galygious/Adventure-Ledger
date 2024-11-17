import { useState, useCallback } from 'react';
import { Session, SessionId, SessionStats } from '../types';
import { Entry } from '../../entry/types';
import { useEntry } from '../../entry/hooks/useEntry';

interface UseSessionResult {
  session: Session | null;
  entries: Entry[];
  stats: SessionStats;
  isValid: boolean;
  addEntry: (entryId: string) => void;
  removeEntry: (entryId: string) => void;
  updateSession: (updates: Partial<Session>) => void;
  getSessionStats: () => SessionStats;
}

export function useSession(sessionId: SessionId | null): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  const addEntry = useCallback((entryId: string) => {
    if (!session) return;

    setSession(prev => ({
      ...prev!,
      entryIds: [...prev!.entryIds, entryId]
    }));
  }, [session]);

  const removeEntry = useCallback((entryId: string) => {
    if (!session) return;

    setSession(prev => ({
      ...prev!,
      entryIds: prev!.entryIds.filter(id => id !== entryId)
    }));
  }, [session]);

  const updateSession = useCallback((updates: Partial<Session>) => {
    if (!session) return;

    setSession(prev => ({
      ...prev!,
      ...updates
    }));
  }, [session]);

  const getSessionStats = useCallback((): SessionStats => {
    if (!entries.length) {
      return {
        totalEntries: 0,
        entryTypes: {},
        lastModified: new Date()
      };
    }

    const entryTypes = entries.reduce((acc, entry) => ({
      ...acc,
      [entry.templateId]: (acc[entry.templateId] || 0) + 1
    }), {} as Record<string, number>);

    const lastModified = new Date(
      Math.max(...entries.map(entry => new Date(entry.updated).getTime()))
    );

    return {
      totalEntries: entries.length,
      entryTypes,
      lastModified
    };
  }, [entries]);

  return {
    session,
    entries,
    stats: getSessionStats(),
    isValid: !!session && session.title.length > 0,
    addEntry,
    removeEntry,
    updateSession,
    getSessionStats
  };
}