import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
(window as any).React = React;
Promise.resolve().then(() => import('./model')).then(() => import('./components')).then(() => import('./App')).then(() => {
  const App = (window as any).ThreadApp;
  createRoot(document.getElementById('root')!).render(React.createElement(App));
});
