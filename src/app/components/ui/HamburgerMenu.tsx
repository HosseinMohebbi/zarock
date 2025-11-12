// app/components/ui/HamburgerMenu.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MdMenu, MdClose } from 'react-icons/md';
import ThemeToggle from '@/app/components/theme/ThemeToggle';
import type { ReactNode } from 'react';

interface MenuItem {
    label: string;
    href: string;
    icon?: ReactNode;
}

interface HamburgerMenuProps {
    items?: MenuItem[];
    className?: string;
}

export default function HamburgerMenu({ items, className = '' }: HamburgerMenuProps) {
    const [open, setOpen] = useState(false);

    const defaultItems: MenuItem[] = [
        { label: 'داشبورد', href: '/' },
        { label: 'اشخاص', href: '/clients' },
        { label: 'کالا و خدمات', href: '/products' },
    ];

    const menuItems = items ?? defaultItems;

    return (
        <>
            {/* دکمهٔ منو - سمت راست */}
            <div className={`fixed right-4 top-4 z-50 ${className}`}>
                <button
                    aria-label={open ? 'بستن منو' : 'باز کردن منو'}
                    aria-expanded={open}
                    onClick={() => setOpen((s) => !s)}
                    className="p-2 rounded-md bg-card text-card-foreground shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    {open ? <MdClose size={22} /> : <MdMenu size={22} />}
                </button>
            </div>

            {/* اوورلی وقتی منو باز است */}
            <div
                aria-hidden={!open}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setOpen(false)}
            />

            {/* پنل از سمت راست اسلاید می‌شود */}
            <aside
                className={`fixed right-0 top-0 z-50 h-full w-72 max-w-full transform bg-card text-foreground shadow-lg transition-transform duration-200
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
                aria-hidden={!open}
            >
                <div className="flex h-full flex-col !p-4">
                    <div className="!mb-2 flex items-center justify-between">
                        <div className="text-lg font-semibold">منو</div>
                        <button
                            aria-label="بستن منو"
                            onClick={() => setOpen(false)}
                            className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>

                    <nav className="mb-4 flex-1 overflow-auto">
                        <ul className="space-y-1">
                            {menuItems.map((it) => (
                                <li key={it.href}>
                                    <Link
                                        href={it.href}
                                        onClick={() => setOpen(false)}
                                        className="block w-full rounded-md !py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            {it.icon && <span className="text-lg">{it.icon}</span>}
                                            <span>{it.label}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 !pb-4">
                        {/* فقط وقتی منو باز است نمایش داده شود */}
                        {open && (
                            <div>
                                {/*<div className="text-sm text-zinc-600 dark:text-zinc-400">نمایش</div>*/}
                                <ThemeToggle />
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

// // app/components/ui/HamburgerMenu.tsx
// 'use client';
// import React, {useState} from 'react';
// import Link from 'next/link';
// import {MdMenu, MdClose} from 'react-icons/md';
// import ThemeToggle from '@/app/components/theme/ThemeToggle';
// import type {ReactNode} from 'react';
//
// interface MenuItem {
//     label: string;
//     href: string;
//     icon?: ReactNode;
// }
//
// interface HamburgerMenuProps {
//     items?: MenuItem[];
//     className?: string;
// }
//
// export default function HamburgerMenu({items, className = ''}: HamburgerMenuProps) {
//     const [open, setOpen] = useState(false);
//
//     const defaultItems: MenuItem[] = [
//         {label: 'داشبورد', href: '/'},
//         {label: 'اشخاص', href: '/clients'},
//         {label: 'کالا و خدمات', href: '/products'},
//     ];
//
//     const menuItems = items ?? defaultItems;
//
//     return (
//         <>
//             {/* دکمهٔ منو - سمت راست */}
//             <div className={`fixed right-4 top-4 z-50 ${className}`}>
//                 <button
//                     aria-label={open ? 'بستن منو' : 'باز کردن منو'}
//                     aria-expanded={open}
//                     onClick={() => setOpen((s) => !s)}
//                     className="p-2 rounded-md bg-card text-card-foreground shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                 >
//                     {open ? <MdClose size={22}/> : <MdMenu size={22}/>}
//                 </button>
//             </div>
//
//             {/* اوورلی وقتی منو باز است */}
//             <div
//                 aria-hidden={!open}
//                 className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
//                 onClick={() => setOpen(false)}
//             />
//
//             {/* پنل از سمت راست اسلاید می‌شود */}
//             <aside
//                 className={`fixed right-0 top-0 z-50 h-full w-72 max-w-full transform bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-lg transition-transform duration-200
//           ${open ? 'translate-x-0' : 'translate-x-full'}`}
//                 aria-hidden={!open}
//             >
//                 <div className="flex h-full flex-col p-4">
//                     <div className="mb-2 flex items-center justify-between">
//                         <div className="text-lg font-semibold">منو</div>
//                         <button
//                             aria-label="بستن منو"
//                             onClick={() => setOpen(false)}
//                             className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
//                         >
//                             <MdClose size={20}/>
//                         </button>
//                     </div>
//
//                     <nav className="mb-4 flex-1 overflow-auto">
//                         <ul className="space-y-1">
//                             {menuItems.map((it) => (
//                                 <li key={it.href}>
//                                     <Link
//                                         href={it.href}
//                                         onClick={() => setOpen(false)}
//                                         className="block w-full rounded-md !px-3 !py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
//                                     >
//                                         <div className="flex items-center gap-3">
//                                             {it.icon && <span className="text-lg">{it.icon}</span>}
//                                             <span>{it.label}</span>
//                                         </div>
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </nav>
//
//                     <div className="!mt-auto border-t border-zinc-200 dark:border-zinc-800 !pt-3">
//                         <div className="flex items-center justify-between gap-2">
//                             <div className="text-sm text-zinc-600 dark:text-zinc-400">نمایش</div>
//                             <ThemeToggle/>
//                         </div>
//                     </div>
//                 </div>
//             </aside>
//         </>
//     );
// }