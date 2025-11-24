'use client';
import {useEffect, useState} from "react";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import Card from "@/app/components/ui/Card";
import {useParams, useRouter} from "next/navigation";
import {MdAdd, MdMoney, MdCheck} from "react-icons/md";
import {getAllTransactions} from "@/services/transaction/transaction.service";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";

dayjs.extend(jalaliday);

function formatJalali(input?: string | number | Date) {
    const d = dayjs(input);
    if (!d.isValid()) return "";
    return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
}

function getTransactionTypeFa(type?: string): string {
    if (!type) return "نامشخص";
    const map: Record<string, string> = {
        Cash: "نقدی",
        Check: "چک",
    };
    return map[type] ?? type;
}

const getItemIcon = (type?: string) => {
    if (type === "Check") return <MdCheck size={22}/>;
    if (type === "Cash") return <MdMoney size={22}/>;
    return null;
};

export default function TransactionsPage(): JSX.Element {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";
    const router = useRouter();

    const handleAddTransaction = () => {
        router.push(`/business/${businessId}/transactions/add-transaction`);
    };

    const handleOpenTransaction = (t: any) => {
        if (!t.id) return;

        if (t.transactionType === "Cash") {
            router.push(`/business/${businessId}/transactions/${t.id}/edit/cash`);
        } else if (t.transactionType === "Check") {
            router.push(`/business/${businessId}/transactions/${t.id}/edit/check`);
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
        <main className="!p-4">

            {/* 🔵 HEADER دقیقا مثل صفحه کالاها */}
            <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
                <h1 className="text-lg !font-semibold text-right">تراکنش ‌ها</h1>

                <div className="flex gap-2">
                    <button
                        onClick={handleAddTransaction}
                        aria-label="افزودن تراکنش"
                        className="inline-flex items-center gap-2 !px-3 !py-1.5 bg-blue-600 text-white rounded shadow-sm cursor-pointer"
                    >
                        <MdAdd className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            {loading && <div className="!py-6 text-center">در حال بارگذاری...</div>}
            {error && <div className="!py-4 text-red-600">{error}</div>}
            {!loading && !error && transactions.length === 0 && (
                <div className="!py-6 text-center text-gray-500">تراکنشی یافت نشد.</div>
            )}

            {/* 🔵 LIST - گرید مشابه کالاها */}
            <div
                className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 !pb-4 lg:grid-cols-3 xl:grid-cols-4"
                style={{maxHeight: "calc(100vh - 200px)"}}
            >
                {transactions.map((t: any) => (
                    <div
                        key={t.id ?? `${t.createdAt}-${Math.random()}`}
                        onClick={() => handleOpenTransaction(t)}
                        className="w-full bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                    >
                        <div className="h-full flex items-stretch">

                            {/* ستون راست — نوع تراکنش */}
                            <div className="h-full flex flex-col items-center justify-center w-16 
                        bg-blue-500 text-white !p-2 !rounded-r-lg">
                                <div className="!mb-1 text-lg font-bold">
                                    {getItemIcon(t.transactionType)}
                                </div>
                                <div className="!mb-1 text-lg font-bold">
                                    {getTransactionTypeFa(t.transactionType)}
                                </div>
                            </div>

                            {/* بدنه کارت */}
                            <div className="flex-1 !p-3">
                                <div className="flex flex-col gap-4 !p-4">

                                    {/* مبلغ */}
                                    <div className="flex items-center gap-2 text-lg">
                                        <h2>مبلغ:</h2>
                                        <span className="text-base">
                        {typeof t.amount === "number"
                            ? t.amount.toLocaleString() + " تومان"
                            : t.amount ?? "-"}
                    </span>
                                    </div>


                                    {/* مبدأ → مقصد */}
                                    {(t.fromClient?.fullname || t.toClient?.fullname) && (
                                        <div className="text-base text-gray-700">
                                            {t.fromClient?.fullname ?? "—"} ← {t.toClient?.fullname ?? "—"}
                                        </div>
                                    )}

                                    {t.transactionType === "Check" ?
                                        <div className="flex flex-col gap-2 text-lg">
                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>دریافت: </h2>
                                                <span className="text-base">{formatJalali(t.receiveDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>موعود: </h2>
                                                <span className="text-base">{formatJalali(t.dueDate)}</span>
                                            </div>
                                        </div> :
                                        <div className="flex items-center gap-2 text-lg">
                                            <h2>تاریخ: </h2>
                                            <span className="text-base">{formatJalali(t.date)}</span>
                                        </div>
                                    }

                                    {/* توضیح یا عنوان سند */}
                                    <div className="flex gap-2 text-lg">
                                        <h2>توضیح:</h2>
                                        <span className="text-base">{t.document?.title ?? t.description ?? ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </main>
    );
}

// 'use client';
// import {useEffect, useState} from "react";
// import ThemeToggle from "@/app/components/theme/ThemeToggle";
// import Card from "@/app/components/ui/Card";
// import {useParams, useRouter} from "next/navigation";
// import {MdReceipt, MdAdd, MdArrowLeft} from "react-icons/md";
// import {getAllTransactions} from "@/services/transaction";
//
// // 📅 برای تاریخ شمسی
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// import "dayjs/locale/fa";
//
// dayjs.extend(jalaliday);
//
// // 📅 فقط تاریخ شمسی (بدون ساعت)
// function formatJalali(input?: string | number | Date) {
//     const d = dayjs(input);
//     if (!d.isValid()) return "";
//     return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
// }
//
// // 🔤 تبدیل نوع تراکنش به فارسی
// function getTransactionTypeFa(type?: string): string {
//     if (!type) return "نامشخص";
//     const map: Record<string, string> = {
//         Cash: "نقدی",
//         Check: "چک",
//     };
//     return map[type] ?? type;
// }
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
//         router.push(`/business/${businessId}/transactions/add`);
//     };
//
//     const handleOpenTransaction = (t: any) => {
//         if (!t.id) return;
//
//         if (t.transactionType === "Cash") {
//             router.push(`/business/${businessId}/transactions/${t.id}/edit/cash`);
//         } else if (t.transactionType === "Check") {
//             router.push(`/business/${businessId}/transactions/${t.id}/edit/check`);
//         } else {
//             console.warn("نوع تراکنش ناشناخته:", t.transactionType);
//         }
//     };
//
//
//     useEffect(() => {
//         async function loadTransactions() {
//             setLoading(true);
//             setError(null);
//             try {
//                 const data = await getAllTransactions({page: 1, pageSize: 50}, businessId);
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
//                     <MdReceipt className="text-2xl"/>
//                     <h1 className="text-2xl font-semibold">تراکنش‌ها</h1>
//                 </div>
//
//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={handleAddTransaction}
//                         className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded"
//                     >
//                         <MdAdd/> جدید
//                     </button>
//                     <ThemeToggle/>
//                 </div>
//             </div>
//
//             <Card customStyle='bg-red-400'>
//                 {loading && <div className="py-6 text-center">در حال بارگذاری...</div>}
//
//                 {error && (
//                     <div className="py-4 text-red-600">{error}</div>
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
//                             onClick={() => handleOpenTransaction(t)}
//                             className="cursor-pointer flex justify-between items-center p-3 border rounded hover:shadow transition"
//                         >
//                             <div className='flex'>
//                                 <div className="flex justify-center items-center text-sm text-gray-600">
//                                     {getTransactionTypeFa(t.transactionType)}
//                                 </div>
//                                 <div className='flex flex-col'>
//                                     <div className="flex items-center gap-1 font-semibold">
//                                         <h2>مبلغ:</h2>
//                                         {typeof t.amount === "number"
//                                             ? t.amount.toLocaleString()
//                                             : t.amount ?? "-"}
//                                         <div>تومان</div>
//                                     </div>
//                                     <div className="font-medium">
//                                         {t.document?.title ?? t.description ?? "بدون توضیح"}
//                                     </div>
//                                     <div className="text-xs text-gray-500 mt-1">
//                                         {/* مبدأ → مقصد */}
//                                         {t.fromClient?.fullname || t.toClient?.fullname
//                                             ? `${t.fromClient?.fullname ?? "—"} → ${t.toClient?.fullname ?? "—"}`
//                                             : ""}
//                                     </div>
//                                     <div className="text-right">
//                                         <div className="text-xs text-gray-500">
//                                             {t.flowType ?? ""} · {t.createdAt ? formatJalali(t.createdAt) : ""}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                            
//                         </div>
//                     ))}
//                 </div>
//             </Card>
//         </main>
//     );
// }