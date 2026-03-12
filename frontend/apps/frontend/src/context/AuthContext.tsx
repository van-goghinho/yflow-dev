import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import { api } from '../services/api';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
    signup: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: get token from either storage
function getStoredToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Helper: clear token from both storages
function clearStoredToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage OR sessionStorage
        const storedToken = getStoredToken();
        if (storedToken) {
            try {
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                // Check expiration
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    throw new Error('Token expired');
                }
                setToken(storedToken);
                setUser({ email: payload.email, name: payload.name });
            } catch {
                clearStoredToken();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, pass: string, rememberMe = false) => {
        const data = await api.signIn(email, pass);
        const newToken = data.access_token;
        const newUser = data.user;

        // Store in localStorage (persistent) or sessionStorage (tab only)
        if (rememberMe) {
            localStorage.setItem('token', newToken);
        } else {
            sessionStorage.setItem('token', newToken);
        }

        setToken(newToken);
        setUser(newUser);
        navigate('/app');
    };

    const signup = async (email: string, pass: string, name: string) => {
        await api.signUp(email, pass, name);
    };

    const logout = () => {
        clearStoredToken();
        window.location.href = '/';
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
