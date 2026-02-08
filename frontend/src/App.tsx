import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a spinner

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <div style={{ padding: '2rem' }}>
                <h1>Dashboard</h1>
                <p>Welcome to Dental App!</p>
                {/* Logout button for testing */}
                <LogoutButton />
              </div>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

const LogoutButton = () => {
  const { logout } = useAuth();
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
      Logout
    </button>
  )
}

export default App;
