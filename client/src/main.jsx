import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);  // ✅ Check in console

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React rendered successfully');  // ✅ Check in console
} else {
  console.error('Root element not found!');
}