import { useCallback } from 'react';
import { ModuleId } from '../types';
import { standardModules } from '../index';

export function useModule(moduleId: ModuleId) {
  const module = standardModules[moduleId];
  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }

  const validate = useCallback((values: Record<string, any>) => {
    return module.properties.every(prop => {
      if (prop.required && !values[prop.id]) {
        return false;
      }
      if (prop.validation && !prop.validation(values[prop.id])) {
        return false;
      }
      return true;
    });
  }, [module]);

  return {
    module,
    validate
  };
}