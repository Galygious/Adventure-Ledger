import React, { useState } from 'react';
import { Campaign } from '../types';
import { Session } from '../../session/types';
import { Calendar, Users, MapPin, Scroll, Clock, Plus, ArrowLeft } from 'lucide-react';
import SessionList from '../../session/components/SessionList';
import NewSessionModal from '../../session/components/NewSessionModal';
import { useAppContext } from '../../app/context/AppContext';

interface CampaignViewProps {
  campaign: Campaign;
  sessions: Session[];
  onSelectSession: (sessionId: string) => void;
}

export default function CampaignView({ campaign, sessions, onSelectSession }: CampaignViewProps) {
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const { handleBack } = useAppContext();

  // Filter sessions to only show those belonging to this campaign
  const campaignSessions = sessions.filter(session => session.campaignId === campaign.id);

  const stats = {
    totalSessions: campaignSessions.length,
    totalEntries: campaignSessions.reduce((acc, session) => acc + (session.entryIds?.length || 0), 0),
    lastPlayed: campaignSessions.length > 0 
      ? new Date(Math.max(...campaignSessions.map(s => new Date(s.date).getTime())))
      : null,
    nextSession: campaignSessions
      .filter(s => new Date(s.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.date || null
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>
            <div className="mt-1 flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Started {new Date(campaign.settings.startDate!).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            New Session
          </button>
        </div>
      </div>

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
              ? stats.lastPlayed.toLocaleDateString()
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

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Sessions</h3>
        {campaignSessions.length > 0 ? (
          <SessionList
            sessions={campaignSessions}
            onSelectSession={onSelectSession}
          />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-500">Create your first session to get started!</p>
          </div>
        )}
      </div>

      <NewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        campaignId={campaign.id}
      />
    </div>
  );
}