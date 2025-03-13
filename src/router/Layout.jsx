import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/MidiKeyboardPage/LoadingSpinner';

// Use consistent path pattern for imports
const LandingPage = lazy(() => import('../components/LandingPage')); // Ensure path is correct

const Layout = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Other routes */}
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Layout;
