import { SessionId } from '../session/types';

export type CampaignId = string;

export interface Campaign {
  id: CampaignId;
  title: string;
  description: string;
  created: Date;
  updated: Date;
  tags: string[];
  sessionIds: SessionId[];
  isActive: boolean;
  settings: {
    theme?: string;
    worldName?: string;
    startDate?: Date;
  };
}

export interface CampaignStats {
  totalSessions: number;
  totalEntries: number;
  entryTypeBreakdown: Record<string, number>;
  lastPlayed: Date | null;
  nextSession: Date | null;
}

export interface CampaignValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
}