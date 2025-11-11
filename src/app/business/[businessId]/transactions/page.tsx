'use client';
import {useEffect, useState} from "react";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import Card from "@/app/components/ui/Card";
import {useParams, useRouter} from "next/navigation";
import {MdReceipt, MdAdd, MdArrowLeft} from "react-icons/md";
import {getAllTransactions} from "@/services/transaction";

// 📅 برای تاریخ شمسی
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";

dayjs.extend(jalaliday);

// 📅 فقط تاریخ شمسی (بدون ساعت)
function formatJalali(input?: string | number | Date) {
    const d = dayjs(input);
    if (!d.isValid()) return "";
    return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
}

// 🔤 تبدیل نوع تراکنش به فارسی
function getTransactionTypeFa(type?: string): string {
    if (!type) return "نامشخص";
    const map: Record<string, string> = {
        Cash: "نقدی",
        Check: "چک",
    };
    return map[type] ?? type;
}

export default function TransactionsPage(): JSX.Element {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";
    const router = useRouter();

    const handleAddTransaction = () => {
        router.push(`/business/${businessId}/transactions/add`);
    };

    const handleOpenTransaction = (t: any) => {
        if (!t.id) return;

        if (t.transactionType === "Cash") {
            router.push(`/business/${businessId}/transactions/${t.id}/edit/cash`);
        } else if (t.transactionType === "Check") {
            router.push(`/business/${businessId}/transactions/${t.id}/edit/check`);
        } else {
            console.warn("نوع تراکنش ناشناخته:", t.transactionType);
        }
    };


    useEffect(() => {
        async function loadTransactions() {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllTransactions({page: 1, pageSize: 50}, businessId);
                setTransactions(data ?? []);
            } catch (err: any) {
                console.error("Failed to load transactions:", err);
                if (err?.response?.status === 401) {
                    router.push("/login");
                    return;
                }
                setError(err?.response?.data?.message ?? err?.message ?? "خطای نامشخص");
            } finally {
                setLoading(false);
            }
        }

        if (businessId) loadTransactions();
    }, [businessId, router]);

    return (
        <main className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <MdReceipt className="text-2xl"/>
                    <h1 className="text-2xl font-semibold">تراکنش‌ها</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAddTransaction}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded"
                    >
                        <MdAdd/> جدید
                    </button>
                    <ThemeToggle/>
                </div>
            </div>

            <Card customStyle='bg-red-400'>
                {loading && <div className="py-6 text-center">در حال بارگذاری...</div>}

                {error && (
                    <div className="py-4 text-red-600">{error}</div>
                )}

                {!loading && !error && transactions.length === 0 && (
                    <div className="py-6 text-center text-gray-500">تراکنشی یافت نشد.</div>
                )}

                <div className="flex flex-col gap-3">
                    {transactions.map((t: any) => (
                        <div
                            key={t.id ?? `${t.createdAt}-${Math.random()}`}
                            onClick={() => handleOpenTransaction(t)}
                            className="cursor-pointer flex justify-between items-center p-3 border rounded hover:shadow transition"
                        >
                            <div className='flex'>
                                <div className="flex justify-center items-center text-sm text-gray-600">
                                    {getTransactionTypeFa(t.transactionType)}
                                </div>
                                <div className='flex flex-col'>
                                    <div className="flex items-center gap-1 font-semibold">
                                        <h2>مبلغ:</h2>
                                        {typeof t.amount === "number"
                                            ? t.amount.toLocaleString()
                                            : t.amount ?? "-"}
                                        <div>تومان</div>
                                    </div>
                                    <div className="font-medium">
                                        {t.document?.title ?? t.description ?? "بدون توضیح"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {/* مبدأ → مقصد */}
                                        {t.fromClient?.fullname || t.toClient?.fullname
                                            ? `${t.fromClient?.fullname ?? "—"} → ${t.toClient?.fullname ?? "—"}`
                                            : ""}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">
                                            {t.flowType ?? ""} · {t.createdAt ? formatJalali(t.createdAt) : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </Card>
        </main>
    );
}


// 'use client';
// import { useEffect, useState } from "react";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import Card from "@/app/components/ui/Card";
// import { useParams, useRouter } from "next/navigation";
// import { MdReceipt, MdAdd } from "react-icons/md";
// import { getAllTransactions } from "@/services/transaction";
//
// export default function TransactionsPage(): JSX.Element {
//     const [transactions, setTransactions] = useState<any[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//
//     const params = useParams() as { businessId?: string };
//     const businessId = params.businessId ?? "";
//     const router = useRouter();
//
//     const handleAddTransaction = () => {
//         // مسیر اضافه کردن تراکنش را مطابق ساختار پروژه‌تان تنظیم کنید
//         router.push(`/business/${businessId}/transactions/add`);
//     };
//
//     const handleOpenTransaction = (id: string) => {
//         router.push(`/business/${businessId}/transactions/${id}`);
//     };
//
//     useEffect(() => {
//         async function loadTransactions() {
//             setLoading(true);
//             setError(null);
//             try {
//                 const data = await getAllTransactions({ page: 1, pageSize: 50 }, businessId);
//                 console.log(data);
//                 setTransactions(data ?? []);
//             } catch (err: any) {
//                 console.error("Failed to load transactions:", err);
//                 if (err?.response?.status === 401) {
//                     router.push("/login");
//                     return;
//                 }
//                 setError(err?.response?.data?.message ?? err?.message ?? "خطای نامشخص");
//             } finally {
//                 setLoading(false);
//             }
//         }
//
//         if (businessId) loadTransactions();
//     }, [businessId, router]);
//
//     return (
//         <main className="p-4">
//             <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                     <MdReceipt className="text-2xl" />
//                     <h1 className="text-2xl font-semibold">تراکنش‌ها</h1>
//                 </div>
//
//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={handleAddTransaction}
//                         className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded"
//                     >
//                         <MdAdd /> جدید
//                     </button>
//                     <ThemeToggle />
//                 </div>
//             </div>
//
//             <Card>
//                 {loading && <div className="py-6 text-center">در حال بارگذاری...</div>}
//
//                 {error && (
//                     <div className="py-4 text-red-600">
//                         {error}
//                     </div>
//                 )}
//
//                 {!loading && !error && transactions.length === 0 && (
//                     <div className="py-6 text-center text-gray-500">تراکنشی یافت نشد.</div>
//                 )}
//
//                 <div className="flex flex-col gap-3">
//                     {transactions.map((t: any) => (
//                         <div
//                             key={t.id ?? `${t.createdAt}-${Math.random()}`}
//                             onClick={() => t.id && handleOpenTransaction(t.id)}
//                             className="cursor-pointer flex justify-between items-center p-3 border rounded hover:shadow"
//                         >
//                             <div>
//                                 <div className="text-sm text-gray-600">{t.transactionType ?? "نوع نامعلوم"}</div>
//                                 <div className="font-medium">{t.document?.title ?? t.description ?? "بدون توضیح"}</div>
//                                 <div className="text-xs text-gray-500 mt-1">
//                                     {t.fromClient?.fullname ? `${t.fromClient.fullname} →  ${t.toClient?.fullname ?? "—"}` : (t.fromClient ?? t.toClient ?? "")}
//                                 </div>
//                             </div>
//
//                             <div className="text-right">
//                                 <div className="font-semibold">
//                                     {typeof t.amount === "number" ? t.amount.toLocaleString() : t.amount ?? "-"}
//                                 </div>
//                                 <div className="text-xs text-gray-500">
//                                     {t.flowType ?? ""} · {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </Card>
//         </main>
//     );
// }