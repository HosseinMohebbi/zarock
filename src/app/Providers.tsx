'use client';
import React from 'react';
import {UserProvider} from '@/context/UserContext';
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/utils/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </UserProvider>
        </QueryClientProvider>);
}
