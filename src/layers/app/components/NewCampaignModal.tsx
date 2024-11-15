// src/layers/app/components/NewCampaignModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Campaign } from '../../campaign/types';
import TemplateForm from '../../template/components/TemplateForm';
import { useTemplate } from '../../template/hooks/useTemplate';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: Partial<Campaign>) => void;
}

export default function NewCampaignModal({ isOpen, onClose, onSubmit }: NewCampaignModalProps) {
  const { template, values: initialValues, validate } = useTemplate('campaign');
  const [templateValues, setTemplateValues] = useState(initialValues);

  if (!isOpen) return null;

  const handleTemplateChange = (moduleId: string, newValues: any) => {
    setTemplateValues(prev => ({
      ...prev,
      [moduleId]: newValues,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title: templateValues.identity?.name || '',
        description: templateValues.identity?.description || '',
        tags: templateValues.identity?.tags || [],
        settings: {
          worldName: templateValues.settings?.worldName || '',
          startDate: templateValues.settings?.startDate || new Date(),
          theme: templateValues.settings?.theme || '',
        },
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-campaign-title"
    >
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto sm:max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 id="new-campaign-title" className="text-2xl font-bold">
            New Campaign
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close Modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <TemplateForm
            templateId="campaign"
            values={templateValues}
            onChange={handleTemplateChange}
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
