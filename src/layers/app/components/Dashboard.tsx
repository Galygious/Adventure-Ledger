import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import CampaignList from '../../campaign/components/CampaignList';
import NewCampaignModal from './NewCampaignModal';
import { PlusCircle, Book } from 'lucide-react';

export default function Dashboard() {
  const { campaigns, setActiveCampaign, createCampaign } = useApp();
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Campaigns</h2>
        <button
          onClick={() => setIsNewCampaignModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {campaigns.length > 0 ? (
        <CampaignList
          campaigns={campaigns}
          onSelectCampaign={setActiveCampaign}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-500">Create your first campaign to get started!</p>
        </div>
      )}

      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onSubmit={(campaignData) => {
          createCampaign(campaignData);
          setIsNewCampaignModalOpen(false);
        }}
      />
    </div>
  );
}