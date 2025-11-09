'use client';
import {useEffect, useState} from "react";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import Card from "@/app/components/ui/Card";
import {Client as ClientType, getََAllClients} from "@/services/client";
import {useParams, useRouter} from "next/navigation";
import {MdPeople, MdPerson, MdLocationPin, MdAccountBalance, MdAdd} from "react-icons/md";


export default function ClientsPage() {
    const [clients, setClients] = useState<ClientType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? '';
    const router = useRouter();

    const handleAddClientButton = () => {
        router.push(`/client/add-client/${businessId}`);
    }

    const handelEditClient = (clientId: string) => {
        router.push(`/client/edit-client/${businessId}/${clientId}`);
    }

    // const handelEditClient = (id: string) => {
    //     router.push(`/client/edit-client/${businessId}`);
    // }

    useEffect(() => {
        async function loadClients() {
            setLoading(true);
            setError(null);
            try {
                // استفاده از سرویس به جای fetch مستقیم
                const data = await getََAllClients(
                    {page: 1, pageSize: 50},
                    businessId
                );
                setClients(data);
            } catch (err: any) {
                console.error("Failed to load clients:", err);
                // اگر خطای 401 بود، کاربر را به صفحه لاگین هدایت کنید
                if (err?.response?.status === 401) {
                    router.push('/login');
                    return;
                }
                setError(err?.response?.data?.message ?? err?.message ?? "خطای نامشخص");
            } finally {
                setLoading(false);
            }
        }

        if (businessId) {
            loadClients();
        } else {
            setError("شناسه کسب‌وکار نامعتبر است.");
        }
    }, [businessId, router]);

    return (
        <div className="w-full h-screen !p-6 bg-background text-foreground font-sans">
            <div className="flex items-center justify-start gap-2 !my-6">
                <MdPeople className="w-8 h-8 text-green-600"/>
                <h1 className="text-2xl font-bold">لیست مشتریان</h1>
            </div>

            {loading && <div className="text-sm text-gray-500">در حال بارگذاری...</div>}
            {error && <div className="text-sm text-red-500 mb-4">{error}</div>}

            {!loading && !error && clients.length === 0 && (
                <div className="text-sm text-gray-600">مشتری‌ای یافت نشد.</div>
            )}

            <div className="flex flex-col items-center gap-4">
                {clients.map((client) => (
                    <div key={client.id}
                         className="w-[80%] border rounded-md !p-3 bg-red-500"
                         onClick={handelEditClient.bind(this, client.id)}
                        // onClick={handelEditClient(client.id)}
                    >
                        <div className="flex flex-col justify-start items-start gap-4">
                            <div className="flex justify-start items-center gap-2">
                                <MdPerson className="w-8 h-8 text-green-600"/>
                                <div className="text-lg font-medium">{client.fullname}</div>
                                <div
                                    className="text-lg font-medium">{client.isJuridicalPerson ? "(حقوقی)" : "(حقیقی)"}</div>
                            </div>
                            <div className="flex justify-start items-center gap-2">
                                <MdLocationPin className="w-8 h-8 text-green-600"/>
                                <div className="mt-2 text-lg text-gray-700">{client.address}</div>
                            </div>
                            <div className="flex justify-start items-center gap-2">
                                <MdAccountBalance className="w-8 h-8 text-green-600"/>
                                <div className="text-lg text-gray-600">{client.credits.toLocaleString()} تومان</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="fixed bottom-12 left-4 flex justify-center items-center w-12 h-12  !rounded-full bg-red-300"
                onClick={handleAddClientButton}>
                <MdAdd className="w-8 h-8 text-green-600"/>
            </div>
        </div>
    );
}
// 'use client';
// import { useEffect, useState } from "react";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import Card from "@/app/components/ui/Card";
// import { Client as ClientType } from "@/services/client";
// import {useParams, useRouter} from "next/navigation"; // optional type import — adjust path if needed
//
// export default function ClientsPage() {
//     const [clients, setClients] = useState<ClientType[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const params = useParams() as { businessId?: string };
//     const businessId = params.businessId ?? '';
//     const router = useRouter();
//
//     // TODO: replace this placeholder with the real business id from your app (e.g. from context, props or service)
//
//     useEffect(() => {
//         async function loadClients() {
//             setLoading(true);
//             setError(null);
//             try {
//                 // Adjust page & pageSize as needed
//                 const page = 1;
//                 const pageSize = 50;
//                 const res = await fetch(`/api/client/${businessId}/all?page=${page}&pageSize=${pageSize}`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });
//
//                 if (!res.ok) {
//                     const text = await res.text();
//                     throw new Error(`API error: ${res.status} ${text}`);
//                 }
//
//                 const data: ClientType[] = await res.json();
//                 setClients(data);
//             } catch (err: any) {
//                 console.error("Failed to load clients:", err);
//                 setError(err?.message ?? "خطای نامشخص");
//             } finally {
//                 setLoading(false);
//             }
//         }
//
//         if (businessId !== "REPLACE_WITH_BUSINESS_ID") {
//             loadClients();
//         } else {
//             // If business id not set, avoid calling API and show hint
//             setError("Business id مشخص نشده — مقدار BUSINESS_ID را جایگزین کنید.");
//         }
//     }, [businessId]);
//
//     return (
//         <div className="w-full min-h-screen p-6 bg-background text-foreground font-sans">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-bold">لیست مشتریان</h1>
//                 <ThemeToggle />
//             </div>
//
//             {/*<Card customStyle="w-full p-4">*/}
//                 {loading && <div className="text-sm text-gray-500">در حال بارگذاری...</div>}
//                 {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
//
//                 {!loading && !error && clients.length === 0 && (
//                     <div className="text-sm text-gray-600">مشتری‌ای یافت نشد.</div>
//                 )}
//
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {clients.map((c) => (
//                         <div key={c.id} className="border rounded-md p-3 bg-card">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <div className="text-lg font-medium">{c.fullname}</div>
//                                     <div className="text-sm text-gray-500">{c.nationalCode}</div>
//                                 </div>
//                                 <div className="text-sm text-gray-600">{c.credits} تومان</div>
//                             </div>
//                             <div className="mt-2 text-sm text-gray-700">{c.address}</div>
//                         </div>
//                     ))}
//                 </div>
//             {/*</Card>*/}
//         </div>
//     );
// }

// 'use client';
// import {useState} from "react";
// import {cn} from "@/utils/cn";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import Card from "@/app/components/ui/Card";
// import {Car, Wallet} from "lucide-react"
// import {MdPeople, MdInventory, MdReceiptLong, MdAccountBalanceWallet, MdWork, MdEditNote, MdWarehouse, MdPayments } from "react-icons/md";
//
// export default function Home() {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     return (
//         <div className="w-full h-full">
//             Clients
//         </div>
//     );
// }
//
