'use client';
import React, {useEffect, useState} from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <button
            type="button"
            aria-pressed={isDark}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setIsDark((v) => !v)}
            className={`relative top-4 right-2 inline-flex items-center w-12 h-6 !rounded-full overflow-hidden transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
        ${isDark ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-yellow-300 to-orange-300'}`}
            dir="ltr"
        >
            {/* Sun icon (left) */}
            <span className="absolute left-1 inline-flex items-center justify-center w-5 h-5 pointer-events-none">
        <svg className={`w-4 h-4 ${isDark ? 'text-yellow-300/60' : 'text-yellow-600'}`} viewBox="0 0 24 24"
             fill="currentColor" aria-hidden>
          <path
              d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm9-9v-2h-3v2h3zm-3.95 7.95l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM6.76 19.16l-1.8 1.79L3.17 19.16l1.79-1.79 1.8 1.79zM12 7a5 5 0 100 10 5 5 0 000-10z"/>
        </svg>
      </span>

            {/* Moon icon (right) */}
            <span className="absolute right-1 inline-flex items-center justify-center w-5 h-5 pointer-events-none">
        <svg className={`w-4 h-4 ${isDark ? 'text-white' : 'text-white/60'}`} viewBox="0 0 24 24" fill="currentColor"
             aria-hidden>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </span>

            {/* Knob */}
            <span
                className={`relative z-10 block w-6 h-6 rounded-full shadow transform transition-transform duration-300 bg-white dark:bg-gray-900
          ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );
}

// 'use client'
// import React, { useEffect, useState } from 'react'
//
// export default function ThemeToggle(): JSX.Element {
//     const [isDark, setIsDark] = useState<boolean>(() => {
//         if (typeof window === 'undefined') return false
//         const stored = localStorage.getItem('theme')
//         if (stored) return stored === 'dark'
//         return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches
//     })
//
//     useEffect(() => {
//         const root = document.documentElement
//         if (isDark) root.classList.add('dark')
//         else root.classList.remove('dark')
//         try {
//             localStorage.setItem('theme', isDark ? 'dark' : 'light')
//         } catch {}
//     }, [isDark])
//
//     return (
//         <button
//             type="button"
//             aria-pressed={isDark}
//             onClick={() => setIsDark(prev => !prev)}
//             className="inline-flex items-center gap-2 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
//             style={{
//                 backgroundColor: 'hsl(var(--primary))',
//                 color: 'hsl(var(--primary-foreground))',
//                 boxShadow: 'var(--tw-ring-offset-shadow, 0 0 transparent)',
//             }}
//             title={isDark ? 'Switch to light' : 'Switch to dark'}
//         >
//             {isDark ? (
//                 // Sun icon (light)
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
//                     <path d="M12 4.5a1 1 0 0 1 1-1h0a1 1 0 1 1-1 1zm0 15a1 1 0 0 1 1 1h0a1 1 0 1 1-1-1zM4.5 12a1 1 0 0 1-1 1h0a1 1 0 1 1 1-1zm15 0a1 1 0 0 1-1 1h0a1 1 0 1 1 1-1zM6.22 6.22a1 1 0 0 1 1.41 0 1 1 0 1 1-1.41 1.41 1 1 0 0 1 0-1.41zM16.36 16.36a1 1 0 0 1 1.41 0 1 1 0 1 1-1.41 1.41 1 1 0 0 1 0-1.41zM6.22 17.78a1 1 0 0 1 0-1.41 1 1 0 1 1-1.41 1.41 1 1 0 0 1 1.41 0zM17.78 6.22a1 1 0 0 1 0-1.41 1 1 0 1 1-1.41 1.41 1 1 0 0 1 1.41 0zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
//                 </svg>
//             ) : (
//                 // Moon icon (dark)
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
//                     <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
//                 </svg>
//             )}
//             <span className="text-sm font-medium">{isDark ? 'Light' : 'Dark'}</span>
//         </button>
//     )
// }

// 'use client'
//
// import { useEffect, useState } from 'react'
// // import { Moon, Sun } from 'lucide-react' // آیکون‌ها (اختیاری) - در shadcn/ui هست
// import { cn } from '@/utils/cn'
//
// export default function ThemeToggle() {
//     const [theme, setTheme] = useState<'light' | 'dark'>('light')
//
//     // در mount، تم فعلی html رو بخون
//     useEffect(() => {
//         if (document.documentElement.classList.contains('dark')) {
//             setTheme('dark')
//         } else {
//             setTheme('light')
//         }
//     }, [])
//
//     const toggleTheme = () => {
//         const root = document.documentElement
//
//         if (root.classList.contains('dark')) {
//             root.classList.remove('dark')
//             setTheme('light')
//             localStorage.setItem('theme', 'light')
//         } else {
//             root.classList.add('dark')
//             setTheme('dark')
//             localStorage.setItem('theme', 'dark')
//         }
//     }
//
//     // هنگام mount اولیه localStorage رو sync کن
//     useEffect(() => {
//         const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
//         if (saved) {
//             document.documentElement.classList.toggle('dark', saved === 'dark')
//             setTheme(saved)
//         }
//     }, [])
//
//     return (
//         <button
//             onClick={toggleTheme}
//             className={cn(
//                 'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
//                 'bg-background text-foreground hover:bg-muted'
//             )}
//             aria-label="Toggle theme"
//         >
//             {theme === 'dark' ? (
//                 <>
//                     {/*<Sun className="h-4 w-4" />*/}
//                     <span className="text-red-400">روشن</span>
//                 </>
//             ) : (
//                 <>
//                     {/*<Moon className="h-4 w-4" />*/}
//                     <span className="text-red-400">تاریک</span>
//                 </>
//             )}
//         </button>
//     )
// }
