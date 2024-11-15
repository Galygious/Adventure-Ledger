// src/layers/template/hooks/useTemplate.ts
import { useState, useCallback } from 'react';
import { TemplateId } from '../types';
import { templates } from '../templates';
import { useModule } from '../../module/hooks/useModule';

export function useTemplate(templateId: TemplateId) {
  const template = templates[templateId];
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  // Initialize values based on template.defaultValues
  const [values, setValues] = useState(() => ({
    ...template.defaultValues
  }));

  const validate = useCallback(() => {
    let isValid = true;
    template.moduleIds.forEach(moduleId => {
      const module = useModule(moduleId); // Correctly called at top level
      if (module.validate) {
        isValid = isValid && module.validate(values[moduleId]);
      }
    });
    return isValid;
  }, [template.moduleIds, values]);

  const updateValues = useCallback((moduleId: string, newValues: any) => {
    setValues(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        ...newValues
      }
    }));
  }, []);

  return {
    template,
    values,
    validate,
    updateValues
  };
}
