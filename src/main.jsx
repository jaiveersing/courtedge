import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './theme.css';
import { initProductionLogging } from './utils/logger';

// Initialize production-safe logging
initProductionLogging();

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, rendering app...');
  try {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
  }
}
