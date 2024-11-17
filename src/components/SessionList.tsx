import React, { useState } from 'react';
import { Calendar, Plus, ChevronRight, Trash2 } from 'lucide-react';
import { useSessions } from '../context/SessionContext';
import { useNotes } from '../context/NotesContext';
import NewSessionModal from './NewSessionModal';
import ConfirmationModal from './ConfirmationModal';

export default function SessionList() {
  const { state, setActiveSession, deleteSession } = useSessions();
  const { dispatch: notesDispatch } = useNotes();
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
  };

  const handleDeleteSession = () => {
    if (sessionToDelete) {
      // First, delete all non-global notes associated with this session
      notesDispatch({ 
        type: 'DELETE_SESSION_NOTES', 
        payload: sessionToDelete 
      });
      
      // Then delete the session itself
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
        <button
          onClick={() => setIsNewSessionModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          New Session
        </button>
      </div>

      <div className="grid gap-4">
        {state.sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
          >
            <button
              onClick={() => handleSessionClick(session.id)}
              className="flex items-center gap-4 flex-1"
            >
              <Calendar className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(session.date).toLocaleDateString()}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSessionToDelete(session.id);
              }}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete session"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {state.sessions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sessions yet. Create your first session to get started!</p>
          </div>
        )}
      </div>

      <NewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleDeleteSession}
        title="Delete Session"
        message="This will permanently delete this session and all its non-global notes. Global notes will remain available. Are you sure?"
        icon={Trash2}
      />
    </div>
  );
}