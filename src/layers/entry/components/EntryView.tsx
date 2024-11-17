import React from 'react';
import { Entry } from '../types';
import { Users, MapPin, Sword, Scroll, Calendar } from 'lucide-react';

interface EntryViewProps {
  entry: Entry;
}

export default function EntryView({ entry }: EntryViewProps) {
  const getTypeIcon = () => {
    switch (entry.type) {
      case 'npc':
        return <Users className="w-5 h-5" />;
      case 'location':
        return <MapPin className="w-5 h-5" />;
      case 'item':
        return <Sword className="w-5 h-5" />;
      case 'quest':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Scroll className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {getTypeIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
              <p className="text-sm text-gray-500">
                {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} • 
                Last updated {new Date(entry.updated).toLocaleString()}
                {entry.isGlobal && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Global
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-gray-600">
            <p>{entry.content}</p>
          </div>

          {entry.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <span
                  key={index}
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
  );
}