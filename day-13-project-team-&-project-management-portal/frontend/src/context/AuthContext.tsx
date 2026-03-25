import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/api";

export type UserRole = "company" | "team_member";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    department?: string;
    createdAt: string;
    createdBy?: { name: string; email: string };
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isCompany: () => boolean;
    isTeamMember: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        if (!token) { setIsLoading(false); return; }
        try {
            const { data } = await authApi.getMe();
            setUser(data.data.user);
        } catch {
            localStorage.removeItem("access_token");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    const login = async (email: string, password: string) => {
        const { data } = await authApi.login(email, password);
        localStorage.setItem("access_token", data.data.token);
        setUser(data.data.user);
    };

    const register = async (name: string, email: string, password: string) => {
        const { data } = await authApi.register(name, email, password);
        localStorage.setItem("access_token", data.data.token);
        setUser(data.data.user);
    };

    const logout = async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        localStorage.removeItem("access_token");
        setUser(null);
    };

    const isCompany = () => user?.role === "company";
    const isTeamMember = () => user?.role === "team_member";

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, isCompany, isTeamMember }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
