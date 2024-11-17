import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useSessions } from '../context/SessionContext';
import { Entry } from '../types';

interface GlobalNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalNotesModal({ isOpen, onClose }: GlobalNotesModalProps) {
  const { getAllGlobalNotes, dispatch: notesDispatch } = useNotes();
  const { state: sessionState } = useSessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentSessionId = sessionState.activeSession?.id || '';
  
  // Get all global notes using the getAllGlobalNotes helper
  const globalNotes = getAllGlobalNotes();
  
  // Filter out notes that are already in the current session
  const availableGlobalNotes = globalNotes.filter(
    note => !note.sessionIds.includes(currentSessionId)
  );

  const filteredNotes = availableGlobalNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImport = () => {
    selectedNotes.forEach(noteId => {
      notesDispatch({
        type: 'IMPORT_TO_SESSION',
        payload: { noteId, sessionId: currentSessionId }
      });
    });
    onClose();
    setSelectedNotes([]);
    setSearchTerm('');
  };

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Import Global Notes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search global notes..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto mb-6">
          {filteredNotes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No global notes available for import</p>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note: Entry) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border ${
                    selectedNotes.includes(note.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } cursor-pointer`}
                  onClick={() => toggleNoteSelection(note.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{note.content}</p>
                      <div className="flex gap-2 mt-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedNotes.includes(note.id)
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedNotes.includes(note.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={selectedNotes.length === 0}
            className={`px-4 py-2 rounded-lg ${
              selectedNotes.length > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Import Selected ({selectedNotes.length})
          </button>
        </div>
      </div>
    </div>
  );
}