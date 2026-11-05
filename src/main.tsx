import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import { initGoogleAnalytics, isPrivatePath } from './lib/analytics';
import './index.css';

initGoogleAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Vercel Web Analytics y Speed Insights (actívalos en el panel del proyecto en Vercel) */}
    <Analytics beforeSend={(event) => (isPrivatePath(new URL(event.url).pathname) ? null : event)} />
    <SpeedInsights />
  </StrictMode>
);