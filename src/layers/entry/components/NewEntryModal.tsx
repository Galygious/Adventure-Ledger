import React, { useState } from 'react';
import { X, Users, MapPin, Sword, Scroll, Calendar, Globe } from 'lucide-react';
import { EntryType } from '../types';
import { useAppContext } from '../../app/context/AppContext';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

const entryTypes: { type: EntryType; icon: React.ElementType; label: string }[] = [
  { type: 'npc', icon: Users, label: 'NPC' },
  { type: 'location', icon: MapPin, label: 'Location' },
  { type: 'item', icon: Sword, label: 'Item' },
  { type: 'note', icon: Scroll, label: 'Note' },
  { type: 'quest', icon: Calendar, label: 'Quest' },
];

export default function NewEntryModal({ isOpen, onClose, sessionId }: NewEntryModalProps) {
  const { setEntries, setSessions } = useAppContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<EntryType>('note');
  const [tags, setTags] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryId = Date.now().toString();
    
    // Create new entry
    const newEntry = {
      id: entryId,
      type: selectedType,
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      created: new Date(),
      updated: new Date(),
      starred: false,
      isGlobal,
      sessionIds: [sessionId],
    };

    // Update entries
    setEntries(prev => [...prev, newEntry]);

    // Update session's entryIds
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          entryIds: [...session.entryIds, entryId]
        };
      }
      return session;
    }));

    // Reset form and close modal
    onClose();
    setTitle('');
    setContent('');
    setTags('');
    setSelectedType('note');
    setIsGlobal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Entry</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {entryTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  selectedType === type
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., important, quest, magic"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isGlobal"
                checked={isGlobal}
                onChange={(e) => setIsGlobal(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isGlobal" className="flex items-center gap-2 text-sm text-gray-700">
                <Globe className="w-4 h-4" />
                Make this entry global (available across all sessions)
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}