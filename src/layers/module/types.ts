import { Property, PropertyId } from '../property/types';

export type ModuleId = string;

export interface Module {
  id: ModuleId;
  label: string;
  description?: string;
  properties: Property[];
  required?: boolean;
}

// Common modules used across different templates
export interface IdentityModule extends Module {
  id: 'identity';
  properties: [
    Property & { id: 'name'; type: 'text'; required: true },
    Property & { id: 'aliases'; type: 'tags' },
    Property & { id: 'description'; type: 'text'; multiline: true }
  ];
}

export interface LocationModule extends Module {
  id: 'location';
  properties: [
    Property & { id: 'region'; type: 'text' },
    Property & { id: 'settlement'; type: 'text' },
    Property & { id: 'specificLocation'; type: 'text' }
  ];
}

export interface StatsModule extends Module {
  id: 'stats';
  properties: [
    Property & { id: 'level'; type: 'number'; min: 1 },
    Property & { id: 'hitPoints'; type: 'number'; min: 0 },
    Property & { id: 'armorClass'; type: 'number'; min: 0 }
  ];
}

export interface NotesModule extends Module {
  id: 'notes';
  properties: [
    Property & { id: 'content'; type: 'text'; multiline: true },
    Property & { id: 'tags'; type: 'tags' }
  ];
}