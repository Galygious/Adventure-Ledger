import React from 'react';
import { Session, SessionStats } from '../types';
import { useSession } from '../hooks/useSession';
import EntryView from '../../entry/components/EntryView';
import { Calendar, Users, MapPin, Sword, Scroll } from 'lucide-react';

interface SessionViewProps {
  session: Session;
}

export default function SessionView({ session }: SessionViewProps) {
  const { entries, stats } = useSession(session.id);

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
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
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
        </div>
      </div>

      {renderStats(stats)}

      <div className="space-y-6">
        {entries.map(entry => (
          <EntryView key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}