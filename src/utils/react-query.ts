"use client";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,      // cache 5 دقیقه معتبر
            gcTime: 1000 * 60 * 30,        // پاک‌سازی بعد ۳۰ دقیقه
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
