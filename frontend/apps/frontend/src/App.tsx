import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LegalPage } from './pages/LegalPage';
import { ContactPage } from './pages/ContactPage';
import { LandingPage } from './pages/LandingPage';
import { WorkflowEditorPage } from './pages/WorkflowEditorPage';
import { GalleryPage } from './pages/GalleryPage';
import { WorkflowRunPage } from './pages/WorkflowRunPage';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public pages — always accessible */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/cgu" element={<LegalPage />} />
            <Route path="/confidentialite" element={<LegalPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth pages — redirect to /app if already logged in */}
            <Route element={<PublicRoute />}>
              <Route path="/auth" element={<AuthPage />} />
            </Route>

            {/* Protected Dashboard Routes — redirect to /auth if not logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="workflows/:id/run" element={<WorkflowRunPage />} />
                <Route path="workflows" element={<WorkflowEditorPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
