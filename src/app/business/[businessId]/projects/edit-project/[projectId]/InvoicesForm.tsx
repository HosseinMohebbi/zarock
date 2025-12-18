'use client';
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {toast} from "react-toastify";
import {MdReceiptLong, MdDelete, MdAdd} from "react-icons/md";
import {
    getProjectInvoices,
    removeInvoiceFromProject,
} from "@/services/project/project.service";
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
    const [showConfirm, setShowConfirm] = useState(false);
    const [invoiceToRemove, setInvoiceToRemove] = useState<string | null>(null);

    async function loadData() {
        setLoading(true);
        try {
            const data = await getProjectInvoices(businessId, projectId, {page: 1, pageSize: 50});
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
    }, []);

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

            setLinkedInvoices(prev => prev.filter(inv => inv.id !== invoiceToRemove));

            toast.success("فاکتور از پروژه حذف شد");

        } catch (err) {
            toast.error("خطا در حذف فاکتور");
        } finally {
            setShowConfirm(false);
            setInvoiceToRemove(null);
        }
    }

    return (
        <div className="flex justify-center w-full !px-4 !pt-20 h-full">
            <div className="w-full max-w-2xl mx-auto flex flex-col h-full">
                <div className="flex justify-between items-center !mb-6 shrink-0">
                    <h2 className="!text-lg !font-semibold">فاکتورهای لینک‌ شده</h2>

                    <div
                        className="flex justify-center items-center w-12 h-10 !bg-primary !rounded border border-gray-300 cursor-pointer"
                        onClick={handleAddInvoice}
                    >
                        <MdAdd className="w-6 h-6 text-background"/>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="text-center !py-10">در حال بارگذاری...</div>
                    ) : linkedInvoices.length === 0 ? (
                        <div className="!p-4 text-center text-gray-500 border !rounded-lg">
                            هیچ فاکتوری لینک نشده است.
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center !px-3 gap-3 overflow-y-auto !pb-4"
                        >

                            {linkedInvoices.map((inv) => (
                                <div
                                    key={inv.id}
                                    className="w-full max-w-sm bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                                >
                                    <div className="flex items-stretch">
                                        <div className="flex flex-col items-center justify-center w-16 
                                  bg-primary text-white p-2 self-stretch">
                                            <MdReceiptLong className="w-6 h-6"/>
                                            <div className="!mb-1 text-sm font-bold mt-1">فاکتور</div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col gap-4 !p-3">
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
                                                        <MdDelete className='w-8 h-8 text-danger'/>
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
