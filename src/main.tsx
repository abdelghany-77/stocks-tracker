/* ============================================================
 * main.tsx — React entry point with Root Error Boundary
 * ============================================================ */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="حدث خطأ غير متوقع في تشغيل المنصة">
      <App />
    </ErrorBoundary>
  </StrictMode>
);
