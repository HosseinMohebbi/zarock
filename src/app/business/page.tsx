'use client';

import {MdBusiness, MdPerson, MdLogout, MdAdd} from 'react-icons/md';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {useUser} from '@/context/UserContext';
import CreateBusinessModal from "@/app/components/ui/modals/CreateBusinessModal";
import {getََAllBusinesses, type Business} from "@/services/business";

export default function BusinessPage(): JSX.Element {
    const router = useRouter();
    const {user, loading, signOut} = useUser();

    const [openModal, setOpenModal] = useState(false);
    const [biz, setBiz] = useState<Business[]>([]);
    const [bizLoading, setBizLoading] = useState<boolean>(true);
    const [bizError, setBizError] = useState<string | null>(null);

    // 🔢 صفحه‌بندی
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    // گارد لاگین
    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    // دریافت لیست بیزینس‌ها با صفحه‌بندی
    useEffect(() => {
        if (loading || !user) return;

        let cancelled = false;
        (async () => {
            try {
                setBizLoading(true);
                setBizError(null);
                const data = await getََAllBusinesses({page, pageSize});
                console.log(data);
                if (!cancelled) setBiz(data ?? []);
            } catch (err: any) {
                if (!cancelled) setBizError(err?.message || 'خطا در دریافت بیزینس‌ها');
            } finally {
                if (!cancelled) setBizLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [loading, user, page, pageSize]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
    if (!user) return <></>;

    const handleProfileClick = () => router.push('/edit-user');
    const handleLogout = () => {
        signOut();
        router.replace('/login');
    };

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center w-full h-12 !px-4">
                <button onClick={handleLogout} title="خروج"><MdLogout className="w-8 h-8 text-green-600"/></button>
                <div className="font-medium text-lg">{user.username}</div>
                <button onClick={handleProfileClick}><MdPerson className="w-8 h-8 text-green-600"/></button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
                {/* کنترل‌های صفحه‌بندی */}
                {/*<div className="mb-4 flex items-center gap-3">*/}
                {/*    <div className="flex items-center gap-2">*/}
                {/*        <button*/}
                {/*            onClick={() => setPage((p) => Math.max(1, p - 1))}*/}
                {/*            className="px-3 py-1 rounded border hover:bg-zinc-50"*/}
                {/*            disabled={page === 1 || bizLoading}*/}
                {/*        >*/}
                {/*            قبلی*/}
                {/*        </button>*/}
                {/*        <span className="text-sm">صفحه: {page}</span>*/}
                {/*        <button*/}
                {/*            onClick={() => setPage((p) => p + 1)}*/}
                {/*            className="px-3 py-1 rounded border hover:bg-zinc-50"*/}
                {/*            disabled={bizLoading}*/}
                {/*        >*/}
                {/*            بعدی*/}
                {/*        </button>*/}
                {/*    </div>*/}

                {/*    <div className="ms-4 flex items-center gap-2">*/}
                {/*        <label className="text-sm">تعداد در صفحه</label>*/}
                {/*        <select*/}
                {/*            className="border rounded px-2 py-1 bg-white"*/}
                {/*            value={pageSize}*/}
                {/*            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}*/}
                {/*            disabled={bizLoading}*/}
                {/*        >*/}
                {/*            <option value={5}>5</option>*/}
                {/*            <option value={10}>10</option>*/}
                {/*            <option value={20}>20</option>*/}
                {/*        </select>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* حالات */}
                {bizLoading && (
                    <div className="flex items-center justify-center h-40">
                        <span>در حال دریافت بیزینس‌ها…</span>
                    </div>
                )}

                {!bizLoading && bizError && (
                    <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {bizError}
                    </div>
                )}

                {!bizLoading && !bizError && biz.length === 0 && (
                    <div className="mx-auto max-w-xl rounded-lg border bg-card p-6 text-center">
                        در این صفحه بیزینسی یافت نشد.
                    </div>
                )}

                {!bizLoading && !bizError && biz.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 !mx-auto">
                        {biz.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => router.push(`/business/${b.id}`)}
                                className="w-[80%] group flex flex-col items-start gap-3 !rounded-xl border bg-white !p-4 text-left shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex gap-4 mt-1 p-2">
                                    <div className="w-12 h-12 rounded-lg bg-green-100">
                                        <MdBusiness className="w-full h-full text-green-700"/>
                                    </div>
                                    <div className="flex items-center justify-between text-xl">
                                        <h3 className="font-semibold text-zinc-900 group-hover:text-green-700">
                                            {b.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start">
                                    {b.description && (
                                        <div className="flex justify-start items-center gap-2 text-xl">
                                            <p className="text-md font-light">توضیحات: </p>
                                            <p className="mt-1 text-xl text-zinc-600 line-clamp-2">{b.description}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-start items-center gap-2 !mt-2 text-xl">
                                        <p className="text-md font-light">ساخت: </p>
                                        <p className="mt-1 text-xl text-zinc-600 line-clamp-2">
                                            {new Date(b.createdAt).toLocaleDateString('fa-IR')}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setOpenModal(true)}
                className="fixed bottom-6 left-6 w-12 h-12 flex justify-center items-center rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg"
                title="ایجاد بیزینس"
            >
                <MdAdd className="w-8 h-8 text-green-600"/>
            </button>

            <CreateBusinessModal open={openModal} onClose={() => setOpenModal(false)}/>
        </div>
    );
}

// 'use client';
//
// import { MdBusiness, MdPerson, MdLogout, MdAdd } from 'react-icons/md';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { useUser } from '@/context/UserContext';
// import CreateBusinessModal from "@/app/components/ui/modals/CreateBusinessModal";
//
// export default function BusinessPage(): JSX.Element {
//     const router = useRouter();
//     const { user, loading, signOut } = useUser();
//     const [openModal, setOpenModal] = useState(false);
//
//     // گارد: اگر توکن معتبر نیست یا user هنوز لود نشده، هندل کن
//     useEffect(() => {
//         // وقتی لودینگ تموم شد و کاربری نداریم → به لاگین
//         if (!loading && !user) {
//             router.replace('/login');
//         }
//     }, [loading, user, router]);
//
//     if (loading) {
//         return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
//     }
//
//     if (!user) return null;
//
//     const handleProfileClick = () => router.push('/edit-user');
//     const handleLogout = () => {
//         signOut();
//         router.replace('/login');
//     };
//
//     return (
//         <div className="w-full h-screen flex flex-col">
//             {/* Header */}
//             <div className="flex justify-between items-center w-full h-12 !px-4">
//                 <div onClick={handleProfileClick} className="cursor-pointer">
//                     <MdPerson className="w-8 h-8 text-green-600" />
//                 </div>
//                 <div className="font-medium">{user.username}</div>
//                 <button onClick={handleLogout} title="خروج">
//                     <MdLogout className="w-8 h-8 text-green-600" />
//                 </button>
//             </div>
//
//             {/* Content */}
//             <div className="flex-1 flex items-center justify-center">
//                 <div className="p-6 bg-card rounded shadow">Protected Business Page</div>
//             </div>
//
//             {/* Floating Button */}
//             <div  onClick={() => setOpenModal(true)} className="absolute bottom-6 left-6 w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center rounded-full bg-green-600 cursor-pointer">
//                 <MdAdd className="w-8 h-8 text-white" />
//             </div>
//             <CreateBusinessModal open={openModal} onClose={() => setOpenModal(false)} />
//         </div>
//     );


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
// }
