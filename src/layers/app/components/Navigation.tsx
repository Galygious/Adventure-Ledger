import React from 'react';
import { useApp } from '../hooks/useApp';
import { Book, Calendar, ScrollText, ChevronLeft } from 'lucide-react';

interface NavigationProps {
  onBack: () => void;
}

export default function Navigation({ onBack }: NavigationProps) {
  const { state, activeCampaign, activeSession } = useApp();

  return (
    <nav className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        {state.view !== 'campaigns' && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="space-y-2">
          <div
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              state.view === 'campaigns'
                ? 'bg-gray-800 text-white'
                : 'text-gray-300'
            }`}
          >
            <Book className="w-5 h-5" />
            {state.view === 'campaigns' ? 'Campaigns' : activeCampaign?.title}
          </div>

          {state.activeCampaignId && (
            <div
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                state.view === 'sessions'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300'
              }`}
            >
              <Calendar className="w-5 h-5" />
              {state.view === 'sessions' ? 'Sessions' : activeSession?.title}
            </div>
          )}

          {state.activeSessionId && (
            <div
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                state.view === 'entries'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300'
              }`}
            >
              <ScrollText className="w-5 h-5" />
              Entries
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}