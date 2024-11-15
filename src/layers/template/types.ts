import { ModuleId } from '../module/types';

export type TemplateId = string;

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  moduleIds: ModuleId[];
  icon: string; // Lucide icon name
  category: 'character' | 'location' | 'item' | 'quest' | 'note';
  defaultValues?: Record<string, any>;
}

export interface TemplateValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export type TemplateRegistry = Record<TemplateId, Template>;