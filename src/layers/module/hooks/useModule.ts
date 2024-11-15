// src/layers/module/hooks/useModule.ts
import { useState, useCallback } from 'react';
import { ModuleId } from '../types';
import { standardModules } from '../modules';

export function useModule(moduleId: ModuleId) {
  const module = standardModules[moduleId];
  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }

  const [values, setValues] = useState(() => {
    const initialValues: Record<string, any> = {};
    module.properties.forEach(prop => {
      initialValues[prop.id] = prop.defaultValue;
    });
    return initialValues;
  });

  const validate = useCallback(() => {
    let isValid = true;
    module.properties.forEach(prop => {
      if (prop.required && !values[prop.id]) {
        isValid = false;
      }
      if (prop.validation && !prop.validation(values[prop.id])) {
        isValid = false;
      }
    });
    return isValid;
  }, [module.properties, values]);

  const updateValue = useCallback((propertyId: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [propertyId]: value
    }));
  }, []);

  return {
    module,
    values,
    validate,
    updateValue,
    // Removed 'initialValues' as it's not defined in modules.ts
  };
}
