// Create a new index.jsx file to lazy load MidiKeyboardPage
import { lazy, Suspense } from 'react';

const MidiKeyboardPage = lazy(() => import('./MidiKeyboardPage'));

const MidiKeyboardPageLoader = () => (
  <Suspense fallback={<div className="loading-overlay">
    <p>Loading Piano Interface...</p>
    <div className="loading-spinner"></div>
  </div>}>
    <MidiKeyboardPage />
  </Suspense>
);

export default MidiKeyboardPageLoader;
