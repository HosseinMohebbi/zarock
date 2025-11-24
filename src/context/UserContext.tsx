// 'use client';
//
// import React, {
//     createContext,
//     useCallback,
//     useContext,
//     useEffect,
//     useMemo,
//     useState
// } from "react";
// import { GetUserResponse } from "@/services/auth";
//
//
// type UserState = {
//     user: GetUserResponse | null;
//     loading: boolean;
//     error: string | null;
//     refresh: () => Promise<void>;
//     signOut: () => Promise<void>;
// };
//
// const Ctx = createContext<UserState | undefined>(undefined);
//
// export function UserProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<GetUserResponse | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//
//     /**
//      * دیگر localStorage نداریم.
//      * چون API Route خودش کوکی را چک می‌کند.
//      */
//     const refresh = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//
//         try {
//             const res = await fetch("/api/auth/me", {
//                 method: "GET",
//                 credentials: "include",
//             });
//
//             if (!res.ok) {
//                 setUser(null);
//             } else {
//                 const data: GetUserResponse = await res.json();
//                 setUser(data);
//             }
//         } catch (err: any) {
//             setUser(null);
//             setError(err?.message || "خطا در دریافت اطلاعات کاربر");
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     /**
//      * خروج → کوکی را پاک می‌کنیم
//      */
//     const signOut = useCallback(async () => {
//         try {
//             await fetch("/api/auth/logout", {
//                 method: "POST",
//                 credentials: "include",
//             });
//         } catch {}
//         setUser(null);
//     }, []);
//
//     // اولین بار پروفایل را چک کن
//     useEffect(() => {
//         refresh();
//     }, [refresh]);
//
//     const value = useMemo(
//         () => ({
//             user,
//             loading,
//             error,
//             refresh,
//             signOut,
//         }),
//         [user, loading, error, refresh, signOut]
//     );
//
//     return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
// }
//
// export function useUser() {
//     const ctx = useContext(Ctx);
//     if (!ctx) throw new Error("useUser must be used within <UserProvider>");
//     return ctx;
// }

'use client';

import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import { getUser, type GetUserResponse } from '@/services/auth';

type UserState = {
    user: GetUserResponse | null;
    loading: boolean;
    error: string | null;
    // فراخوانی دستی برای رفرش (مثلا بعد از لاگین/آپدیت)
    refresh: () => Promise<void>;
    // خروج
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

    // در اولین بار (و هر بار که تب تازه باز می‌شه) پروفایل را بگیر
    useEffect(() => {
        refresh();
    }, [refresh]);

    const value = useMemo<UserState>(() => ({ user, loading, error, refresh, signOut }), [user, loading, error, refresh, signOut]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useUser must be used within <UserProvider>');
    return ctx;
}
