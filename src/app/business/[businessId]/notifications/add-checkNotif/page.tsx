'use client';

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {MdCheck} from "react-icons/md";
import Loader from "@/app/components/ui/Loader";

import {getAllChecks} from "@/services/transaction/transaction.service";
import { createCheckNotif } from "@/services/notification/checkNotif/notification.service";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";

dayjs.extend(jalaliday);

function formatJalali(input?: string | number | Date) {
    const d = dayjs(input);
    if (!d.isValid()) return "";
    return d.calendar("jalali").locale("fa").format("YYYY/MM/DD");
}

export default function CheckListPage(): JSX.Element {
    const [checks, setChecks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";

    const router = useRouter();

    const handleOpenCheck = async (check: any) => {
        if (!check?.id) return;

        try {
            // ساخت اعلان
            await createCheckNotif(businessId, check.id);

            // رفتن به صفحه لیست اعلان‌ها
            router.push(`/business/${businessId}/notifications`);

        } catch (error) {
            console.error("Failed to create notification:", error);
            alert("خطا در ثبت اعلان چک");
        }
    };

    useEffect(() => {
        async function loadChecks() {
            setLoading(true);
            setError(null);

            try {
                const data = await getAllChecks(businessId, {page: 1, pageSize: 50});
                setChecks(data ?? []);
                setIsFetching(false);
            } catch (err: any) {
                console.error("Failed to load checks:", err);
                if (err?.response?.status === 401) {
                    router.push("/login");
                    return;
                }
                setError(err?.response?.data?.message ?? err?.message ?? "خطای نامشخص");
            } finally {
                setLoading(false);
            }
        }

        if (businessId) loadChecks();
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

    return (
        <main className="!p-4 !pt-24">

            {/* Header */}
            <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
                <h1 className="text-lg !font-semibold text-right">
                    چک‌ها (ویژه اعلان)
                </h1>
            </div>

            {/* Empty state */}
            {checks.length === 0 ? (
                <div className="flex items-center justify-center text-gray-500 w-full h-[60vh]">
                    <div className="text-center text-xl">هیچ چکی یافت نشد</div>
                </div>
            ) : (
                <div
                    className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 !pb-4 lg:grid-cols-3 xl:grid-cols-4"
                    style={{maxHeight: "calc(100vh - 200px)"}}
                >
                    {checks.map((t: any) => (
                        <div
                            key={t.id}
                            onClick={() => handleOpenCheck(t)}
                            className="w-full bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                        >
                            <div className="h-full flex items-stretch">

                                {/* نوع چک */}
                                <div className="h-full flex flex-col items-center justify-center w-16 
                                    bg-primary text-white !p-2 !rounded-r-lg">
                                    <div className="!mb-1 text-lg font-bold">
                                        <MdCheck size={22}/>
                                    </div>
                                    <div className="!mb-1 text-lg font-bold">
                                        چک
                                    </div>
                                </div>

                                {/* بدنه کارت */}
                                <div className="flex-1 !p-3">
                                    <div className="flex flex-col gap-4 !p-4">

                                        {/* مبلغ */}
                                        <div className="flex items-center gap-2 text-lg">
                                            <h2>مبلغ:</h2>
                                            <span className="text-base">
                                                {t.amount?.toLocaleString()} تومان
                                            </span>
                                        </div>

                                        {/* شماره چک */}
                                        <div className="flex items-center gap-2 text-lg">
                                            <h2>شماره:</h2>
                                            <span className="text-base">{t.checkNumber}</span>
                                        </div>

                                        {/* بانک */}
                                        <div className="flex items-center gap-2 text-lg">
                                            <h2>بانک:</h2>
                                            <span className="text-base">{t.bank || "—"}</span>
                                        </div>

                                        {/* تاریخ‌ها */}
                                        <div className="flex flex-col gap-2 text-lg">
                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>دریافت:</h2>
                                                <span className="text-base">
                                                    {formatJalali(t.receiveDate)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-lg">
                                                <h2>موعود:</h2>
                                                <span className="text-base">
                                                    {formatJalali(t.dueDate)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* توضیح */}
                                        <div className="flex items-center gap-2 text-lg">
                                            <h2>توضیح:</h2>
                                            <span className="text-base">{t.description ?? ""}</span>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
