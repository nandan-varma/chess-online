import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeTheme } from './lib/theme';
import { getRouter } from './router';
import './styles/globals.css';

initializeTheme();
const router = getRouter();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');
const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
