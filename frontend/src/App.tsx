import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import hook
import LoginPage from '@/pages/LoginPage';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import NotFoundPage from '@/pages/error/NotFoundPage';
import MainLayout from '@/templates/MainLayout';
import CompaniesPage from '@/pages/administration/companies/CompaniesPage';
import PermissionsPage from '@/pages/administration/permissions/PermissionsPage';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a spinner

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const { t } = useTranslation(); // Hook in main component

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={
                  <div style={{ padding: '2rem' }}>
                    {/* We can use t('welcome', { name: user.name }) if we had user name */}
                    <h1>{t('dashboard.title')}</h1>
                    <p>{t('dashboard.welcome')}</p>
                  </div>
                } />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/permissions" element={<PermissionsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
