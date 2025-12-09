// 'use client';
// import {useEffect, useState} from "react";
// import Card from "@/app/components/ui/Card";
// import {useParams, useRouter} from "next/navigation";
// import {MdAdd, MdMoney, MdCheck} from "react-icons/md";
// import {getAllTransactions} from "@/services/transaction/transaction.service";
// import {TransactionType} from "@/services/transaction/transaction.types";
// import Loader from "@/app/components/ui/Loader"
//
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// import "dayjs/locale/fa";
//
// dayjs.extend(jalaliday);
//
// function formatJalali(input?: string | number | Date) {
//     const d = dayjs(input);
//     if (!d.isValid()) return "";
//     return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
// }
//
// function getTransactionTypeFa(type?: string): string {
//     if (!type) return "نامشخص";
//     const map: Record<string, string> = {
//         Cash: "نقدی",
//         Check: "چک",
//     };
//     return map[type] ?? type;
// }
//
// const getItemIcon = (type?: string) => {
//     if (type === "Check") return <MdCheck size={22}/>;
//     if (type === "Cash") return <MdMoney size={22}/>;
//     return null;
// };
//
// const checkStateMap: Record<TransactionType, string> = {
//     None: "پاسی",
//     Passed: "پاس",
//     Bounced: "برگشتی",
//     Expended: "خرج شده",
//     Cashed: "نقدی",
// };
//
// export default function TransactionsPage(): JSX.Element {
//     const [transactions, setTransactions] = useState<any[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isFetching, setIsFetching] = useState<boolean>(true);
//
//     const params = useParams() as { businessId?: string };
//     const businessId = params.businessId ?? "";
//     const router = useRouter();
//
//     const handleAddTransaction = () => {
//         router.push(`/business/${businessId}/transactions/add-transaction`);
//     };
//
//     const handleOpenTransaction = (t: any) => {
//         if (!t.id) return;
//
//         if (t.transactionType === "Cash") {
//             router.push(`/business/${businessId}/transactions/${t.id}/edit/cash`);
//         } else if (t.transactionType === "Check") {
//             router.push(`/business/${businessId}/transactions/${t.id}/edit/check`);
//         }
//     };
//
//     useEffect(() => {
//         async function loadTransactions() {
//             setLoading(true);
//             setError(null);
//             try {
//                 const data = await getAllTransactions({page: 1, pageSize: 50}, businessId);
//                 setTransactions(data ?? []);
//                 setIsFetching(false);
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
//     if (isFetching) {
//         return (
//             <main className="flex items-center justify-center h-screen">
//                 <Loader/>
//             </main>
//         );
//     }
//
//     if (error) {
//         return (
//             <main className="flex items-center justify-center h-screen">
//                 <div className="text-red-600 text-lg">{error}</div>
//             </main>
//         );
//     }
//
//     if (!loading && !error && transactions.length === 0 && !isFetching) {
//         return (
//             <main className="flex flex-col items-center justify-center h-screen gap-4">
//                 <h2 className="text-gray-600 text-xl">
//                     تراکنشی برای نمایش وجود ندارد
//                 </h2>
//
//                 <button
//                     onClick={handleAddTransaction}
//                     className="px-5 py-2 rounded-lg bg-blue-600 text-white shadow"
//                 >
//                     افزودن تراکنش جدید
//                 </button>
//             </main>
//         );
//     }
//
//     return (
//         <main className="!p-4 !pt-24">
//
//             {/* 🔵 HEADER دقیقا مثل صفحه کالاها */}
//             <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
//                 <h1 className="text-lg !font-semibold text-right">تراکنش ‌ها</h1>
//
//                 <div className="flex gap-2">
//                     <button
//                         onClick={handleAddTransaction}
//                         aria-label="افزودن تراکنش"
//                         className="inline-flex items-center gap-2 !px-3 !py-1.5 bg-blue-600 text-white rounded shadow-sm cursor-pointer"
//                     >
//                         <MdAdd className="w-5 h-5"/>
//                     </button>
//                 </div>
//             </div>
//
//             {loading && <div className="!py-6 text-center">در حال بارگذاری...</div>}
//             {error && <div className="!py-4 text-red-600">{error}</div>}
//             {!loading && !error && transactions.length === 0 && (
//                 <div className="!py-6 text-center text-gray-500">تراکنشی یافت نشد.</div>
//             )}
//
//             {/* 🔵 LIST - گرید مشابه کالاها */}
//             <div
//                 className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 !pb-4 lg:grid-cols-3 xl:grid-cols-4"
//                 style={{maxHeight: "calc(100vh - 200px)"}}
//             >
//                 {transactions.map((t: any) => (
//                     <div
//                         key={t.id ?? `${t.createdAt}-${Math.random()}`}
//                         onClick={() => handleOpenTransaction(t)}
//                         className="w-full bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
//                     >
//                         <div className="h-full flex items-stretch">
//
//                             {/* ستون راست — نوع تراکنش */}
//                             <div className="h-full flex flex-col items-center justify-center w-16 
//                         bg-blue-500 text-white !p-2 !rounded-r-lg">
//                                 <div className="!mb-1 text-lg font-bold">
//                                     {getItemIcon(t.transactionType)}
//                                 </div>
//                                 <div className="!mb-1 text-lg font-bold">
//                                     {getTransactionTypeFa(t.transactionType)}
//                                 </div>
//                             </div>
//
//                             {/* بدنه کارت */}
//                             <div className="flex-1 !p-3">
//                                 <div className="flex flex-col gap-4 !p-4">
//
//                                     {/* مبلغ */}
//                                     <div className="flex items-center gap-2 text-lg">
//                                         <h2>مبلغ:</h2>
//                                         <span className="text-base">
//                         {typeof t.amount === "number"
//                             ? t.amount.toLocaleString() + " تومان"
//                             : t.amount ?? "-"}
//                     </span>
//                                     </div>
//
//                                     {(t.fromClient?.fullname) && (
//                                         <div className="flex items-center gap-2 text-lg">
//                                             <h2>مبدا:</h2>
//                                             <span className="text-base">{t.fromClient?.fullname ?? "—"}</span>
//                                         </div>
//                                     )}
//
//                                     {(t.toClient?.fullname) && (
//                                         <div className="flex items-center gap-2 text-lg">
//                                             <h2>مقصد:</h2>
//                                             <span className="text-base">{t.toClient?.fullname ?? "—"}</span>
//                                         </div>
//                                     )}
//
//                                     {t.transactionType === "Check" && t.state && (
//                                         <div className="flex items-center gap-2 text-lg">
//                                             <h2>وضعیت:</h2>
//                                             <span className="text-base">
//                                                 {checkStateMap[t.state as TransactionType] ?? t.state}
//                                             </span>
//                                         </div>
//                                     )}
//
//
//                                     {t.transactionType === "Check" ?
//                                         <div className="flex flex-col gap-2 text-lg">
//                                             <div className="flex items-center gap-2 text-lg">
//                                                 <h2>دریافت: </h2>
//                                                 <span className="text-base">{formatJalali(t.receiveDate)}</span>
//                                             </div>
//                                             <div className="flex items-center gap-2 text-lg">
//                                                 <h2>موعود: </h2>
//                                                 <span className="text-base">{formatJalali(t.dueDate)}</span>
//                                             </div>
//                                         </div> :
//                                         <div className="flex items-center gap-2 text-lg">
//                                             <h2>تاریخ: </h2>
//                                             <span className="text-base">{formatJalali(t.date)}</span>
//                                         </div>
//                                     }
//
//                                     {/* توضیح یا عنوان سند */}
//                                     <div className="flex gap-2 text-lg">
//                                         <h2>توضیح:</h2>
//                                         <span className="text-base">{t.description ?? ""}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//
//         </main>
//     );
// }

'use client';
import {useEffect, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {MdAdd, MdMoney, MdCheck} from "react-icons/md";
import Loader from "@/app/components/ui/Loader";

import {getAllTransactions} from "@/services/transaction/transaction.service";
import {assignTransactionToProject} from "@/services/project/project.service";
import {TransactionType} from "@/services/transaction/transaction.types";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
import TransactionDocument from "@/app/components/ui/TransactionDocument";

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

const checkStateMap: Record<TransactionType, string> = {
    None: "پاسی",
    Passed: "پاس",
    Bounced: "برگشتی",
    Expended: "خرج شده",
    Cashed: "نقدی",
};

export default function TransactionsPage(): JSX.Element {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";

    const router = useRouter();
    const search = useSearchParams();

    const isSelectMode = search.get("selectMode") === "1";
    const projectId = search.get("projectId") ?? "";

    // ❗ در حالت انتخاب تراکنش: انتخاب کارت → لینک و برگشت
    const handleSelectTransaction = async (transaction: any) => {
        if (!isSelectMode || !projectId || !transaction?.id) return;

        try {
            await assignTransactionToProject(
                businessId,
                projectId,
                transaction.id,
                {}
            );
            router.back();
            router.push(`/business/${businessId}/projects/edit-project/${projectId}/transactions`); // بازگشت به صفحه پروژه
        } catch (e) {
            console.error("Failed to assign:", e);
            alert("خطا در لینک کردن تراکنش");
        }
    };

    const handleAddTransaction = () => {
        router.push(`/business/${businessId}/transactions/add-transaction`);
    };

    const handleOpenTransaction = (t: any) => {
        if (!t.id) return;
        if (isSelectMode) return handleSelectTransaction(t);

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
                setIsFetching(false);
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

    if (isFetching) {
        return (
            <main className="flex items-center justify-center h-screen">
                <Loader/>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex items-center justify-center h-screen">
                <div className="text-red-600 text-lg">{error}</div>
            </main>
        );
    }

    // if (!loading && !error && transactions.length === 0 && !isFetching) {
    //     return (
    //         <main className="flex flex-col items-center justify-center h-screen gap-4">
    //             <h2 className="text-gray-600 text-xl">
    //                 تراکنشی برای نمایش وجود ندارد
    //             </h2>
    //
    //             {!isSelectMode && (
    //                 <button
    //                     onClick={handleAddTransaction}
    //                     className="px-5 py-2 rounded-lg bg-blue-600 text-white shadow"
    //                 >
    //                     افزودن تراکنش جدید
    //                 </button>
    //             )}
    //         </main>
    //     );
    // }

    return (
        <main className="!p-4 !pt-24">

            <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
                <h1 className="text-lg !font-semibold text-right">
                    {isSelectMode ? "انتخاب تراکنش" : "تراکنش ‌ها"}
                </h1>

                {!isSelectMode && (
                    <button
                        onClick={handleAddTransaction}
                        aria-label="افزودن تراکنش"
                        className="inline-flex items-center gap-2 !px-3 !py-1.5 bg-blue-600 text-white rounded shadow-sm cursor-pointer"
                    >
                        <MdAdd className="w-5 h-5 text-primary"/>
                    </button>
                )}
            </div>

            {error && <div className="!py-4 text-red-600">{error}</div>}

            {/* گرید کارت‌ها (بدون هیچ تغییر ظاهری) */}
            {/*<div*/}
            {/*    className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 !pb-4 lg:grid-cols-3 xl:grid-cols-4"*/}
            {/*    style={{maxHeight: "calc(100vh - 200px)"}}*/}
            {/*>*/}
            {transactions.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-500 w-full h-[60vh]">
                        <div className="text-center text-xl">هیچ تراکنشی برای نمایش وجود ندارد</div>
                    </div>
                ) :
                (
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

                                    <div className="h-full flex flex-col items-center justify-center w-16 
                                bg-primary text-white !p-2 !rounded-r-lg">
                                        <div className="!mb-1 text-lg font-bold">
                                            {getItemIcon(t.transactionType)}
                                        </div>
                                        <div className="!mb-1 text-lg font-bold">
                                            {getTransactionTypeFa(t.transactionType)}
                                        </div>
                                    </div>

                                    <div className="flex-1 !p-3">
                                        <div className="flex flex-col gap-4 !p-4">
                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>مبلغ:</h2>
                                                <span className="text-base">
                                            {typeof t.amount === "number"
                                                ? t.amount.toLocaleString() + " تومان"
                                                : t.amount ?? "-"}
                                        </span>
                                            </div>

                                            {(t.fromClient?.fullname) && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>مبدا:</h2>
                                                    <span className="text-base">{t.fromClient?.fullname ?? "—"}</span>
                                                </div>
                                            )}

                                            {(t.toClient?.fullname) && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>مقصد:</h2>
                                                    <span className="text-base">{t.toClient?.fullname ?? "—"}</span>
                                                </div>
                                            )}

                                            {t.transactionType === "Check" && t.state && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>وضعیت:</h2>
                                                    <span className="text-base">
                                                {checkStateMap[t.state as TransactionType] ?? t.state}
                                            </span>
                                                </div>
                                            )}

                                            {t.transactionType === "Check" ? (
                                                <div className="flex flex-col gap-2 text-lg">
                                                    <div className="flex items-center gap-2 text-lg">
                                                        <h2>دریافت: </h2>
                                                        <span className="text-base">{formatJalali(t.receiveDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-lg">
                                                        <h2>موعود: </h2>
                                                        <span className="text-base">{formatJalali(t.dueDate)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>تاریخ: </h2>
                                                    <span className="text-base">{formatJalali(t.date)}</span>
                                                </div>
                                            )}

                                            <div className="flex gap-2 text-lg">
                                                <h2>توضیح:</h2>
                                                <span className="text-base">{t.description ?? ""}</span>
                                            </div>

                                            {/*{t.document.id && <div className="flex justify-start">*/}
                                            {/*    <TransactionDocument docId={t.document.id}/>*/}
                                            {/*</div>}*/}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}</div>)}
        </main>
    );
}