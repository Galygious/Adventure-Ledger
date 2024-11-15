// src/layers/template/templates.ts
import { Template } from './types';

export const templates: Record<string, Template> = {
  campaign: {
    id: 'campaign',
    name: 'Campaign',
    description: 'Create a new campaign or adventure',
    moduleIds: ['identity', 'settings', 'notes'],
    icon: 'Book',
    category: 'campaign',
    defaultValues: {
      identity: {
        name: '',
        description: '',
        tags: []
      },
      settings: {
        worldName: '',
        startDate: new Date(),
        theme: ''
      },
      notes: {
        content: '',
        tags: []
      }
    }
  }
};
