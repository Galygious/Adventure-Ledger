import React from 'react';
import { useApp } from '../hooks/useApp';
import Header from './Header';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import CampaignView from '../../campaign/components/CampaignView';
import SessionView from '../../session/components/SessionView';
import EntryView from '../../entry/components/EntryView';

export default function AppContainer() {
  const {
    state,
    activeCampaign,
    activeSession,
    activeEntry,
    setActiveSession
  } = useApp();

  const renderContent = () => {
    if (state.isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-600">{state.error}</div>
        </div>
      );
    }

    switch (state.view) {
      case 'campaigns':
        return <Dashboard />;
      case 'sessions':
        return activeCampaign && (
          <CampaignView
            campaign={activeCampaign}
            onSelectSession={setActiveSession}
          />
        );
      case 'entries':
        return activeSession && (
          <SessionView
            session={activeSession}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}