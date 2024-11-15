import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSessions } from '../context/SessionContext';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

export default function SessionView() {
  const { state, setActiveSession } = useSessions();
  const { activeSession } = state;

  if (!activeSession) return null;

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSession(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{activeSession.title}</h1>
              <p className="text-sm text-gray-500">
                {new Date(activeSession.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </div>
  );
}