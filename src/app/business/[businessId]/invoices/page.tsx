'use client';
import {useEffect, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {MdAdd, MdReceipt} from "react-icons/md";
import Loader from "@/app/components/ui/Loader";
import {useDispatch, useSelector} from "react-redux";
import {fetchInvoices, selectInvoices} from "@/app/store/invoivesSlice";

// API برای لینک‌کردن به پروژه
import {assignInvoiceToProject} from "@/services/project/project.service";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";

dayjs.extend(jalaliday);

function formatJalali(input?: string | number | Date) {
    const d = dayjs(input);
    if (!d.isValid()) return "";
    return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
}

function getInvoiceTypeFa(type?: string): string {
    if (!type) return "نامشخص";
    return ({
        PreInvoice: "پیش فاکتور",
        Invoice: "فاکتور",
    })[type] ?? type;
}

function calculateFinalPrice(items: any[], discountPercent: number, taxPercent: number): number {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = (totalPrice * discountPercent) / 100;
    const tax = ((totalPrice - discount) * taxPercent) / 100;
    return totalPrice - discount + tax;
}

export default function InvoicesPage() {
    const params = useParams();
    const businessId = (params as any)?.businessId ?? "";

    const router = useRouter();
    const search = useSearchParams();

    const dispatch = useDispatch<any>();

    const invoices = useSelector(selectInvoices);
    const loading = useSelector((s: any) => s.invoices.loading);
    const error = useSelector((s: any) => s.invoices.error);

    const [isFetching, setIsFetching] = useState(true);

    // 🔵 حالت انتخاب مشابه تراکنش‌ها
    const isSelectMode = search.get("selectMode") === "1";
    const projectId = search.get("projectId") ?? "";

    useEffect(() => {
        if (!businessId) return;
        setIsFetching(false);

        if (invoices.length > 0) return;

        dispatch(fetchInvoices({businessId}));
    }, [businessId]);

    // 🔵 انتخاب یک فاکتور → لینک به پروژه → برگشت
    const handleSelectInvoice = async (invoice: any) => {
        if (!isSelectMode || !projectId) return;

        try {
            await assignInvoiceToProject(
                businessId,
                projectId,
                invoice.id,
                {}
            );

            router.back();
            router.push(`/business/${businessId}/projects/edit-project/${projectId}/invoices`);
        } catch (e) {
            console.error(e);
            alert("خطا در لینک‌کردن فاکتور");
        }
    };

    const handleAddInvoice = () => {
        router.push(`/business/${businessId}/invoices/add-invoice`);
    };

    const handleOpenInvoice = (invoice: any) => {
        if (!invoice?.id) return;

        if (isSelectMode) return handleSelectInvoice(invoice);

        router.push(`/business/${businessId}/invoices/edit-invoice/${invoice.id}`);
    };

    if (isFetching) {
        return (
            <main className="flex items-center justify-center h-screen">
                <Loader/>
            </main>
        );
    }

    // if (!loading && invoices.length === 0) {
    //     return (
    //         <main className="flex flex-col items-center justify-center h-[70vh] gap-4">
    //             <h2 className="text-gray-600 text-xl">هیچ فاکتوری برای نمایش وجود ندارد</h2>
    //         </main>
    //     );
    // }

    return (
        <main className="!p-4 !pt-24">
            {/* header مثل نسخه دوم */}
            <div className="flex items-center justify-between mt-6 !mb-4 !px-3">
                <h1 className="!text-lg !font-semibold text-right">
                    {isSelectMode ? "انتخاب فاکتور" : "فاکتورها"}
                </h1>

                {!isSelectMode && (
                    <button
                        onClick={handleAddInvoice}
                        aria-label="افزودن فاکتور"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded shadow-sm cursor-pointer"
                    >
                        <MdAdd className="w-5 h-5 text-primary"/>
                    </button>
                )}
            </div>

            {error && <div className="!py-4 text-red-600">{error}</div>}

            {/* لیست کارت‌ها → دقیقا استایل نسخه دوم */}
            {invoices.length === 0 ? (
                <div className="flex items-center justify-center text-gray-500 w-full h-[60vh]">
                    <div className="text-center text-xl">هیچ فاکتوری برای نمایش وجود ندارد</div>
                </div>
            ) : (
                <div
                    className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 !pb-4 lg:grid-cols-3 2xl:grid-cols-4"
                    style={{
                        maxHeight: "calc(100vh - 200px)",
                        overflowY: "auto",
                    }}
                >{invoices.map(inv => (
                    <div
                        key={inv.id}
                        className="w-full bg-card rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                        style={{
                            minWidth: "300px",
                        }}
                        onClick={() => handleOpenInvoice(inv)}
                    >
                        <div className="flex items-stretch h-full">

                            {/* ستون آبی — عین نسخه دوم */}
                            <div
                                className="flex flex-col items-center justify-center w-32 bg-blue-500 text-white !p-2 rounded-r-lg">
                                <div className="!mb-1">
                                    <MdReceipt size={22}/>
                                </div>
                                <span className="text-lg font-semibold">{getInvoiceTypeFa(inv.type)}</span>
                                <span>{inv.number ?? "-"}</span>
                            </div>

                            {/* محتوای کارت — عین نسخه دوم */}
                            <div className="flex-1 !p-2">
                                <div className="flex flex-col gap-4 !p-4">

                                    <div className="flex items-center flex-wrap gap-2 text-lg">
                                        <h2>خریدار:</h2>
                                        <span className="text-base">{inv.fromClient?.fullname ?? "نامشخص"}</span>
                                    </div>

                                    <div className="flex items-center flex-wrap gap-2 text-lg">
                                        <h2>فروشنده:</h2>
                                        <span className="text-base">{inv.toClient?.fullname ?? "نامشخص"}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-lg">
                                        <h2>تاریخ:</h2>
                                        <span className="text-base">{formatJalali(inv.dateTime)}</span>
                                    </div>

                                    <div className="flex gap-2 text-lg flex-wrap">
                                        <h2 className="text-lg">اقلام:</h2>
                                        <div className="flex flex-wrap gap-2 text-lg">
                                            {inv.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-1 text-sm bg-gray-200 dark:bg-gray-400 !rounded-md !p-1"
                                                >
                                                    <span>{item.fullName}:</span>
                                                    <span>{item.quantity} {item.quantityMetric}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center flex-wrap gap-2 text-lg mt-4">
                                        <h2>قیمت نهایی:</h2>
                                        <span className="text-base">
                                    {Math.ceil(
                                        calculateFinalPrice(inv.items, inv.discountPercent, inv.taxPercent)
                                    ).toLocaleString()} تومان
                                </span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                ))}</div>)}
        </main>
    );
}
