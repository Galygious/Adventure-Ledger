import React, { useState } from 'react';
import { PlusCircle, Search, Settings, Book, Users, MapPin, Sword, ScrollText, Star, Globe } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { EntryType } from '../types';
import NewEntryModal from './NewEntryModal';
import SettingsModal from './SettingsModal';
import GlobalNotesModal from './GlobalNotesModal';

export default function Sidebar() {
  const { state, dispatch } = useNotes();
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGlobalNotesModalOpen, setIsGlobalNotesModalOpen] = useState(false);

  const navItems = [
    { icon: ScrollText, label: 'Recent Notes', filter: 'all' as const },
    { icon: Users, label: 'NPCs', filter: 'npc' as EntryType },
    { icon: MapPin, label: 'Locations', filter: 'location' as EntryType },
    { icon: Sword, label: 'Items', filter: 'item' as EntryType },
    { icon: Star, label: 'Starred', filter: 'starred' as const },
  ];

  return (
    <>
      <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Book className="w-6 h-6" />
            D&D Notes
          </h1>
        </div>
        
        <div className="px-4 space-y-2">
          <button 
            onClick={() => setIsNewEntryModalOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 px-4 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            New Entry
          </button>
          <button 
            onClick={() => setIsGlobalNotesModalOpen(true)}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white rounded-lg py-2 px-4 flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Import Global Notes
          </button>
        </div>

        <div className="px-4 my-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={state.searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              placeholder="Search notes..."
              className="w-full bg-gray-800 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => dispatch({ type: 'SET_FILTER', payload: item.filter })}
                  className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-3 text-gray-300 hover:text-white ${
                    state.filter === item.filter ? 'bg-gray-800 text-white' : ''
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-3 text-gray-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      <NewEntryModal
        isOpen={isNewEntryModalOpen}
        onClose={() => setIsNewEntryModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <GlobalNotesModal
        isOpen={isGlobalNotesModalOpen}
        onClose={() => setIsGlobalNotesModalOpen(false)}
      />
    </>
  );
}