'use client';
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Button from "@/app/components/ui/Button";
import {
    getProjectTransactions,
    assignTransactionToProject, removeTransactionFromProject,
} from "@/services/project/project.service";
import {MdCheck, MdMoney, MdDelete, MdAdd} from "react-icons/md";
import {TransactionType} from "@/services/transaction/transaction.types";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import {toast} from "react-toastify";

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

export default function ProjectTransactionsPage() {
    const params = useParams() as { businessId: string; projectId: string };
    const businessId = params.businessId;
    const projectId = params.projectId;

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [linkedTransactions, setLinkedTransactions] = useState<any[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [transactionToRemove, setTransactionToRemove] = useState<string | null>(null);

    // -----------------------------------------------------
    // Load linked transactions
    // -----------------------------------------------------
    async function loadData() {
        setLoading(true);
        try {
            const linked = await getProjectTransactions(businessId, projectId, {page: 1, pageSize: 50});
            setLinkedTransactions(linked);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // -----------------------------------------------------
    // Navigate to TransactionsPage in select mode
    // -----------------------------------------------------
    const handleAddTransaction = () => {
        router.push(
            `/business/${businessId}/transactions?selectMode=1&projectId=${projectId}`
        );
    };

    function handleOpenConfirmModal(transactionId: string) {
        // e.stopPropagation();
        setTransactionToRemove(transactionId)
        setShowConfirm(true);
    }

    async function handleConfirmRemove() {
        if (!transactionToRemove) return;

        try {
            await removeTransactionFromProject(
                businessId,
                projectId,
                transactionToRemove
            );

            // حذف سریع از UI
            setLinkedTransactions((prev) =>
                prev.filter((t) => t.id !== transactionToRemove)
            );

            toast.success("تراکنش با موفقیت حذف شد");
        } catch (err) {
            toast.error("خطا در حذف تراکنش");
            console.error(err);
        } finally {
            setShowConfirm(false);
            setTransactionToRemove(null);
        }
    }


    return (
        <div className="flex justify-center w-full !px-4 !pt-24">
            <div className="w-full max-w-2xl mx-auto">
                <div className="flex justify-between items-center !mb-6">
                    <h2 className="!text-lg !font-semibold">تراکنش‌ های لینک‌ شده</h2>
                    <div
                        className="flex justify-center items-center w-12 h-10 !bg-primary !rounded border border-gray-300 cursor-pointer"
                        onClick={handleAddTransaction}
                    >
                        <MdAdd className="w-6 h-6 text-background"/>
                    </div>
                </div>

                {/* ----------------------------------------- */}
                {/* LIST OF LINKED TRANSACTIONS */}
                {/* ----------------------------------------- */}
                {loading ? (
                    <div className="text-center !py-10">در حال بارگذاری...</div>
                ) : linkedTransactions.length === 0 ? (
                    <div className="!p-4 text-center text-gray-500 border !rounded-lg">
                        هیچ تراکنشی لینک نشده است.
                    </div>
                ) : (
                    <div className="overflow-y-auto pr-2 flex flex-col items-center gap-4">
                        {linkedTransactions.map((t) => (
                            <div
                                key={t.id}
                                className="w-full max-w-sm bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                            >
                                <div className="flex items-stretch">

                                    {/* ستون آبی */}
                                    <div className="flex flex-col items-center justify-center w-16 
                                    bg-primary text-white p-2 self-stretch">

                                        <div className="!mb-1 text-lg font-bold">
                                            {getItemIcon(t.transactionType)}
                                        </div>

                                        <div className="!mb-1 text-sm font-bold">
                                            {getTransactionTypeFa(t.transactionType)}
                                        </div>
                                    </div>

                                    {/* بدنه کارت */}
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-4 !p-3">

                                            {/* مبلغ */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>مبلغ:</h2>
                                                    <span className="text-base">
                                                    {typeof t.amount === "number" ? t.amount.toLocaleString() + " تومان" : t.amount ?? "-"}
                                                </span>
                                                </div>

                                                <button
                                                    onClick={() => handleOpenConfirmModal(t.id)}
                                                    className="cursor-pointer"
                                                    title="حذف تراکنش"
                                                >
                                                    <MdDelete className='w-8 h-8 text-danger'/>
                                                </button>
                                            </div>

                                            {t.fromClient?.fullname && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>مبدا:</h2>
                                                    <span>{t.fromClient.fullname}</span>
                                                </div>
                                            )}

                                            {t.toClient?.fullname && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>مقصد:</h2>
                                                    <span>{t.toClient.fullname}</span>
                                                </div>
                                            )}

                                            {t.transactionType === "Check" && t.state && (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>وضعیت:</h2>
                                                    <span>{checkStateMap[t.state]}</span>
                                                </div>
                                            )}

                                            {t.transactionType === "Check" ? (
                                                <div className="flex flex-col gap-2 text-lg">
                                                    <div className="flex items-center gap-2">
                                                        <h2>دریافت:</h2>
                                                        <span>{formatJalali(t.receiveDate)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <h2>موعود:</h2>
                                                        <span>{formatJalali(t.dueDate)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-lg">
                                                    <h2>تاریخ:</h2>
                                                    <span>{formatJalali(t.date)}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>توضیح:</h2>
                                                <span>{t.description ?? "—"}</span>
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
                title="حذف تراکنش"
                message="آیا از حذف این تراکنش از پروژه مطمئن هستید؟"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmRemove}
            />
        </div>
    );
}
