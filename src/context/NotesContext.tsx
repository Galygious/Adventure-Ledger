import React, { createContext, useContext, useReducer } from 'react';
import { Entry, EntryType } from '../types';

interface NotesState {
  notes: Entry[];
  selectedNote: Entry | null;
  filter: EntryType | 'all' | 'starred';
  sortOrder: 'newest' | 'oldest';
  searchTerm: string;
  showGlobalView: boolean;
}

type NotesAction =
  | { type: 'ADD_NOTE'; payload: Entry }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'DELETE_SESSION_NOTES'; payload: string }
  | { type: 'SELECT_NOTE'; payload: Entry | null }
  | { type: 'SET_FILTER'; payload: EntryType | 'all' | 'starred' }
  | { type: 'SET_SORT'; payload: 'newest' | 'oldest' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'TOGGLE_STAR'; payload: string }
  | { type: 'IMPORT_TO_SESSION'; payload: { noteId: string; sessionId: string } }
  | { type: 'UNIMPORT_FROM_SESSION'; payload: { noteId: string; sessionId: string } }
  | { type: 'TOGGLE_GLOBAL'; payload: { noteId: string } }
  | { type: 'TOGGLE_GLOBAL_VIEW' };

const initialState: NotesState = {
  notes: [],
  selectedNote: null,
  filter: 'all',
  sortOrder: 'newest',
  searchTerm: '',
  showGlobalView: false,
};

const NotesContext = createContext<{
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
} | undefined>(undefined);

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  let newState: NotesState;
  
  switch (action.type) {
    case 'ADD_NOTE':
      newState = {
        ...state,
        notes: [action.payload, ...state.notes]
      };
      break;
    case 'DELETE_NOTE':
      newState = {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
      break;
    case 'DELETE_SESSION_NOTES':
      newState = {
        ...state,
        notes: state.notes.filter(note => 
          // Keep notes that are either:
          // 1. Global notes
          // 2. Notes that belong to other sessions
          note.isGlobal || !note.sessionIds.includes(action.payload)
        )
      };
      break;
    case 'SELECT_NOTE':
      newState = {
        ...state,
        selectedNote: action.payload
      };
      break;
    case 'SET_FILTER':
      newState = {
        ...state,
        filter: action.payload
      };
      break;
    case 'SET_SORT':
      newState = {
        ...state,
        sortOrder: action.payload
      };
      break;
    case 'SET_SEARCH':
      newState = {
        ...state,
        searchTerm: action.payload
      };
      break;
    case 'TOGGLE_STAR':
      newState = {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload
            ? { ...note, starred: !note.starred }
            : note
        )
      };
      break;
    case 'IMPORT_TO_SESSION':
      newState = {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId && note.isGlobal
            ? {
                ...note,
                sessionIds: [...new Set([...note.sessionIds, action.payload.sessionId])]
              }
            : note
        )
      };
      break;
    case 'UNIMPORT_FROM_SESSION':
      newState = {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                ...note,
                sessionIds: note.sessionIds.filter(id => id !== action.payload.sessionId)
              }
            : note
        )
      };
      break;
    case 'TOGGLE_GLOBAL':
      newState = {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                ...note,
                isGlobal: !note.isGlobal,
                // If removing global status, keep only the original session
                sessionIds: !note.isGlobal 
                  ? note.sessionIds 
                  : [note.sessionIds[0]] // Keep only the first session when un-globalizing
              }
            : note
        )
      };
      break;
    case 'TOGGLE_GLOBAL_VIEW':
      newState = {
        ...state,
        showGlobalView: !state.showGlobalView
      };
      break;
    default:
      return state;
  }

  localStorage.setItem('dndNotesState', JSON.stringify(newState));
  return newState;
}

const loadInitialState = (): NotesState => {
  const savedState = localStorage.getItem('dndNotesState');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    return {
      ...parsed,
      notes: parsed.notes.map((note: any) => ({
        ...note,
        created: new Date(note.created),
        updated: new Date(note.updated)
      }))
    };
  }
  return initialState;
};

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, undefined, loadInitialState);

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }

  return {
    state: context.state,
    dispatch: context.dispatch,
    addNote: (note: Entry) => 
      context.dispatch({ type: 'ADD_NOTE', payload: note }),
    deleteNote: (noteId: string) =>
      context.dispatch({ type: 'DELETE_NOTE', payload: noteId }),
    selectNote: (note: Entry | null) =>
      context.dispatch({ type: 'SELECT_NOTE', payload: note }),
    setFilter: (filter: EntryType | 'all' | 'starred') =>
      context.dispatch({ type: 'SET_FILTER', payload: filter }),
    setSort: (sort: 'newest' | 'oldest') =>
      context.dispatch({ type: 'SET_SORT', payload: sort }),
    setSearch: (term: string) =>
      context.dispatch({ type: 'SET_SEARCH', payload: term }),
    toggleStar: (noteId: string) =>
      context.dispatch({ type: 'TOGGLE_STAR', payload: noteId }),
    importToSession: (noteId: string, sessionId: string) =>
      context.dispatch({ type: 'IMPORT_TO_SESSION', payload: { noteId, sessionId } }),
    unimportFromSession: (noteId: string, sessionId: string) =>
      context.dispatch({ type: 'UNIMPORT_FROM_SESSION', payload: { noteId, sessionId } }),
    toggleGlobal: (noteId: string) =>
      context.dispatch({ type: 'TOGGLE_GLOBAL', payload: { noteId } }),
    toggleGlobalView: () =>
      context.dispatch({ type: 'TOGGLE_GLOBAL_VIEW' }),
    getSessionNotes: (sessionId: string) =>
      context.state.notes.filter(note => note.sessionIds.includes(sessionId)),
    getAllGlobalNotes: () =>
      context.state.notes.filter(note => note.isGlobal)
  };
}