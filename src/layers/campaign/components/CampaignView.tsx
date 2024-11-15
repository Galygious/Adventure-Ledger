import React from 'react';
import { Campaign, CampaignStats } from '../types';
import { useCampaign } from '../hooks/useCampaign';
import SessionList from '../../session/components/SessionList';
import { Calendar, Users, MapPin, Scroll, Clock } from 'lucide-react';

interface CampaignViewProps {
  campaign: Campaign;
  onSelectSession: (sessionId: string) => void;
}

export default function CampaignView({ campaign, onSelectSession }: CampaignViewProps) {
  const { sessions, stats } = useCampaign(campaign.id);

  const renderStats = (stats: CampaignStats) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">Total Sessions</h4>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalSessions}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">Total Entries</h4>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalEntries}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h4 className="text-sm font-medium text-gray-500">Last Played</h4>
        </div>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {stats.lastPlayed 
            ? new Date(stats.lastPlayed).toLocaleDateString()
            : 'Not started'}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <h4 className="text-sm font-medium text-gray-500">Next Session</h4>
        </div>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {stats.nextSession
            ? new Date(stats.nextSession).toLocaleDateString()
            : 'Not scheduled'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>
            <div className="mt-1 flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Started {new Date(campaign.settings.startDate!).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-gray-600">{campaign.description}</p>
            {campaign.settings.worldName && (
              <p className="mt-2 text-sm text-gray-500">
                World: {campaign.settings.worldName}
              </p>
            )}
            {campaign.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {campaign.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {renderStats(stats)}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Sessions</h3>
        <SessionList
          sessions={sessions}
          onSelectSession={onSelectSession}
        />
      </div>
    </div>
  );
}