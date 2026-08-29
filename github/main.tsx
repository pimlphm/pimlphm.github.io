import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from '../app/home';
import '../app/globals.css';

const language = document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home language={language} />
  </StrictMode>,
);
