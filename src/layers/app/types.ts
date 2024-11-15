import { Campaign } from '../campaign/types';
import { Session } from '../session/types';
import { Entry } from '../entry/types';

export interface AppState {
  theme: 'light' | 'dark' | 'system';
  view: 'campaigns' | 'sessions' | 'entries';
  activeCampaignId: string | null;
  activeSessionId: string | null;
  activeEntryId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppStats {
  totalCampaigns: number;
  totalSessions: number;
  totalEntries: number;
  recentActivity: {
    type: 'campaign' | 'session' | 'entry';
    id: string;
    action: 'created' | 'updated' | 'deleted';
    timestamp: Date;
  }[];
}

export interface AppContext {
  state: AppState;
  campaigns: Campaign[];
  sessions: Session[];
  entries: Entry[];
  stats: AppStats;
}