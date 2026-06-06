import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { applyTheme, loadThemePreference } from '@/lib/storage';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import App from './App';
import './index.css';

applyTheme(loadThemePreference());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
