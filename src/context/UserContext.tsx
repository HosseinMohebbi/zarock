'use client';
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import { getUser } from '@/services/auth/auth.service';
import { GetUserResponse } from '@/services/auth/auth.types';

type UserState = {
    user: GetUserResponse | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<GetUserResponse | null>>;
    signOut: () => void;
};

const Ctx = createContext<UserState | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<GetUserResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const hasValidToken = () => {
        if (typeof window === 'undefined') return false;
        const token = localStorage.getItem('auth_token');
        const expires = localStorage.getItem('auth_expires');
        if (!token || !expires) return false;
        const exp = new Date(expires);
        return !isNaN(exp.getTime()) && exp.getTime() > Date.now();
    };

    const refresh = useCallback(async () => {
        if (!hasValidToken()) {
            setUser(null);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getUser();
            setUser(data);
        } catch (e: any) {
            setError(
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                e?.message || 'خطا در دریافت اطلاعات کاربر'
            );
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_expires');
        }
        setUser(null);
    }, []);
    
    useEffect(() => {
        refresh();
    }, [refresh]);

    const value = useMemo<UserState>(() => ({ user, loading, error, refresh, setUser, signOut }), [user, loading, error, refresh, signOut]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useUser must be used within <UserProvider>');
    return ctx;
}
