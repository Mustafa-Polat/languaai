import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Service Worker kayıt (PWA offline desteği)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('SW kayıtlı:', reg.scope))
      .catch((err) => console.log('SW hatası:', err));
  });
}
