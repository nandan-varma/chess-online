import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { getRouter } from './router';
import './styles/globals.css';

// Prevent FOUC — apply theme before first render
const savedTheme = localStorage.getItem('theme') ?? 'system';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle(
  'dark',
  savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)
);
const router = getRouter();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');
const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
