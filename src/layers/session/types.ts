import { EntryId } from '../entry/types';

export type SessionId = string;

export interface Session {
  id: SessionId;
  title: string;
  date: Date;
  description: string;
  tags: string[];
  entryIds: EntryId[];
  isActive: boolean;
  campaignId: string;
}

export interface SessionStats {
  totalEntries: number;
  entryTypes: Record<string, number>;
  lastModified: Date;
}

export interface SessionValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
}