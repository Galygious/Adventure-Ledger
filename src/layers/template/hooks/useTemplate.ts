import { useState, useCallback, useMemo } from 'react';
import { TemplateId } from '../types';
import { templates } from '../templates';
import { standardModules } from '../../module';

export function useTemplate(templateId: TemplateId) {
  const template = templates[templateId];
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const initialValues = useMemo(() => {
    const values: Record<string, any> = {};
    template.moduleIds.forEach(moduleId => {
      const module = standardModules[moduleId];
      if (!module) return;
      
      const moduleValues: Record<string, any> = {};
      module.properties.forEach(prop => {
        moduleValues[prop.id] = prop.defaultValue;
      });
      values[moduleId] = moduleValues;
    });
    return values;
  }, [template.moduleIds]);

  const [values, setValues] = useState(initialValues);

  const validate = useCallback(() => {
    return template.moduleIds.every(moduleId => {
      const module = standardModules[moduleId];
      if (!module) return false;

      return module.properties.every(prop => {
        if (prop.required && !values[moduleId]?.[prop.id]) {
          return false;
        }
        if (prop.validation && !prop.validation(values[moduleId]?.[prop.id])) {
          return false;
        }
        return true;
      });
    });
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