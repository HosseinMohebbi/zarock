// 'use client';
//
// import {MdBusiness, MdPerson, MdLogout, MdAdd, MdEdit} from 'react-icons/md';
// import {useRouter} from 'next/navigation';
// import {useState, useEffect} from 'react';
// import {useUser} from '@/context/UserContext';
// import CreateBusinessModal from "@/app/components/ui/modals/CreateBusinessModal";
// import {getAllBusiness} from "@/services/business/business.service";
// import {Business} from "@/services/business/business.types";
// import EditBusinessModal from "@/app/components/ui/modals/EditBusinessModal";
//
// export default function BusinessPage(): JSX.Element {
//     const router = useRouter();
//     const {user, loading, signOut} = useUser();
//
//     const [openModal, setOpenModal] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [selectedBizId, setSelectedBizId] = useState<string | null>(null);
//     const [biz, setBiz] = useState<Business[]>([]);
//     const [bizLoading, setBizLoading] = useState<boolean>(true);
//     const [bizError, setBizError] = useState<string | null>(null);
//
//     const [page, setPage] = useState<number>(1);
//     const [pageSize, setPageSize] = useState<number>(50);
//
//     useEffect(() => {
//         if (!loading && !user) router.replace('/login');
//     }, [loading, user, router]);
//
//     useEffect(() => {
//         if (loading || !user) return;
//
//         let cancelled = false;
//         (async () => {
//             try {
//                 setBizLoading(true);
//                 setBizError(null);
//                 const data = await getAllBusiness({page, pageSize});
//                 if (!cancelled) setBiz(data ?? []);
//             } catch (err: any) {
//                 if (!cancelled) setBizError(err?.message || 'خطا در دریافت بیزینس‌ها');
//             } finally {
//                 if (!cancelled) setBizLoading(false);
//             }
//         })();
//
//         return () => {
//             cancelled = true;
//         };
//     }, [loading, user, page, pageSize]);
//
//     if (loading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
//     if (!user) return <></>;
//
//     const handleProfileClick = () => router.push('/edit-user');
//     const handleLogout = () => {
//         signOut();
//         router.replace('/login');
//     };
//     const handleAddBusiness = () => setOpenModal(true);
//    
//     const handleEditBusiness = (e, id) => {
//         e.stopPropagation();
//         setSelectedBizId(id);
//         setEditModalOpen(true);
//     };
//
//     const refreshBusinesses = async () => {
//         try {
//             const data = await getAllBusiness({ page, pageSize });
//             setBiz(data ?? []);
//         } catch (err: any) {
//             setBizError(err?.message || "خطا در دریافت بیزینس‌ها");
//         }
//     };
//
//     return (
//         <div className="!p-4 !pt-24 flex flex-col gap-2">
//
//             {/* HEADER */}
//             <div className="flex items-center justify-between gap-4 !px-3">
//                 <h1 className="text-lg !font-semibold text-right">کسب و کارها</h1>
//                 <div
//                     className="flex justify-center items-center w-12 h-12 !rounded-full border border-gray-300 cursor-pointer"
//                     onClick={handleAddBusiness}
//                 >
//                     <MdAdd className="w-8 h-8 text-green-600"/>
//                 </div>
//             </div>
//
//             {/* LOADING & ERROR */}
//             {bizLoading && <div className="text-center !py-4">در حال بارگذاری...</div>}
//             {bizError && <div className="text-center text-red-500 !py-4">{bizError}</div>}
//
//             {/* EMPTY */}
//             {!bizLoading && !bizError && biz.length === 0 && (
//                 <div className="!py-6 text-center text-gray-500">در این صفحه بیزینسی یافت نشد.</div>
//             )}
//
//             {/* BUSINESS LIST */}
//             {!bizLoading && !bizError && biz.length > 0 && (
//                 <div
//                     className="overflow-y-auto !px-3 !py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//                     style={{maxHeight: 'calc(100vh - 200px)'}}
//                 >
//                     {biz.map((b) => (
//                         <div
//                             key={b.id}
//                             className="group flex flex-col items-start gap-3 !rounded-xl border bg-card text-foreground !p-4 text-left shadow-sm hover:shadow-md transition cursor-pointer w-full"
//                             onClick={() => router.push(`/business/${b.id}`)}
//                         >
//                             {/* کارت‌ها بدون تغییر */}
//                             <div className="w-full flex justify-beetween items-center !mt-1 !p-2">
//                                 <div className="flex items-center justify-center w-full gap-4">
//                                     <div className="w-12 h-12 !rounded-lg bg-green-100">
//                                         <MdBusiness className="w-full h-full text-green-700"/>
//                                     </div>
//                                     <div className="flex items-center justify-between text-xl w-full">
//                                         <h3 className="font-semibold group-hover:text-green-700 truncate"
//                                             title={b.name}>
//                                             {b.name}
//                                         </h3>
//                                     </div>
//                                 </div>
//                                 <div className="w-9 h-9 flex justify-center items-center !rounded-full bg-green-100 cursor-pointer" onClick={(e) => handleEditBusiness(e, b.id)}>
//                                     <MdEdit className="w-6 h-6 text-green-700"/>
//                                 </div>
//                             </div>
//
//                             <div className="flex flex-col items-start w-full">
//                                 <div className="flex justify-start items-baseline gap-2 text-xl w-full">
//                                     <p className="text-lg font-semibold flex-shrink-0">توضیحات:</p>
//                                     <p
//                                         className="mt-1 text-md truncate"
//                                         style={{maxWidth: 'calc(100% - 100px)'}}
//                                         title={b.description}
//                                     >
//                                         {b.description}
//                                     </p>
//                                 </div>
//                                 <div className="flex justify-start items-center gap-2 !mt-2 text-xl w-full">
//                                     <p className="text-lg font-semibold">ساخت:</p>
//                                     <p className="mt-1 text-md">
//                                         {new Date(b.createdAt).toLocaleDateString('fa-IR')}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//
//             <CreateBusinessModal open={openModal} onClose={() => setOpenModal(false)} onCreated={refreshBusinesses}/>
//             <EditBusinessModal
//                 open={editModalOpen}
//                 onClose={() => setEditModalOpen(false)}
//                 businessId={selectedBizId}
//                 onUpdated={refreshBusinesses}
//             />
//         </div>
//     );
// }

'use client';
import {MdBusiness, MdPerson, MdLogout, MdAdd, MdEdit} from 'react-icons/md';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {useUser} from '@/context/UserContext';
import CreateBusinessModal from "@/app/components/ui/modals/CreateBusinessModal";
import {getAllBusiness} from "@/services/business/business.service";
import {Business} from "@/services/business/business.types";
import EditBusinessModal from "@/app/components/ui/modals/EditBusinessModal";
import BusinessLogo from "@/app/components/ui/BusinessLogo";
import Loader from "@/app/components/ui/Loader"

export default function BusinessPage(): JSX.Element {
    const router = useRouter();
    const {user, loading, signOut} = useUser();

    const [openModal, setOpenModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedBizId, setSelectedBizId] = useState<string | null>(null);
    const [biz, setBiz] = useState<Business[]>([]);
    const [bizLoading, setBizLoading] = useState<boolean>(true);
    const [bizError, setBizError] = useState<string | null>(null);

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(50);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    useEffect(() => {
        if (loading || !user) return;

        let cancelled = false;
        (async () => {
            try {
                setBizLoading(true);
                setBizError(null);
                const data = await getAllBusiness({page, pageSize});
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

    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <Loader/>
    </div>;
    if (!user) return <></>;
    
    const handleAddBusiness = () => setOpenModal(true);

    const handleEditBusiness = (e, id) => {
        e.stopPropagation();
        setSelectedBizId(id);
        setEditModalOpen(true);
    };

    const refreshBusinesses = async () => {
        try {
            const data = await getAllBusiness({page, pageSize});
            setBiz(data ?? []);
        } catch (err: any) {
            setBizError(err?.message || "خطا در دریافت بیزینس‌ها");
        }
    };

    return (
        <div className="!p-4 !pt-24 flex flex-col gap-2">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 !px-3">
                <h1 className="text-lg !font-semibold text-right">کسب و کارها</h1>
                <div
                    className="flex justify-center items-center w-12 h-12 !rounded-full border border-gray-300 cursor-pointer"
                    onClick={handleAddBusiness}
                >
                    <MdAdd className="w-8 h-8 text-green-600"/>
                </div>
            </div>

            {/* LOADING & ERROR */}
            {/*{bizLoading && <div className="text-center !py-4">در حال بارگذاری...</div>}*/}
            {bizError && <div className="text-center text-red-500 !py-4">{bizError}</div>}

            {/* EMPTY */}
            {!bizLoading && !bizError && biz.length === 0 && (
                <div className="!py-6 text-center text-gray-500">کسب و کاری یافت نشد!</div>
            )}

            {/* BUSINESS LIST */}
            {!bizLoading && !bizError && biz.length > 0 && (
                <div
                    className="overflow-y-auto !px-3 !py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    style={{maxHeight: 'calc(100vh - 200px)'}}
                >
                    {biz.map((b) => (
                        <div
                            key={b.id}
                            className="group flex flex-col items-start gap-3 rounded-xl border bg-card text-foreground !p-4 text-left shadow-sm hover:shadow-md transition cursor-pointer w-full"
                            onClick={() => router.push(`/business/${b.id}`)}
                        >
                            {/* --- ROW 1: LOGO + EDIT BUTTON --- */}
                            <div className="w-full flex justify-between items-center">
                                <BusinessLogo logoId={b.logo?.id}/>

                                <div
                                    className="w-10 h-10 flex justify-center items-center rounded-full bg-green-100 cursor-pointer"
                                    onClick={(e) => handleEditBusiness(e, b.id)}
                                >
                                    <MdEdit className="w-6 h-6 text-green-700"/>
                                </div>
                            </div>

                            {/* --- BUSINESS NAME --- */}
                            <div className="flex justify-start items-baseline gap-2 text-xl w-full">
                                <p className="text-lg font-semibold flex-shrink-0">نام:</p>
                                <h3 className="font-semibold group-hover:text-green-700 truncate"
                                    title={b.name}>
                                    {b.name}
                                </h3>
                            </div>

                            {/* --- DESCRIPTION --- */}
                            <div className="flex justify-start items-baseline gap-2 text-xl w-full">
                                <p className="text-lg font-semibold flex-shrink-0">توضیحات:</p>
                                <p className="mt-1 text-md truncate" style={{maxWidth: 'calc(100% - 100px)'}}
                                   title={b.description}>
                                    {b.description}
                                </p>
                            </div>

                            {/* --- CREATED DATE --- */}
                            <div className="flex justify-start items-center gap-2 !mt-2 text-xl w-full">
                                <p className="text-lg font-semibold">ساخت:</p>
                                <p className="mt-1 text-md">
                                    {new Date(b.createdAt).toLocaleDateString('fa-IR')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <CreateBusinessModal open={openModal} onClose={() => setOpenModal(false)} onCreated={refreshBusinesses}/>
            <EditBusinessModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                businessId={selectedBizId}
                onUpdated={refreshBusinesses}
            />
        </div>
    );
}

