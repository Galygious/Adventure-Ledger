import React, { memo } from 'react';
import { TemplateId } from '../types';
import ModuleForm from '../../module/components/ModuleForm';
import { templates } from '../templates';

interface TemplateFormProps {
  templateId: TemplateId;
  values: Record<string, any>;
  onChange: (moduleId: string, values: any) => void;
}

const TemplateForm = memo(function TemplateForm({ templateId, values, onChange }: TemplateFormProps) {
  const template = templates[templateId];
  if (!template) return null;

  return (
    <div className="space-y-6">
      {template.moduleIds.map(moduleId => (
        <ModuleForm
          key={moduleId}
          moduleId={moduleId}
          values={values[moduleId] || {}}
          onChange={(newValues) => onChange(moduleId, newValues)}
        />
      ))}
    </div>
  );
});

export default TemplateForm;