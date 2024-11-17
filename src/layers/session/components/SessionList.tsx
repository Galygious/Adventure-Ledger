import React from 'react';
import { Session } from '../types';
import { Calendar, ChevronRight } from 'lucide-react';

interface SessionListProps {
  sessions: Session[];
  onSelectSession: (sessionId: string) => void;
}

export default function SessionList({ sessions, onSelectSession }: SessionListProps) {
  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <button
          key={session.id}
          onClick={() => onSelectSession(session.id)}
          className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(session.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          {session.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{session.description}</p>
          )}
          {session.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {session.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}