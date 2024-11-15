// src/layers/module/components/ModuleForm.tsx
import React from 'react';
import { ModuleId } from '../types';
import { useModule } from '../hooks/useModule';
import PropertyInput from '../../property/components/PropertyInput';

interface ModuleFormProps {
  moduleId: ModuleId;
  values?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
}

export default function ModuleForm({ moduleId, values = {}, onChange }: ModuleFormProps) {
  const { module } = useModule(moduleId);

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-2">
        <h3 className="text-lg font-medium text-gray-900">{module.label}</h3>
        {module.description && (
          <p className="text-sm text-gray-500 mt-1">{module.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {module.properties.map(property => (
          <PropertyInput
            key={`${moduleId}-${property.id}`}
            property={property}
            value={values[property.id]}
            onChange={value => onChange?.({
              ...values,
              [property.id]: value
            })}
          />
        ))}
      </div>
    </div>
  );
}
