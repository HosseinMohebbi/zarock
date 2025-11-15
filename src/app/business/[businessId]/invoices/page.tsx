'use client';
import { useEffect, useState } from "react";
import Card from "@/app/components/ui/Card";
import { useParams } from "next/navigation";
import { MdReceipt } from "react-icons/md";
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

export default function InvoicesPage() {
    const params = useParams();
    const businessId = (params as any)?.businessId ?? ""; // اگر route پارامتر businessId دارد
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

    return (
        <div className="space-y-6 p-4">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MdReceipt className="text-2xl" />
                    <h1 className="text-xl font-semibold">فاکتورها</h1>
                </div>
            </header>

            {loading && (
                <div className="text-sm text-gray-500">در حال دریافت فاکتورها...</div>
            )}

            {error && (
                <div className="text-sm text-red-500">{error}</div>
            )}

            {!loading && invoices.length === 0 && !error && (
                <div className="text-sm text-gray-600">فاکتوری وجود ندارد.</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {invoices.map((inv) => (
                    <Card key={inv.id} className="p-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-gray-500">شماره فاکتور</div>
                            <div className="text-base font-medium">{inv.number}</div>

                            <div className="mt-2">
                                <div className="text-xs text-gray-500">خریدار</div>
                                <div className="text-sm">{inv.fromClient?.fullname ?? "نامشخص"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500">فروشنده</div>
                                <div className="text-sm">{inv.toClient?.fullname ?? "نامشخص"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500">تاریخ فاکتور</div>
                                <div className="text-sm">{formatJalali(inv.dateTime)}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}