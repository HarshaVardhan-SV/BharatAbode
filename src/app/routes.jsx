import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import AdminPage from '../pages/AdminPage';
import DashboardPage from '../pages/DashboardPage';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import PropertyFormPage from '../pages/PropertyFormPage';
import RecommendationsPage from '../pages/RecommendationsPage';
import RegisterPage from '../pages/RegisterPage';
import ROIReceiptPage from '../pages/ROIReceiptPage';
import SavedIdeasPage from '../pages/SavedIdeasPage';

function GuestOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner label="Loading..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/property-form" element={<ProtectedRoute><PropertyFormPage /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
      <Route path="/saved-ideas" element={<ProtectedRoute><SavedIdeasPage /></ProtectedRoute>} />
      <Route path="/roi-receipt" element={<ProtectedRoute><ROIReceiptPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
