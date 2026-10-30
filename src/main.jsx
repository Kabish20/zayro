import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// OWASP Self-XSS Defense Warning
if (typeof window !== 'undefined') {
  console.log(
    '%cSTOP! %cThis browser console is intended exclusively for authorized developers. Never paste unknown scripts here (Self-XSS protection).',
    'color: #E6B25C; font-size: 24px; font-weight: 800;',
    'color: #30452F; font-size: 13px; font-weight: 600;'
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
