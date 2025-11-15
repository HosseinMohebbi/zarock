'use client';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {MdAdd, MdReceipt} from "react-icons/md";
import { GetAllInvoicesResponse } from "@/services/invoice/invoice.types";
import { getAllInvoice } from "@/services/invoice/invoice.service";

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

// تبدیل نوع فاکتور به فارسی
function getInvoiceTypeFa(type?: string): string {
    if (!type) return "نامشخص";
    const map: Record<string, string> = {
        PreInvoice: "پیش فاکتور",
        Invoice: "فاکتور",
    };
    return map[type] ?? type;
}

// محاسبه قیمت نهایی با تخفیف و مالیات
function calculateFinalPrice(items: any[], discountPercent: number, taxPercent: number): number {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = (totalPrice * discountPercent) / 100;
    const tax = ((totalPrice - discount) * taxPercent) / 100;
    return totalPrice - discount + tax;
}

export default function InvoicesPage() {
    const params = useParams();
    const router = useRouter();
    const businessId = (params as any)?.businessId ?? "";

    const [invoices, setInvoices] = useState<GetAllInvoicesResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId) return;
        let mounted = true;

        async function fetchInvoices() {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllInvoice({ page: 1, pageSize: 50 }, businessId);
                console.log(data);
                if (!mounted) return;
                setInvoices(data);
            } catch (err: any) {
                console.error("Failed to load invoices:", err);
                setError("خطا در دریافت فاکتورها");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchInvoices();
        return () => {
            mounted = false;
        };
    }, [businessId]);

    const handleAddInvoice = () => {
        router.push(`/business/${businessId}/invoices/add-invoice`);
    };

    return (
        <main className="!p-4">
            {/* header */}
            <div className="flex items-center justify-between mt-6 !mb-4 !px-3">
                <h1 className="text-lg font-semibold text-right">فاکتورها</h1>
                <button
                    onClick={handleAddInvoice}
                    aria-label="افزودن کالا"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded shadow-sm cursor-pointer"
                >
                    <MdAdd className="w-5 h-5"/>
                </button>
            </div>

            {loading && <div className="!py-6 text-center">در حال دریافت فاکتورها...</div>}
            {error && <div className="!py-4 text-red-600">{error}</div>}
            {!loading && invoices.length === 0 && !error && (
                <div className="!py-6 text-center text-gray-500">فاکتوری وجود ندارد.</div>
            )}

            {/* list */}
            <div
                // className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 !pb-4 lg:grid-cols-3"
                className="!px-3 !mt-4 flex flex-col gap-4 overflow-y-auto md:flex-row flex-wrap gap-6 !pb-4"
            >
                {invoices.map(inv => (
                    <div
                        key={inv.id}
                        className="w-full bg-card rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                        style={{
                            minWidth: '300px', // حداقل عرض کارت‌ها
                            maxWidth: '450px', // حداکثر عرض کارت‌ها
                        }}
                    >
                        <div className="flex items-stretch h-full">

                            {/* باکس راست */}
                            <div
                                className="flex flex-col items-center justify-center w-auto bg-blue-500 text-white !p-2 rounded-r-lg">
                                <div className="!mb-1">
                                    <MdReceipt size={22} />
                                </div>
                                <span className="text-lg font-semibold">{getInvoiceTypeFa(inv.type)}</span>
                                <span>{inv.number ?? "-"}</span>
                            </div>

                            {/* محتوای اصلی */}
                            <div className="flex-1 !p-3">
                                <div className="flex flex-col gap-4 !p-4">
                                    <div className="flex gap-2 text-lg">
                                        <h2>خریدار: </h2>
                                        <span>{inv.fromClient?.fullname ?? "نامشخص"}</span>
                                    </div>

                                    <div className="flex gap-2 text-lg">
                                        <h2>فروشنده: </h2>
                                        <span>{inv.toClient?.fullname ?? "نامشخص"}</span>
                                    </div>

                                    <div className="flex gap-2 text-lg">
                                        <h2>تاریخ: </h2>
                                        <span>{formatJalali(inv.dateTime)}</span>
                                    </div>

                                    {/* نمایش آیتم‌های فاکتور */}
                                    <div className="flex gap-2 text-lg flex-wrap">
                                        <h2 className="text-lg">آیتم‌ها:</h2>
                                        <div className="flex gap-2 text-lg">
                                            {inv.items.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-1 text-sm bg-gray-200 !rounded-md !p-1">
                                                    <span>{item.fullName}:</span>
                                                    <span>{item.quantity} {item.quantityMetric}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* محاسبه قیمت نهایی */}
                                    <div className="flex gap-2 text-lg mt-4">
                                        <h2>قیمت نهایی: </h2>
                                        <span>{Math.ceil(calculateFinalPrice(inv.items, inv.discountPercent, inv.taxPercent)).toLocaleString()} تومان</span>
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
// import Card from "@/app/components/ui/Card";
// import {useParams} from "next/navigation";
// import {MdReceipt} from "react-icons/md";
// import {GetAllInvoicesResponse} from "@/services/invoice/invoice.types";
// import {getAllInvoice} from "@/services/invoice/invoice.service";
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
// // تبدیل نوع فاکتور به فارسی
// function getInvoiceTypeFa(type?: string): string {
//     if (!type) return "نامشخص";
//     const map: Record<string, string> = {
//         PreInvoice: "پیش فاکتور",
//         Invoice: "فاکتور",
//     };
//     return map[type] ?? type;
// }
//
// // محاسبه قیمت نهایی با تخفیف و مالیات
// function calculateFinalPrice(items: any[], discountPercent: number, taxPercent: number): number {
//     const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     const discount = (totalPrice * discountPercent) / 100;
//     const tax = ((totalPrice - discount) * taxPercent) / 100;
//     return totalPrice - discount + tax;
// }
//
// export default function InvoicesPage() {
//     const params = useParams();
//     const businessId = (params as any)?.businessId ?? "";
//
//     const [invoices, setInvoices] = useState<GetAllInvoicesResponse[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//
//     useEffect(() => {
//         if (!businessId) return;
//         let mounted = true;
//
//         async function fetchInvoices() {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const data = await getAllInvoice({page: 1, pageSize: 50}, businessId);
//                 console.log(data);
//                 if (!mounted) return;
//                 setInvoices(data);
//             } catch (err: any) {
//                 console.error("Failed to load invoices:", err);
//                 setError("خطا در دریافت فاکتورها");
//             } finally {
//                 if (mounted) setLoading(false);
//             }
//         }
//
//         fetchInvoices();
//         return () => {
//             mounted = false;
//         };
//     }, [businessId]);
//
//     return (
//         <main className="!p-4">
//             {/* header */}
//             <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
//                 <h1 className="text-lg font-semibold">فاکتورها</h1>
//             </div>
//
//             {loading && <div className="!py-6 text-center">در حال دریافت فاکتورها...</div>}
//             {error && <div className="!py-4 text-red-600">{error}</div>}
//             {!loading && invoices.length === 0 && !error && (
//                 <div className="!py-6 text-center text-gray-500">فاکتوری وجود ندارد.</div>
//             )}
//
//             {/* list */}
//             <div
//                 className="
//                 !px-3
//                 !mt-4
//                 grid grid-cols-1 gap-3
//                 overflow-y-auto
//                 md:grid-cols-2
//                 !pb-4
//                 lg:grid-cols-3
//             "
//             >
//                 {invoices.map(inv => (
//                     <div
//                         key={inv.id}
//                         className="w-full bg-card rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
//                     >
//                         <div className="flex items-stretch h-full">
//
//                             {/* باکس راست */}
//                             <div
//                                 className="flex flex-col items-center justify-center w-auto bg-blue-500 text-white !p-2 rounded-r-lg">
//                                 <div className="!mb-1">
//                                     <MdReceipt size={22}/>
//                                 </div>
//                                 <span className="text-lg font-semibold">{getInvoiceTypeFa(inv.type)}</span>
//                                 <span>{inv.number ?? "-"}</span>
//                             </div>
//
//                             {/* محتوای اصلی */}
//                             <div className="flex-1 !p-3">
//                                 <div className="flex flex-col gap-4 !p-4">
//                                     <div className="flex gap-2 text-lg">
//                                         <h2>خریدار: </h2>
//                                         <span>{inv.fromClient?.fullname ?? "نامشخص"}</span>
//                                     </div>
//
//                                     <div className="flex gap-2 text-lg">
//                                         <h2>فروشنده: </h2>
//                                         <span>{inv.toClient?.fullname ?? "نامشخص"}</span>
//                                     </div>
//
//                                     <div className="flex gap-2 text-lg">
//                                         <h2>تاریخ: </h2>
//                                         <span>{formatJalali(inv.dateTime)}</span>
//                                     </div>
//
//                                     {/* نمایش آیتم‌های فاکتور */}
//                                     <div className="flex gap-2 text-lg flex-wrap">
//                                         <h2 className="text-lg">آیتم‌ها:</h2>
//                                         <div className="flex gap-2 text-lg">
//                                             {inv.items.map((item: any) => (
//                                                 <div key={item.id} className="flex items-center gap-1 text-sm bg-gray-200 !rounded-md !p-1">
//                                                     <span>{item.fullName}:</span>
//                                                     <span>{item.quantity} {item.quantityMetric}</span>
//                                                     <span></span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//
//                                     {/* محاسبه قیمت نهایی */}
//                                     <div className="flex gap-2 text-lg mt-4">
//                                         <h2>قیمت نهایی: </h2>
//                                         <span>{Math.ceil(calculateFinalPrice(inv.items, inv.discountPercent, inv.taxPercent)).toLocaleString()} تومان</span>
//                                     </div>
//                                 </div>
//                             </div>
//
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </main>
//     );
// }