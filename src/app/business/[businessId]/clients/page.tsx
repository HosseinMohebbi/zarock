'use client';
import {useEffect, useState} from "react";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import Card from "@/app/components/ui/Card";
import {Client as ClientType, getAllClients} from "@/services/client";
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
        router.push(`/business/${businessId}/clients/edit-client/${clientId}`);
    }

    useEffect(() => {
        async function loadClients() {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllClients(
                    {page: 1, pageSize: 50},
                    businessId
                );
                setClients(data);
            } catch (err: any) {
                console.error("Failed to load clients:", err);
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
        // والد اصلی به صورت یک ستون تمام‌صفحه تا هدر ثابت بمونه و محتوا (لیست) فقط خودش اسکرول کنه
        <div className="w-full h-screen !p-6 bg-background text-foreground font-sans flex flex-col">
            {/* هدر (ثابت) */}
            <div className="flex items-center justify-between gap-2 !my-6 z-10">
                <div className="flex items-center gap-2">
                    <MdPeople className="w-8 h-8 text-green-600"/>
                    <h1 className="text-2xl font-bold">لیست مشتریان</h1>
                </div>
                <div
                    className="flex justify-center items-center w-12 h-12 !rounded-full border b"
                    onClick={handleAddClientButton}>
                    <MdAdd className="w-8 h-8 text-green-600"/>
                </div>
            </div>

            {/* وضعیت بارگذاری / خطا (اختیاری می‌توانید اینها را هم داخل یک بخش هدر نشان دهید) */}
            {loading && <div className="text-sm text-gray-500">در حال بارگذاری...</div>}
            {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
            {!loading && !error && clients.length === 0 && (
                <div className="text-sm text-gray-600">مشتری‌ای یافت نشد.</div>
            )}

            {/* لیست اسکرول‌ایبل: این بخش ارتفاع باقی‌مانده را می‌گیرد و فقط خودش اسکرول می‌کند */}
            <div className="flex justify-center flex-1 overflow-auto w-full">
                <div className="w-[80%] mx-auto flex flex-col md:flex-row md:flex-wrap items-center gap-4 py-3">
                    {clients.map((client) => (
                        <Card key={client.id}
                              customStyle="w-full border rounded-md !p-3 bg-card"
                              onClick={handelEditClient.bind(this, client.id)}
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
                                    <div className="text-sm text-muted-foreground">{client.address}</div>
                                </div>
                                <div className="flex justify-start items-center gap-2">
                                    <MdAccountBalance className="w-8 h-8 text-green-600"/>
                                    <div className="text-lg text-gray-600">{client.credits.toLocaleString()} تومان</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
// 'use client';
// import {useEffect, useState} from "react";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import Card from "@/app/components/ui/Card";
// import {Client as ClientType, getAllClients} from "@/services/client";
// import {useParams, useRouter} from "next/navigation";
// import {MdPeople, MdPerson, MdLocationPin, MdAccountBalance, MdAdd} from "react-icons/md";
//
//
// export default function ClientsPage() {
//     const [clients, setClients] = useState<ClientType[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const params = useParams() as { businessId?: string };
//     const businessId = params.businessId ?? '';
//     const router = useRouter();
//
//     const handleAddClientButton = () => {
//         router.push(`/client/add-client/${businessId}`);
//     }
//
//     const handelEditClient = (clientId: string) => {
//         router.push(`/business/${businessId}/clients/edit-client//${clientId}`);
//     }
//
//     // const handelEditClient = (id: string) => {
//     //     router.push(`/client/edit-client/${businessId}`);
//     // }
//
//     useEffect(() => {
//         async function loadClients() {
//             setLoading(true);
//             setError(null);
//             try {
//                 // استفاده از سرویس به جای fetch مستقیم
//                 const data = await getAllClients(
//                     {page: 1, pageSize: 50},
//                     businessId
//                 );
//                 setClients(data);
//             } catch (err: any) {
//                 console.error("Failed to load clients:", err);
//                 // اگر خطای 401 بود، کاربر را به صفحه لاگین هدایت کنید
//                 if (err?.response?.status === 401) {
//                     router.push('/login');
//                     return;
//                 }
//                 setError(err?.response?.data?.message ?? err?.message ?? "خطای نامشخص");
//             } finally {
//                 setLoading(false);
//             }
//         }
//
//         if (businessId) {
//             loadClients();
//         } else {
//             setError("شناسه کسب‌وکار نامعتبر است.");
//         }
//     }, [businessId, router]);
//
//     return (
//         <div className="w-full h-screen !p-6 bg-background text-foreground font-sans">
//             <div className="flex items-center justify-start gap-2 !my-6">
//                 <MdPeople className="w-8 h-8 text-green-600"/>
//                 <h1 className="text-2xl font-bold">لیست مشتریان</h1>
//             </div>
//
//             {loading && <div className="text-sm text-gray-500">در حال بارگذاری...</div>}
//             {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
//
//             {!loading && !error && clients.length === 0 && (
//                 <div className="text-sm text-gray-600">مشتری‌ای یافت نشد.</div>
//             )}
//
//             <div className="flex flex-col items-center gap-4">
//                 {clients.map((client) => (
//                     <Card key={client.id}
//                          className="w-[80%] border rounded-md !p-3 bg-card"
//                          onClick={handelEditClient.bind(this, client.id)}
//                         // onClick={handelEditClient(client.id)}
//                     >
//                         <div className="flex flex-col justify-start items-start gap-4">
//                             <div className="flex justify-start items-center gap-2">
//                                 <MdPerson className="w-8 h-8 text-green-600"/>
//                                 <div className="text-lg font-medium">{client.fullname}</div>
//                                 <div
//                                     className="text-lg font-medium">{client.isJuridicalPerson ? "(حقوقی)" : "(حقیقی)"}</div>
//                             </div>
//                             <div className="flex justify-start items-center gap-2">
//                                 <MdLocationPin className="w-8 h-8 text-green-600"/>
//                                 <div className="mt-2 text-lg text-gray-700">{client.address}</div>
//                             </div>
//                             <div className="flex justify-start items-center gap-2">
//                                 <MdAccountBalance className="w-8 h-8 text-green-600"/>
//                                 <div className="text-lg text-gray-600">{client.credits.toLocaleString()} تومان</div>
//                             </div>
//                         </div>
//                     </Card>
//                 ))}
//             </div>
//             <div
//                 className="fixed bottom-8 left-4 flex justify-center items-center w-12 h-12  !rounded-full bg-red-300"
//                 onClick={handleAddClientButton}>
//                 <MdAdd className="w-8 h-8 text-green-600"/>
//             </div>
//         </div>
//     );
// }