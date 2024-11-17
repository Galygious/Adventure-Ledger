import { Module } from './types';

export const standardModules: Record<string, Module> = {
  identity: {
    id: 'identity',
    label: 'Basic Information',
    description: 'Basic identifying information',
    properties: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: '',
        required: true
      },
      {
        id: 'aliases',
        type: 'tags',
        label: 'Aliases',
        defaultValue: [],
        required: false
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        defaultValue: '',
        multiline: true,
        required: false
      }
    ]
  },

  settings: {
    id: 'settings',
    label: 'Campaign Settings',
    description: 'Configure campaign-specific settings',
    properties: [
      {
        id: 'worldName',
        type: 'text',
        label: 'World Name',
        defaultValue: '',
        required: true
      },
      {
        id: 'startDate',
        type: 'date',
        label: 'Campaign Start Date',
        defaultValue: new Date().toISOString().split('T')[0],
        required: true
      },
      {
        id: 'theme',
        type: 'text',
        label: 'Campaign Theme',
        defaultValue: '',
        multiline: true,
        required: false
      }
    ]
  },

  notes: {
    id: 'notes',
    label: 'Notes',
    description: 'Additional notes and information',
    properties: [
      {
        id: 'content',
        type: 'text',
        label: 'Content',
        defaultValue: '',
        multiline: true,
        required: false
      },
      {
        id: 'tags',
        type: 'tags',
        label: 'Tags',
        defaultValue: [],
        required: false
      }
    ]
  }
};