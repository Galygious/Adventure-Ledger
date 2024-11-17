import React from 'react';
import { Clock, Filter, Globe } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useSessions } from '../context/SessionContext';
import NoteCard from './NoteCard';

export default function MainContent() {
  const { state, dispatch } = useNotes();
  const { state: sessionState } = useSessions();
  const currentSessionId = sessionState.activeSession?.id;

  // Filter notes based on view mode and filters
  const filteredNotes = state.notes
    .filter(note => {
      // In global view, show all global notes
      if (state.showGlobalView) {
        return note.isGlobal;
      }

      // In session view, only show notes that belong to the current session
      const belongsToSession = note.sessionIds.includes(currentSessionId || '');
      if (!belongsToSession) {
        return false;
      }

      // Apply additional filters
      const matchesFilter = state.filter === 'all' || 
        (state.filter === 'starred' ? note.starred : note.type === state.filter);
      
      const matchesSearch = state.searchTerm === '' || 
        note.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(state.searchTerm.toLowerCase()));

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.updated).getTime();
      const dateB = new Date(b.updated).getTime();
      return state.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <main className="flex-1 bg-gray-50 h-screen overflow-y-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {state.showGlobalView ? 'Global Notes' : state.filter === 'all' ? 'Recent Notes' : `${state.filter.charAt(0).toUpperCase() + state.filter.slice(1)}s`}
            </h2>
            {state.showGlobalView && (
              <p className="text-sm text-gray-500 mt-1">
                Showing all available global notes. Click "Import to Session" to use a note in the current session.
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_SORT', payload: state.sortOrder === 'newest' ? 'oldest' : 'newest' })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
            >
              <Clock className="w-4 h-4" />
              {state.sortOrder === 'newest' ? 'Latest First' : 'Oldest First'}
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_GLOBAL_VIEW' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 ${
                state.showGlobalView ? 'text-indigo-600 border-indigo-200 bg-indigo-50' : ''
              }`}
            >
              <Globe className="w-4 h-4" />
              {state.showGlobalView ? 'Session View' : 'View Global'}
            </button>
            {!state.showGlobalView && (
              <button
                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                {state.filter === 'all' ? 'All Notes' : 'Clear Filter'}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {state.showGlobalView 
                  ? "No global notes available. Make a note global to see it here."
                  : "No notes found in this session."}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}