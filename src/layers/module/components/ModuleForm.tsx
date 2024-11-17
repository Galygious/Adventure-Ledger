import React, { memo } from 'react';
import { ModuleId } from '../types';
import { standardModules } from '../index';
import PropertyInput from '../../property/components/PropertyInput';

interface ModuleFormProps {
  moduleId: ModuleId;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

const ModuleForm = memo(function ModuleForm({ moduleId, values, onChange }: ModuleFormProps) {
  const module = standardModules[moduleId];
  if (!module) return null;

  const handlePropertyChange = (propertyId: string, value: any) => {
    onChange({
      ...values,
      [propertyId]: value
    });
  };

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
            key={property.id}
            property={property}
            value={values[property.id] ?? property.defaultValue}
            onChange={value => handlePropertyChange(property.id, value)}
          />
        ))}
      </div>
    </div>
  );
});

export default ModuleForm;