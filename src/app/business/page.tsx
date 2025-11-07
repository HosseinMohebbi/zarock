'use client';

import { MdBusiness, MdPerson, MdLogout, MdAdd } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import CreateBusinessModal from "@/app/components/ui/modals/CreateBusinessModal";

export default function BusinessPage(): JSX.Element {
    const router = useRouter();
    const { user, loading, signOut } = useUser();
    const [openModal, setOpenModal] = useState(false);

    // گارد: اگر توکن معتبر نیست یا user هنوز لود نشده، هندل کن
    useEffect(() => {
        // وقتی لودینگ تموم شد و کاربری نداریم → به لاگین
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user, router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
    }

    if (!user) return null;

    const handleProfileClick = () => router.push('/edit-user');
    const handleLogout = () => {
        signOut();
        router.replace('/login');
    };

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center w-full h-12 !px-4">
                <div onClick={handleProfileClick} className="cursor-pointer">
                    <MdPerson className="w-8 h-8 text-green-600" />
                </div>
                <div className="font-medium">{user.username}</div>
                <button onClick={handleLogout} title="خروج">
                    <MdLogout className="w-8 h-8 text-green-600" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center">
                <div className="p-6 bg-card rounded shadow">Protected Business Page</div>
            </div>

            {/* Floating Button */}
            <div  onClick={() => setOpenModal(true)} className="absolute bottom-6 left-6 w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center rounded-full bg-green-600 cursor-pointer">
                <MdAdd className="w-8 h-8 text-white" />
            </div>
            <CreateBusinessModal open={openModal} onClose={() => setOpenModal(false)} />
        </div>
    );


    // return (
    //     <div className="w-full h-screen">
    //         <div className="flex justify-between items-center w-full h-12 p-4">
    //             <div onClick={handleProfileClick} className="cursor-pointer">
    //                 <MdPerson className="w-8 h-8 text-green-600" />
    //             </div>
    //             <div className="font-medium">{user.username}</div>
    //
    //             <button onClick={handleLogout} title="خروج">
    //                 <MdLogout className="w-8 h-8 text-green-600" />
    //             </button>
    //         </div>
    //
    //         <div className="h-full flex items-center justify-center">
    //             <div className="p-6 bg-card rounded shadow">Protected Business Page</div>
    //         </div>
    //         <div className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-300">
    //         <MdAdd className="w-8 h-8 text-green-600" />
    //         </div>
    //     </div>
    // );
}


// 'use client';
//
// import {useEffect, useState} from 'react';
// import {useRouter} from 'next/navigation';
// import {MdBusiness, MdPerson, MdLogout} from "react-icons/md";
// import Card from "@/app/components/ui/Card";
//
// const BusinessPage = () => {
//     const router = useRouter();
//     const [checking, setChecking] = useState(true);
//     const [authorized, setAuthorized] = useState(false);
//
//     useEffect(() => {
//         const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
//         const expires = typeof window !== 'undefined' ? localStorage.getItem('auth_expires') : null;
//
//         if (!token) {
//             router.replace('/login');
//             return;
//         }
//
//         if (expires) {
//             const exp = new Date(expires);
//             if (isNaN(exp.getTime()) || exp.getTime() <= Date.now()) {
//                 localStorage.removeItem('auth_token');
//                 localStorage.removeItem('auth_expires');
//                 router.replace('/login');
//                 return;
//             }
//         }
//
//         setAuthorized(true);
//         setChecking(false);
//     }, [router]);
//
//     if (checking) {
//         return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
//     }
//
//     if (!authorized) return null;
//    
//     const handleProfileClick = () => {
//         router.push('/edit-user');
//     }
//
//     return (
//         <div className='w-full h-full'>
//             <div className="flex justify-between items-center w-full h-12 p-4">
//                 <div onClick={handleProfileClick}>
//                     <MdPerson className="w-8 h-8 text-green-600"/>
//                 </div>
//                 <div>test</div>
//                 <MdLogout className="w-8 h-8 text-green-600"/>
//             </div>
//             <div className="min-h-screen flex items-center justify-center">
//
//                 <div className="p-6 bg-card rounded shadow">
//                     {/*<Card icon={<MdBusiness className="w-8 h-8 text-green-600" />}/>*/}
//                     Protected Business Page
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default BusinessPage;