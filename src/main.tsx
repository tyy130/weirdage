import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { renderShareCardToBlob } from './utils/shareCanvas';
import { calculateAgeStatistics } from './calculations/ageEngine';

// Expose on window for automated headless export & testing
if (typeof window !== 'undefined') {
  (window as any).renderShareCardToBlob = renderShareCardToBlob;
  (window as any).calculateAgeStatistics = calculateAgeStatistics;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
