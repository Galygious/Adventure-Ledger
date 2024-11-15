import { useState, useCallback } from 'react';
import { Entry, EntryId } from '../types';
import { useTemplate } from '../../template/hooks/useTemplate';

interface UseEntryResult {
  entry: Entry | null;
  isValid: boolean;
  validate: () => boolean;
  updateValues: (values: Record<string, any>) => void;
}

export function useEntry(entryId: EntryId | null): UseEntryResult {
  const [entry, setEntry] = useState<Entry | null>(null);
  
  const template = entry ? useTemplate(entry.templateId) : null;

  const validate = useCallback(() => {
    if (!template) return false;
    return template.validate();
  }, [template]);

  const updateValues = useCallback((values: Record<string, any>) => {
    if (!entry) return;

    setEntry({
      ...entry,
      values: {
        ...entry.values,
        ...values
      },
      updated: new Date()
    });
  }, [entry]);

  return {
    entry,
    isValid: template?.isValid ?? false,
    validate,
    updateValues
  };
}