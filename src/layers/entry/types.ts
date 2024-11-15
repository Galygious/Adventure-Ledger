import { TemplateId } from '../template/types';

export type EntryId = string;

export interface Entry {
  id: EntryId;
  templateId: TemplateId;
  values: Record<string, any>;
  created: Date;
  updated: Date;
  isGlobal: boolean;
  sessionIds: string[];
  starred: boolean;
}

export interface EntryValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
}