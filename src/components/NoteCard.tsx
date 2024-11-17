import React, { useState } from 'react';
import { Star, Globe, Plus, Minus, AlertCircle, Trash2 } from 'lucide-react';
import { Entry } from '../types';
import { useNotes } from '../context/NotesContext';
import { useSessions } from '../context/SessionContext';
import ConfirmationModal from './ConfirmationModal';

interface NoteCardProps {
  note: Entry;
}

export default function NoteCard({ note }: NoteCardProps) {
  const { state: notesState, dispatch } = useNotes();
  const { state: sessionState } = useSessions();
  const [showGlobalConfirmation, setShowGlobalConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const formattedDate = new Date(note.updated).toLocaleString();
  const currentSessionId = sessionState.activeSession?.id || '';
  const isImportedToCurrentSession = note.sessionIds.includes(currentSessionId);

  const handleImportToSession = () => {
    if (sessionState.activeSession) {
      dispatch({
        type: 'IMPORT_TO_SESSION',
        payload: { noteId: note.id, sessionId: currentSessionId }
      });
    }
  };

  const handleUnimportFromSession = () => {
    if (sessionState.activeSession) {
      dispatch({
        type: 'UNIMPORT_FROM_SESSION',
        payload: { noteId: note.id, sessionId: currentSessionId }
      });
    }
  };

  const handleToggleGlobal = () => {
    dispatch({
      type: 'TOGGLE_GLOBAL',
      payload: { noteId: note.id }
    });
    setShowGlobalConfirmation(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_NOTE', payload: note.id });
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_STAR', payload: note.id })}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Star className={`w-5 h-5 ${note.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </button>
              {!notesState.showGlobalView && (
                <button
                  onClick={() => setShowGlobalConfirmation(true)}
                  className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
                    note.isGlobal
                      ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  {note.isGlobal ? 'Global' : 'Make Global'}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{note.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {note.isGlobal && !notesState.showGlobalView && (
            isImportedToCurrentSession ? (
              <button
                onClick={handleUnimportFromSession}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700"
              >
                <Minus className="w-4 h-4" />
                Unimport from Session
              </button>
            ) : (
              <button
                onClick={handleImportToSession}
                className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Import to Session
              </button>
            )
          )}
          {notesState.showGlobalView && sessionState.activeSession && (
            <button
              onClick={handleImportToSession}
              className={`flex items-center gap-2 px-3 py-1 text-sm ${
                isImportedToCurrentSession
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
              disabled={isImportedToCurrentSession}
            >
              {isImportedToCurrentSession ? (
                'Imported to Current Session'
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Import to Session
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showGlobalConfirmation}
        onClose={() => setShowGlobalConfirmation(false)}
        onConfirm={handleToggleGlobal}
        title={`${note.isGlobal ? 'Remove Global Status' : 'Make Note Global'}`}
        message={
          note.isGlobal
            ? 'This note will no longer be available across all sessions. Are you sure?'
            : 'This note will be available across all sessions. Are you sure?'
        }
        icon={AlertCircle}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Delete Note"
        message={
          note.isGlobal
            ? 'This is a global note. Deleting it will remove it from all sessions. Are you sure?'
            : 'Are you sure you want to delete this note?'
        }
        icon={Trash2}
      />
    </>
  );
}