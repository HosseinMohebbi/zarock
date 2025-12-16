'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {MdMenu, MdClose, MdKeyboardArrowDown, MdLogout} from 'react-icons/md';
import {useUser} from '@/context/UserContext';
import {useParams, useRouter} from "next/navigation";

export default function HamburgerMenu() {
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const params = useParams() as { businessId?: string }
    const router = useRouter()
    const businessId = params?.businessId ?? ''

    const {user} = useUser();

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_expires");

        setOpen(false);

        router.push("/login");
    };

    return (
        <>
            <div className="fixed right-4 top-4 z-50">
                <button
                    onClick={() => setOpen((s) => !s)}
                    className="!p-2 rounded-md bg-card text-card-foreground shadow-sm hover:shadow-md cursor-pointer"
                >
                    {open ? <MdClose size={22}/> : <MdMenu size={22}/>}
                </button>
            </div>

            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setOpen(false)}
            />

            <aside
                className={`fixed right-0 top-0 z-50 h-full w-72 bg-card shadow-lg transition-transform duration-200
                ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full !px-4 !py-8">

                    <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold">
                            {user ? `${user.username}` : 'منو'}
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                            <MdClose size={20}/>
                        </button>
                    </div>

                    {businessId &&
                        <div className="!mt-4 flex-grow overflow-y-auto">
                            <button
                                onClick={() => setDropdownOpen((d) => !d)}
                                className="flex items-center justify-between w-full text-right !py-2 !px-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                            >
                                <span>بخش‌ها</span>
                                <MdKeyboardArrowDown
                                    className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                    size={20}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all ${
                                    dropdownOpen ? 'max-h-96' : 'max-h-0'
                                }`}
                            >
                                <ul className="!mt-1 !pr-4 space-y-1 text-sm">

                                    <li>
                                        <Link href={`/business/${businessId}/clients`} onClick={() => setOpen(false)}
                                              className="block !py-2 hover:text-primary">
                                            اشخاص
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href={`/business/${businessId}/items`} onClick={() => setOpen(false)}
                                              className="block !py-2 hover:text-primary">
                                            کالا و خدمات
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href={`/business/${businessId}/invoices`} onClick={() => setOpen(false)}
                                              className="block !py-2 hover:text-primary">
                                            فاکتورها
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href={`/business/${businessId}/transactions`}
                                              onClick={() => setOpen(false)}
                                              className="block !py-2 hover:text-primary">
                                            تراکنش‌ها
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href={`/business/${businessId}/projects`} onClick={() => setOpen(false)}
                                              className="block !py-2 hover:text-primary">
                                            پروژه‌ها
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href={`/business/${businessId}/notifications`} onClick={() => setOpen(false)}
                                              className="block !py-2 hover:text-primary">
                                            اعلانات
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    }

                    <div className="absolute bottom-4 mt-auto border-t border-zinc-200 dark:border-zinc-800 !pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full text-right !py-2 !px-3 rounded-md !text-danger cursor-pointer"
                        >
                            <MdLogout className='w-8 h-8'/>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
