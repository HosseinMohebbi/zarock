// 'use client';
// import {useEffect, useState} from "react";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import Card from "@/app/components/ui/Card";
// import Input from "@/app/components/ui/Input";
// import {Client as ClientType} from "@/services/client/client.types"
// import {getAllClients, filterClients} from "@/services/client/client.service";
// import {useParams, useRouter} from "next/navigation";
// import {MdPeople, MdPerson, MdLocationPin, MdAccountBalance, MdAdd} from "react-icons/md";
//
// export default function ClientsPage() {
//     const [clients, setClients] = useState<ClientType[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [searchPattern, setSearchPattern] = useState('');
//     const params = useParams() as { businessId?: string };
//     const businessId = params.businessId ?? '';
//     const router = useRouter();
//     const [tags, setTags] = useState<string[]>([]); // تگ‌ها برای فیلتر
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(50); // تعداد آیتم‌ها در هر صفحه
//
//     console.log(clients);
//     const handleAddClientButton = () => {
//         router.push(`/business/${businessId}/clients/add-client`);
//     }
//
//     const handelEditClient = (clientId: string) => {
//         router.push(`/business/${businessId}/clients/edit-client/${clientId}`);
//     }
//
//
//     const handleSearch = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await filterClients(businessId, {
//                 page,
//                 pageSize,
//                 pattern: searchPattern,
//                 tags,
//             });
//             setClients(data ?? []);
//         } catch (err: any) {
//             console.error("Failed to load items:", err);
//             if (err?.response?.status === 401) {
//                 router.push("/login");
//                 return;
//             }
//             setError(err?.response?.data?.message ?? err?.message ?? "خطای نامشخص");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         if (businessId) handleSearch();  // بارگذاری آیتم‌ها به‌هنگام تغییر در businessId یا فیلترها
//     }, [businessId, searchPattern, tags, page, pageSize]);
//
//     return (
//         <div className="!p-4 !pt-6 flex flex-col gap-2">
//             {/* هدر */}
//             <div className="flex items-center justify-between gap-4 !px-3">
//                 <h1 className="text-lg !font-semibold text-right">لیست مشتریان</h1>
//                 <div
//                     className="flex justify-center items-center w-12 h-12 !rounded-full border border-gray-300 cursor-pointer"
//                     onClick={handleAddClientButton}
//                 >
//                     <MdAdd className="w-8 h-8 text-green-600"/>
//                 </div>
//             </div>
//
//             {/* جستجو */}
//             <div className="!mb-4 !px-3 flex gap-4">
//                 <Input
//                     type="text"
//                     placeholder="جستجو بر اساس نام یا گروه"
//                     value={searchPattern}
//                     onChange={(e) => setSearchPattern(e.target.value)}
//                 />
//             </div>
//
//             {/* وضعیت بارگذاری یا خطا */}
//             {loading && <div className="text-center !py-4">در حال بارگذاری...</div>}
//             {error && <div className="text-center text-red-500 !py-4">{error}</div>}
//
//             {/* لیست مشتریان */}
//             {!loading && !error && clients.length === 0 && (
//                 <div className="!py-6 text-center text-gray-500">مشتری‌ای یافت نشد.</div>
//             )}
//
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
//                             <div className="flex items-center gap-2">
//                                 <MdLocationPin className="w-8 h-8 text-green-600 flex-shrink-0"/>
//                                 <span
//                                     className="text-sm text-gray-600 truncate"
//                                     style={{
//                                         whiteSpace: 'nowrap',
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         flexGrow: 1,  // متن آدرس می‌تونه فضای باقی‌مونده رو پر کنه
//                                     }}
//                                 >
//         {client.address}
//     </span>
//                             </div>
//                             {/*<div className="flex items-center gap-2">*/}
//                             {/*    <MdLocationPin className="w-8 h-8 text-green-600" />*/}
//                             {/*    <span className="text-sm text-gray-600">{client.address}</span>*/}
//                             {/*</div>*/}
//                             <div className="flex items-center gap-2">
//                                 <MdAccountBalance className="w-8 h-8 text-green-600"/>
//                                 <span className="text-lg text-gray-600">
//                                     {client.credits.toLocaleString()} تومان
//                                 </span>
//                             </div>
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

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
    fetchClients,
    selectClients,
    selectClientsLoading,
    selectClientsError,
} from "@/app/store/clientsSlice";

export default function ClientsPage() {
    const dispatch = useDispatch<any>();
    const clients = useSelector(selectClients);
    const loading = useSelector(selectClientsLoading);
    const error = useSelector(selectClientsError);

    const [searchPattern, setSearchPattern] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();

    const [page] = useState(1);
    const [pageSize] = useState(50);

    // 🔥 Load from Redux (instead of API service)
    useEffect(() => {
        if (businessId) {
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

    return (
        <div className="!p-4 !pt-6 flex flex-col gap-2">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 !px-3">
                <h1 className="text-lg !font-semibold text-right">لیست مشتریان</h1>

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

            {/* LOADING & ERROR */}
            {loading && <div className="text-center !py-4">در حال بارگذاری...</div>}
            {error && <div className="text-center text-red-500 !py-4">{error}</div>}

            {/* EMPTY RESULT */}
            {!loading && !error && clients.length === 0 && (
                <div className="!py-6 text-center text-gray-500">مشتری‌ای یافت نشد.</div>
            )}

            {/* CLIENTS LIST */}
            <div
                className="overflow-y-auto !px-3 !py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
            >
                {clients.map((client) => (
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

