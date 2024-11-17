import React from 'react';
import { Campaign } from '../types';
import { Book, ChevronRight } from 'lucide-react';

interface CampaignListProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaignId: string) => void;
}

export default function CampaignList({ campaigns, onSelectCampaign }: CampaignListProps) {
  return (
    <div className="space-y-4">
      {campaigns.map(campaign => (
        <div
          key={campaign.id}
          onClick={() => onSelectCampaign(campaign.id)}
          className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectCampaign(campaign.id);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Book className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                <p className="text-sm text-gray-500">
                  {campaign.settings.worldName && `World: ${campaign.settings.worldName} • `}
                  Started {new Date(campaign.settings.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          {campaign.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
          )}
          {campaign.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {campaign.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}