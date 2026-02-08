import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import hook
import LoginPage from '@/pages/LoginPage';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import LanguageSelector from '@/components/LanguageSelector';
import NotFoundPage from '@/pages/error/NotFoundPage';

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
              <Route path="/" element={
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LanguageSelector />
                  </div>
                  {/* We can use t('welcome', { name: user.name }) if we had user name */}
                  <h1>{t('dashboard.title')}</h1>
                  <p>{t('dashboard.welcome')}</p>
                  {/* Logout button for testing */}
                  <LogoutButton />
                </div>
              } />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

const LogoutButton = () => {
  const { logout } = useAuth();
  const { t } = useTranslation(); // Hook in sub-component

  return (
    <button
      onClick={logout}
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer'
      }}
    >
      {t('common.logout')}
    </button>
  )
}


export default App;
