import React from 'react';
import { AppProvider } from './layers/app/context/AppContext';
import AppContainer from './layers/app/components/AppContainer';

export default function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}