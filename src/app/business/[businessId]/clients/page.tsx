// 'use client';
//
// import {useEffect, useState} from "react";
// import Card from "@/app/components/ui/Card";
// import Input from "@/app/components/ui/Input";
// import {useParams, useRouter} from "next/navigation";
// import {MdPerson, MdLocationPin, MdAccountBalance, MdAdd} from "react-icons/md";
//
// // Redux
// import {useDispatch, useSelector} from "react-redux";
// import {
//     fetchClients,
//     selectClients,
//     selectClientsLoading,
//     selectClientsError,
// } from "@/app/store/clientsSlice";
//
// const isJuridicalPersonFa = (juridicalStatus: boolean) => {
//     if (juridicalStatus) {
//         return 'حقوقی';
//     } else {
//         return 'حقیقی'
//     }
// }
//
// export default function ClientsPage() {
//     const dispatch = useDispatch<any>();
//     const clients = useSelector(selectClients);
//     const loading = useSelector(selectClientsLoading);
//     const error = useSelector(selectClientsError);
//
//     const [searchPattern, setSearchPattern] = useState('');
//     const [tags, setTags] = useState<string[]>([]);
//
//     const params = useParams() as { businessId?: string };
//     const businessId = params.businessId ?? '';
//     const router = useRouter();
//
//     const [page] = useState(1);
//     const [pageSize] = useState(50);
//
//     // 🔥 Load from Redux (instead of API service)
//     useEffect(() => {
//         if (businessId) {
//             dispatch(
//                 fetchClients({
//                     businessId,
//                     pattern: searchPattern,
//                     tags,
//                     page,
//                     pageSize
//                 })
//             );
//         }
//     }, [businessId, searchPattern, tags, page, pageSize]);
//
//     const handleAddClientButton = () => {
//         router.push(`/business/${businessId}/clients/add-client`);
//     };
//
//     const handelEditClient = (clientId: string) => {
//         router.push(`/business/${businessId}/clients/edit-client/${clientId}`);
//     };
//
//     return (
//         <div className="!p-4 !pt-6 flex flex-col gap-2">
//             {/* HEADER */}
//             <div className="flex items-center justify-between gap-4 !px-3">
//                 <h1 className="text-lg !font-semibold text-right">لیست مشتریان</h1>
//
//                 <div
//                     className="flex justify-center items-center w-12 h-12 !rounded-full border border-gray-300 cursor-pointer"
//                     onClick={handleAddClientButton}
//                 >
//                     <MdAdd className="w-8 h-8 text-green-600"/>
//                 </div>
//             </div>
//
//             {/* SEARCH BOX */}
//             <div className="!mb-4 !px-3 flex gap-4">
//                 <Input
//                     type="text"
//                     placeholder="جستجو بر اساس نام یا گروه"
//                     value={searchPattern}
//                     onChange={(e) => setSearchPattern(e.target.value)}
//                 />
//             </div>
//
//             {/* LOADING & ERROR */}
//             {loading && <div className="text-center !py-4">در حال بارگذاری...</div>}
//             {error && <div className="text-center text-red-500 !py-4">{error}</div>}
//
//             {/* EMPTY RESULT */}
//             {!loading && !error && clients.length === 0 && (
//                 <div className="!py-6 text-center text-gray-500">مشتری‌ای یافت نشد.</div>
//             )}
//
//             {/* CLIENTS LIST */}
//             <div
//                 className="overflow-y-auto !px-3 !py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//                 style={{maxHeight: 'calc(100vh - 250px)'}}
//             >
//                 {clients.map((client) => (
//                     <Card
//                         key={client.id}
//                         customStyle="w-full max-w-xl border !rounded-md !p-4 bg-card cursor-pointer"
//                         onClick={() => handelEditClient(client.id)}
//                     >
//                         <div className="flex flex-col gap-3">
//                             <div className="flex items-center gap-2">
//                                 <MdPerson className="w-8 h-8 text-green-600"/>
//                                 <span className="text-lg font-medium">{client.fullname}</span>
//                             </div>
//
//                             <div className="flex items-center gap-2">
//                                 <MdLocationPin className="w-8 h-8 text-green-600 flex-shrink-0"/>
//                                 <span
//                                     className="text-sm text-gray-600 truncate"
//                                     style={{
//                                         whiteSpace: 'nowrap',
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         flexGrow: 1,
//                                     }}
//                                 >
//                                     {client.address}
//                                 </span>
//                             </div>
//
//                             <div className="flex items-center gap-2">
//                                 <MdAccountBalance className="w-8 h-8 text-green-600"/>
//                                 <span className="text-lg text-gray-600">
//                                     {(client.credits ?? 0).toLocaleString()} تومان
//                                 </span>
//                             </div>
//
//                         </div>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }

'use client';

import { useEffect, useState } from "react";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import { useParams, useRouter } from "next/navigation";
import { MdPerson, MdLocationPin, MdAccountBalance, MdAdd } from "react-icons/md";
import {Client} from "@/services/client/client.types"

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
    fetchClients,
    selectClients,
    selectClientsLoading,
    selectClientsError,
} from "@/app/store/clientsSlice";

// Loader
import Loader from "@/app/components/ui/Loader";   // ← کامپوننت TailChase شما

export default function ClientsPage() {

    const dispatch = useDispatch<any>();
    const clients = useSelector(selectClients);
    const loading = useSelector(selectClientsLoading);
    const error = useSelector(selectClientsError);
    const [isFetching, setIsFetching] = useState(true);

    const [searchPattern, setSearchPattern] = useState('');
    const [tags] = useState<string[]>([]);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();

    const [page] = useState(1);
    const [pageSize] = useState(50);

    useEffect(() => {
        if (businessId) {
            setIsFetching(false);
            dispatch(
                fetchClients({
                    businessId,
                    pattern: searchPattern,
                    tags,
                    page,
                    pageSize
                })
            );
        }
    }, [businessId, searchPattern, tags, page, pageSize]);

    const handleAddClientButton = () => {
        router.push(`/business/${businessId}/clients/add-client`);
    };

    const handelEditClient = (clientId: string) => {
        router.push(`/business/${businessId}/clients/edit-client/${clientId}`);
    };

    // -----------------------------
    // 🔥 LOADING STATE → فقط اسپینر
    // -----------------------------
    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader />   {/* TailChase */}
            </div>
        );
    }

    // --------------------------------------------
    // 🔥 WHEN NO CLIENTS → پیام وسط صفحه، بدون سرچ
    // --------------------------------------------
    if (!loading && !error && clients.length === 0 && !isFetching) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <h2 className="text-gray-600 text-xl">هیچ شخصی برای نمایش وجود ندارد</h2>
            </div>
        );
    }

    return (
        <div className="!p-4 !pt-24 flex flex-col gap-2">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 !px-3">
                <h1 className="text-lg !font-semibold text-right">اشخاص</h1>

                <div
                    className="flex justify-center items-center w-12 h-12 !rounded-full border border-gray-300 cursor-pointer"
                    onClick={handleAddClientButton}
                >
                    <MdAdd className="w-8 h-8 text-green-600" />
                </div>
            </div>

            {/* SEARCH BOX */}
            <div className="!mb-4 !px-3 flex gap-4">
                <Input
                    type="text"
                    placeholder="جستجو بر اساس نام یا گروه"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                />
            </div>

            {/* ERROR */}
            {error && (
                <div className="text-center text-red-500 !py-4">{error}</div>
            )}

            {/* CLIENTS LIST */}
            <div
                className="overflow-y-auto !px-3 !py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
            >
                {clients.map((client: Client) => (
                    <Card
                        key={client.id}
                        customStyle="w-full max-w-xl border !rounded-md !p-4 bg-card cursor-pointer"
                        onClick={() => handelEditClient(client.id)}
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <MdPerson className="w-8 h-8 text-green-600" />
                                <span className="text-lg font-medium">{client.fullname}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MdLocationPin className="w-8 h-8 text-green-600 flex-shrink-0" />
                                <span
                                    className="text-sm text-gray-600 truncate"
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        flexGrow: 1,
                                    }}
                                >
                                    {client.address}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MdAccountBalance className="w-8 h-8 text-green-600" />
                                <span className="text-lg text-gray-600">
                                    {(client.credits ?? 0).toLocaleString()} تومان
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}


