import React, { useState, useMemo } from 'react';
import { Session, SessionStats } from '../types';
import { useSession } from '../hooks/useSession';
import EntryView from '../../entry/components/EntryView';
import { Calendar, Users, MapPin, Sword, Scroll, ArrowLeft, Plus } from 'lucide-react';
import { useAppContext } from '../../app/context/AppContext';
import NewEntryModal from '../../entry/components/NewEntryModal';

interface SessionViewProps {
  session: Session;
}

export default function SessionView({ session }: SessionViewProps) {
  const { handleBack, entries: allEntries } = useAppContext();
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);

  // Filter entries for this session
  const sessionEntries = useMemo(() => {
    return allEntries.filter(entry => 
      entry.sessionIds.includes(session.id) || 
      (entry.isGlobal && entry.sessionIds[0] === session.id)
    );
  }, [allEntries, session.id]);

  // Calculate stats based on filtered entries
  const stats: SessionStats = useMemo(() => {
    const entryTypes = sessionEntries.reduce((acc, entry) => ({
      ...acc,
      [entry.type]: (acc[entry.type] || 0) + 1
    }), {} as Record<string, number>);

    return {
      totalEntries: sessionEntries.length,
      entryTypes,
      lastModified: sessionEntries.length > 0
        ? new Date(Math.max(...sessionEntries.map(e => new Date(e.updated).getTime())))
        : new Date()
    };
  }, [sessionEntries]);

  const renderStats = (stats: SessionStats) => {
    const typeIcons = {
      npc: Users,
      location: MapPin,
      item: Sword,
      quest: Scroll
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Total Entries</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalEntries}</p>
        </div>
        {Object.entries(stats.entryTypes).map(([type, count]) => {
          const Icon = typeIcons[type as keyof typeof typeIcons] || Scroll;
          return (
            <div key={type} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-500">
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </h4>
              </div>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          aria-label="Back to campaign"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{session.title}</h2>
            <div className="mt-1 flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(session.date).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-gray-600">{session.description}</p>
            {session.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {session.tags.map(tag => (
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
          <button
            onClick={() => setIsNewEntryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </button>
        </div>
      </div>

      {renderStats(stats)}

      <div className="space-y-6">
        {sessionEntries.length > 0 ? (
          sessionEntries.map(entry => (
            <EntryView key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Scroll className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
            <p className="text-gray-500">Create your first entry to start taking notes!</p>
          </div>
        )}
      </div>

      <NewEntryModal
        isOpen={isNewEntryModalOpen}
        onClose={() => setIsNewEntryModalOpen(false)}
        sessionId={session.id}
      />
    </div>
  );
}