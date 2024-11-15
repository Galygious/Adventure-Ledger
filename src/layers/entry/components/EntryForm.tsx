import React from 'react';
import { Entry } from '../types';
import { useEntry } from '../hooks/useEntry';
import TemplateForm from '../../template/components/TemplateForm';

interface EntryFormProps {
  entry: Entry;
  onChange?: (entry: Entry) => void;
}

export default function EntryForm({ entry, onChange }: EntryFormProps) {
  const { updateValues } = useEntry(entry.id);

  const handleChange = (values: Record<string, any>) => {
    updateValues(values);
    if (onChange) {
      onChange({
        ...entry,
        values,
        updated: new Date()
      });
    }
  };

  return (
    <div className="space-y-6">
      <TemplateForm
        templateId={entry.templateId}
        onChange={handleChange}
      />
    </div>
  );
}