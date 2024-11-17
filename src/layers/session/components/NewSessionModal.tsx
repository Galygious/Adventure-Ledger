import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../app/context/AppContext';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function NewSessionModal({ isOpen, onClose, campaignId }: NewSessionModalProps) {
  const { setSessions, setCampaigns, campaigns } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = Date.now().toString();
    
    // Create new session
    const newSession = {
      id: sessionId,
      title,
      date: new Date(date),
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isActive: false,
      campaignId,
      entryIds: []
    };

    // Update sessions
    setSessions(prev => [...prev, newSession]);

    // Update campaign's sessionIds
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        return {
          ...campaign,
          sessionIds: [...campaign.sessionIds, sessionId],
          updated: new Date()
        };
      }
      return campaign;
    }));

    // Reset form and close modal
    onClose();
    setTitle('');
    setDescription('');
    setTags('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Session</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Session Title
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
              placeholder="e.g., combat, roleplay, quest"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}