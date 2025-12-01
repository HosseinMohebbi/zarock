"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/ui/Button";
import Select from "@/app/components/ui/SelectInput";
import {
    getProjectTransactions,
    assignTransactionToProject,
} from "@/services/project/project.service";
import { getAllTransactions } from "@/services/transaction/transaction.service";
import {MdCheck, MdMoney} from "react-icons/md";
import {TransactionType} from "@/services/transaction/transaction.types";

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

    const [loading, setLoading] = useState(true);
    const [linkedTransactions, setLinkedTransactions] = useState<any[]>([]);
    const [allTransactions, setAllTransactions] = useState<any[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<string>("");

    // -----------------------------------------------------
    // Load linked + all transactions
    // -----------------------------------------------------
    async function loadData() {
        setLoading(true);
        try {
            const [linked, all] = await Promise.all([
                getProjectTransactions(businessId, projectId, { page: 1, pageSize: 50 }),
                getAllTransactions({ page: 1, pageSize: 100 }, businessId),
            ]);

            setLinkedTransactions(linked);
            setAllTransactions(all);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // -----------------------------------------------------
    // Link selected transaction
    // -----------------------------------------------------
    async function handleAttachTransaction() {
        if (!selectedTransaction) return;

        await assignTransactionToProject(
            businessId,
            projectId,
            selectedTransaction,
            {} // API چیزی نمی‌خواد
        );

        setIsModalOpen(false);
        setSelectedTransaction("");

        await loadData(); // ← آپدیت لحظه‌ای بدون رفرش صفحه
    }

    const selectableOptions = allTransactions.map((t) => ({
        value: t.id,
        label: `${t.amount} - ${t.transactionType}`,
    }));

    return (
        <div className="w-full !px-4 !pt-24">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center !mb-6">
                    <h2 className="text-xl font-semibold">تراکنش‌های لینک‌شده</h2>

                    <Button
                        label="+ افزودن"
                        onClick={() => setIsModalOpen(true)}
                    />
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
                    <div className="flex flex-col gap-4">
                        {linkedTransactions.map((t) => (
                            <div
                                key={t.id}
                                className="w-full bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                            >
                                <div className="flex items-stretch">

                                    {/* ستون آبی */}
                                    <div className="flex flex-col items-center justify-center w-16 
                                    bg-blue-500 text-white p-2 self-stretch">

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
                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>مبلغ:</h2>
                                                <span className="text-base">
                        {typeof t.amount === "number"
                            ? t.amount.toLocaleString() + " تومان"
                            : t.amount ?? "-"}
                    </span>
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

            {/* -------------------------------------------------- */}
            {/* MODAL: SELECT transaction */}
            {/* -------------------------------------------------- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-card !p-6 !rounded-lg w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold !mb-4 text-center">
                            انتخاب تراکنش برای لینک کردن
                        </h3>

                        <Select
                            options={selectableOptions}
                            value={selectedTransaction}
                            onChange={setSelectedTransaction}
                            placeholder="یک تراکنش انتخاب کنید"
                        />

                        <div className="flex justify-end gap-3 !mt-6">
                            <Button label="انصراف" onClick={() => setIsModalOpen(false)} />
                            <Button
                                label="لینک کردن"
                                onClick={handleAttachTransaction}
                                disabled={!selectedTransaction}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
