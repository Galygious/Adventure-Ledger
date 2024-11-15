import React from 'react';
import { useApp } from '../hooks/useApp';
import { Book, Calendar, ScrollText, ChevronLeft } from 'lucide-react';

export default function Navigation() {
  const { state, setView, setActiveCampaign, setActiveSession } = useApp();

  const handleBack = () => {
    if (state.view === 'entries') {
      setActiveSession(null);
    } else if (state.view === 'sessions') {
      setActiveCampaign(null);
    }
  };

  return (
    <nav className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        {state.view !== 'campaigns' && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="space-y-2">
          <button
            onClick={() => setView('campaigns')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              state.view === 'campaigns'
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Book className="w-5 h-5" />
            Campaigns
          </button>

          {state.activeCampaignId && (
            <button
              onClick={() => setView('sessions')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                state.view === 'sessions'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Sessions
            </button>
          )}

          {state.activeSessionId && (
            <button
              onClick={() => setView('entries')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                state.view === 'entries'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ScrollText className="w-5 h-5" />
              Entries
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}