import React from 'react';
import { useAppContext } from '../context/AppContext';
import Header from './Header';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import CampaignView from '../../campaign/components/CampaignView';
import SessionView from '../../session/components/SessionView';

export default function AppContainer() {
  const {
    state,
    campaigns,
    sessions,
    activeCampaign,
    activeSession,
    setActiveCampaign,
    setActiveSession,
    handleBack
  } = useAppContext();

  const renderContent = () => {
    switch (state.view) {
      case 'campaigns':
        return <Dashboard />;
      
      case 'sessions':
        return activeCampaign ? (
          <CampaignView
            campaign={activeCampaign}
            sessions={sessions}
            onSelectSession={setActiveSession}
          />
        ) : (
          <Dashboard />
        );
      
      case 'entries':
        return activeSession ? (
          <SessionView
            session={activeSession}
          />
        ) : activeCampaign ? (
          <CampaignView
            campaign={activeCampaign}
            sessions={sessions}
            onSelectSession={setActiveSession}
          />
        ) : (
          <Dashboard />
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation onBack={handleBack} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}