import React, { createContext, useContext, useReducer } from 'react';
import { Session } from '../types';

interface SessionState {
  sessions: Session[];
  activeSession: Session | null;
}

type SessionAction =
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'SET_ACTIVE_SESSION'; payload: string | null }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string };

const initialState: SessionState = {
  sessions: [],
  activeSession: null,
};

const SessionContext = createContext<{
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
} | undefined>(undefined);

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  let newState: SessionState;

  switch (action.type) {
    case 'ADD_SESSION':
      newState = {
        ...state,
        sessions: [...state.sessions, action.payload],
      };
      break;
    case 'SET_ACTIVE_SESSION':
      newState = {
        ...state,
        sessions: state.sessions.map(session => ({
          ...session,
          isActive: session.id === action.payload,
        })),
        activeSession: action.payload ? state.sessions.find(s => s.id === action.payload) || null : null,
      };
      break;
    case 'UPDATE_SESSION':
      newState = {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        ),
      };
      break;
    case 'DELETE_SESSION':
      newState = {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload),
        activeSession: state.activeSession?.id === action.payload ? null : state.activeSession,
      };
      break;
    default:
      return state;
  }

  localStorage.setItem('dndSessionsState', JSON.stringify(newState));
  return newState;
}

const loadInitialState = (): SessionState => {
  const savedState = localStorage.getItem('dndSessionsState');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    return {
      ...parsed,
      sessions: parsed.sessions.map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }))
    };
  }
  return initialState;
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, undefined, loadInitialState);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions must be used within a SessionProvider');
  }

  return {
    state: context.state,
    dispatch: context.dispatch,
    addSession: (session: Session) => 
      context.dispatch({ type: 'ADD_SESSION', payload: session }),
    setActiveSession: (sessionId: string | null) =>
      context.dispatch({ type: 'SET_ACTIVE_SESSION', payload: sessionId }),
    updateSession: (session: Session) =>
      context.dispatch({ type: 'UPDATE_SESSION', payload: session }),
    deleteSession: (sessionId: string) =>
      context.dispatch({ type: 'DELETE_SESSION', payload: sessionId }),
  };
}