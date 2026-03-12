import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects routes that require authentication.
 * Redirects to /auth if not authenticated, shows loading spinner while checking.
 */
export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '1.1rem'
            }}>
                Chargement...
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

/**
 * Redirects already-authenticated users away from public-only pages (like /auth).
 */
export const PublicRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null; // Brief flicker is acceptable here
    }

    return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
};
