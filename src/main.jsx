import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Start MSW for local development only
async function enableMocking() {
  // Only enable MSW in development mode
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js'
      },
      onUnhandledRequest: 'bypass',
      quiet: false
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
