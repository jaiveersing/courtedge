import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard if already logged in and trying to access login/signup
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
