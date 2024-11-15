// src/layers/template/components/TemplateForm.tsx
import React from 'react';
import { TemplateId } from '../types';
import ModuleForm from '../../module/components/ModuleForm';
import { useTemplate } from '../hooks/useTemplate';

interface TemplateFormProps {
  templateId: TemplateId;
  values?: Record<string, any>;
  onChange?: (moduleId: string, values: any) => void;
}

export default function TemplateForm({ templateId, values = {}, onChange }: TemplateFormProps) {
  const { template, values: templateValues, validate } = useTemplate(templateId);

  return (
    <div className="space-y-6">
      {template.moduleIds.map(moduleId => (
        <ModuleForm
          key={moduleId}
          moduleId={moduleId}
          values={templateValues[moduleId] || {}}
          onChange={newValues => onChange?.(moduleId, newValues)}
        />
      ))}
    </div>
  );
}
