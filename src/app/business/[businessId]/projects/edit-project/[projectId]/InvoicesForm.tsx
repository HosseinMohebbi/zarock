'use client';
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { toast } from "react-toastify";
import {MdReceiptLong, MdDelete, MdAdd} from "react-icons/md";

import {
    getProjectInvoices,
    assignInvoiceToProject,
    removeInvoiceFromProject,
} from "@/services/project/project.service"; // فرض بر این است که این توابع را داری

// برای تاریخ شمسی (مثل صفحات قبل)
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
dayjs.extend(jalaliday);

function formatJalali(input?: string | number | Date) {
    const d = dayjs(input);
    if (!d.isValid()) return "";
    return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
}

export default function ProjectInvoicesPage() {
    const params = useParams() as { businessId: string; projectId: string };
    const businessId = params.businessId;
    const projectId = params.projectId;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [linkedInvoices, setLinkedInvoices] = useState<any[]>([]);
    console.log(linkedInvoices);
    const [showConfirm, setShowConfirm] = useState(false);
    const [invoiceToRemove, setInvoiceToRemove] = useState<string | null>(null);

    // load
    async function loadData() {
        setLoading(true);
        try {
            const data = await getProjectInvoices(businessId, projectId, { page: 1, pageSize: 50 });
            setLinkedInvoices(data ?? []);
        } catch (err) {
            console.error("Failed to load invoices:", err);
            toast.error("خطا در بارگذاری فاکتورها");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // باز کردن صفحه فاکتورها در حالت انتخاب (selectMode)
    const handleAddInvoice = () => {
        router.push(`/business/${businessId}/invoices?selectMode=1&projectId=${projectId}`);
    };

    function handleOpenConfirmModal(invoiceId: string) {
        setInvoiceToRemove(invoiceId);
        setShowConfirm(true);
    }

    async function handleConfirmRemove() {
        if (!invoiceToRemove) return;

        try {
            await removeInvoiceFromProject(businessId, projectId, invoiceToRemove);

            // حذف فوری از UI بدون رفرش کامل
            setLinkedInvoices(prev => prev.filter(inv => inv.id !== invoiceToRemove));

            toast.success("فاکتور از پروژه حذف شد");
        } catch (err) {
            console.error(err);
            toast.error("خطا در حذف فاکتور");
        } finally {
            setShowConfirm(false);
            setInvoiceToRemove(null);
        }
    }

    // حالت selectMode زمانی که کاربر از صفحه فاکتورها آمد برای انتخاب فاکتور جهت لینک به پروژه:
    // (این مسیر/کامپوننتی که لیست تمام فاکتورها را نشان می‌دهد باید در صورت selectMode، با assignInvoiceToProject تماس بزند)
    // این صفحه فقط فاکتورهای لینک‌شده را نشان می‌دهد و دکمه‌ی + صفحه فاکتورها را در حالت selectMode باز می‌کند.

    return (
        <div className="flex justify-center w-full !px-4 !pt-24">
            <div className="w-full max-w-2xl mx-auto">
                <div className="flex justify-between items-center !mb-6">
                    <h2 className="text-xl font-semibold">فاکتورهای لینک‌شده</h2>

                    <div
                        className="w-9 h-9 flex justify-center items-center !rounded-full bg-blue-100 cursor-pointer"
                        onClick={handleAddInvoice}
                    >
                        <MdAdd className="w-6 h-6 text-blue-700"/>
                    </div>
                </div>

                {/* LIST */}
                {loading ? (
                    <div className="text-center !py-10">در حال بارگذاری...</div>
                ) : linkedInvoices.length === 0 ? (
                    <div className="!p-4 text-center text-gray-500 border !rounded-lg">
                        هیچ فاکتوری لینک نشده است.
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center !px-3 gap-3 overflow-y-auto !pb-4"
                        style={{
                            // maxHeight: "calc(100vh - 250px)",
                        }}
                    >
                    {linkedInvoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="w-full max-w-sm bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                            >
                                <div className="flex items-stretch">

                                    {/* ستون آیکون */}
                                    <div className="flex flex-col items-center justify-center w-16 
                                  bg-primary text-white p-2 self-stretch">
                                        <MdReceiptLong className="w-6 h-6" />
                                        <div className="!mb-1 text-sm font-bold mt-1">فاکتور</div>
                                    </div>

                                    {/* بدنه */}
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-4 !p-3">

                                            {/* شماره / مبلغ */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>شماره:</h2>
                                                    <span className="text-base">{inv.number ?? inv.id}</span>
                                                </div>

                                                <button
                                                    onClick={() => handleOpenConfirmModal(inv.id)}
                                                    className="cursor-pointer"
                                                    title="حذف فاکتور"
                                                >
                                                    <MdDelete className='w-8 h-8 text-danger' />
                                                </button>
                                            </div>

                                            {inv.fromClient?.fullname && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>فروشنده:</h2>
                                                    <span>{inv.fromClient.fullname}</span>
                                                </div>
                                            )}

                                            {inv.toClient?.fullname && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>خریدار:</h2>
                                                    <span>{inv.toClient.fullname}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>مبلغ:</h2>
                                                <span>{typeof inv.amount === "number" ? inv.amount.toLocaleString() + " تومان" : inv.amount ?? "-"}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>تاریخ:</h2>
                                                <span>{formatJalali(inv.date)}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>توضیح:</h2>
                                                <span>{inv.description ?? "—"}</span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                title="حذف فاکتور"
                message="آیا از حذف این فاکتور از پروژه مطمئن هستید؟"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmRemove}
            />
        </div>
    );
}
