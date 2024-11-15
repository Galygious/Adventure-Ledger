export type EntryType = 'npc' | 'location' | 'quest' | 'item' | 'note';

export interface Entry {
  id: string;
  title: string;
  content: string;
  type: EntryType;
  created: Date;
  updated: Date;
  starred: boolean;
  isGlobal: boolean;
  sessionIds: string[];
  tags: string[];
}

export interface Session {
  id: string;
  title: string;
  date: Date;
  description: string;
  tags: string[];
  isActive: boolean;
}