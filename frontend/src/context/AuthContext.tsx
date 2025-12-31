import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup, setAuthToken, type AuthResponse } from '../api';

interface User {
    id: number;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setAuthToken(storedToken);
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response: AuthResponse = await apiLogin({ email, password });

            const userData: User = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
            };

            setUser(userData);
            setToken(response.access_token);
            setAuthToken(response.access_token);

            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('auth_user', JSON.stringify(userData));
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            const response: AuthResponse = await apiSignup({ email, password, name });

            const userData: User = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
            };

            setUser(userData);
            setToken(response.access_token);
            setAuthToken(response.access_token);

            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('auth_user', JSON.stringify(userData));
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(error.response?.data?.detail || 'Signup failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setAuthToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
