import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { ToastProvider } from './components/Toast';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import NeedBrowsePage from './pages/NeedBrowsePage';
import CreateNeedPage from './pages/CreateNeedPage';
import NeedDetailPage from './pages/NeedDetailPage';
import MyNeedsPage from './pages/MyNeedsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ProfilePage from './pages/ProfilePage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  const { fetchUser, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/needs" replace />} />
                    <Route path="/needs" element={<NeedBrowsePage />} />
                    <Route path="/needs/create" element={<CreateNeedPage />} />
                    <Route path="/needs/my" element={<MyNeedsPage />} />
                    <Route path="/applications" element={<MyApplicationsPage />} />
                    <Route path="/needs/:id" element={<NeedDetailPage />} />
                    <Route path="/needs/:id/edit" element={<CreateNeedPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
