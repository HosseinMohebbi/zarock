'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState<boolean | null>(null); // ⛔ هنوز نمی‌دونیم dark یا light

    useEffect(() => {
        const saved = localStorage.getItem('theme');

        const dark = saved
            ? saved === 'dark'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;

        setIsDark(dark);

        const root = document.documentElement;
        if (dark) root.classList.add('dark');
        else root.classList.remove('dark');
    }, []);

    // 🔴 تا وقتی مقدار واقعی نیومده هیچ UI‌ای رندر نکن
    if (isDark === null) return null;

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        const root = document.documentElement;

        if (newTheme) root.classList.add('dark');
        else root.classList.remove('dark');

        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    return (
        <button
            type="button"
            aria-pressed={isDark}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
            className={`relative top-4 right-2 inline-flex items-center w-12 h-6 !rounded-full overflow-hidden transition-colors duration-300 
            ${isDark ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-yellow-300 to-orange-300'}`}
            dir="ltr"
        >
            {/* خورشید */}
            <span className="absolute left-1 inline-flex items-center justify-center w-5 h-5 pointer-events-none">
                <svg className={`w-4 h-4 ${isDark ? 'text-yellow-300/60' : 'text-yellow-600'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm9-9v-2h-3v2h3zm-3.95 7.95l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM6.76 19.16l-1.8 1.79L3.17 19.16l1.79-1.79 1.8 1.79zM12 7a5 5 0 100 10 5 5 0 000-10z"/>
                </svg>
            </span>

            {/* ماه */}
            <span className="absolute right-1 inline-flex items-center justify-center w-5 h-5 pointer-events-none">
                <svg className={`w-4 h-4 ${isDark ? 'text-white' : 'text-white/60'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
            </span>

            {/* دکمه گرد */}
            <span
                className={`relative z-10 block w-6 h-6 rounded-full shadow transform transition-transform duration-300 bg-white dark:bg-gray-900
                ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );
}


// 'use client';
// import React, {useEffect, useState} from 'react';
//
// export default function ThemeToggle() {
//     const [isDark, setIsDark] = useState<boolean>(() => {
//         if (typeof window === 'undefined') return false;
//         const saved = localStorage.getItem('theme');
//         if (saved) return saved === 'dark';
//         return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
//     });
//
//     useEffect(() => {
//         const root = document.documentElement;
//         if (isDark) root.classList.add('dark');
//         else root.classList.remove('dark');
//         localStorage.setItem('theme', isDark ? 'dark' : 'light');
//     }, [isDark]);
//
//     return (
//         <button
//             type="button"
//             aria-pressed={isDark}
//             aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
//             onClick={() => setIsDark((v) => !v)}
//             className={`relative top-4 right-2 inline-flex items-center w-12 h-6 !rounded-full overflow-hidden transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
//         ${isDark ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-yellow-300 to-orange-300'}`}
//             dir="ltr"
//         >
//             {/* Sun icon (left) */}
//             <span className="absolute left-1 inline-flex items-center justify-center w-5 h-5 pointer-events-none">
//         <svg className={`w-4 h-4 ${isDark ? 'text-yellow-300/60' : 'text-yellow-600'}`} viewBox="0 0 24 24"
//              fill="currentColor" aria-hidden>
//           <path
//               d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm9-9v-2h-3v2h3zm-3.95 7.95l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM6.76 19.16l-1.8 1.79L3.17 19.16l1.79-1.79 1.8 1.79zM12 7a5 5 0 100 10 5 5 0 000-10z"/>
//         </svg>
//       </span>
//
//             {/* Moon icon (right) */}
//             <span className="absolute right-1 inline-flex items-center justify-center w-5 h-5 pointer-events-none">
//         <svg className={`w-4 h-4 ${isDark ? 'text-white' : 'text-white/60'}`} viewBox="0 0 24 24" fill="currentColor"
//              aria-hidden>
//           <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
//         </svg>
//       </span>
//
//             {/* Knob */}
//             <span
//                 className={`relative z-10 block w-6 h-6 rounded-full shadow transform transition-transform duration-300 bg-white dark:bg-gray-900
//           ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
//             />
//         </button>
//     );
// }
