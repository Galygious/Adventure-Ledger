import React from 'react';
import { Entry } from '../types';
import { templates } from '../../template/templates';
import { standardModules } from '../../module/modules';

interface EntryViewProps {
  entry: Entry;
}

export default function EntryView({ entry }: EntryViewProps) {
  const template = templates[entry.templateId];

  const renderModuleValue = (moduleId: string) => {
    const module = standardModules[moduleId];
    const values = entry.values[moduleId] || {};

    return (
      <div key={moduleId} className="space-y-2">
        <h4 className="font-medium text-gray-700">{module.label}</h4>
        <div className="space-y-1">
          {module.properties.map(property => (
            <div key={property.id}>
              <dt className="text-sm text-gray-500">{property.label}</dt>
              <dd className="text-sm text-gray-900">
                {property.type === 'tags' 
                  ? (values[property.id] as string[])?.join(', ') || '-'
                  : values[property.id]?.toString() || '-'}
              </dd>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {entry.values.identity?.name || 'Unnamed Entry'}
        </h3>
        <p className="text-sm text-gray-500">
          {template.name} • Last updated {entry.updated.toLocaleString()}
        </p>
      </div>

      <div className="space-y-6">
        {template.moduleIds.map(renderModuleValue)}
      </div>
    </div>
  );
}