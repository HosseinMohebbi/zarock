'use client';
import {useEffect, useState} from "react";
import Card from "@/app/components/ui/Card";
import {useParams, useRouter} from "next/navigation";
import {MdReceipt, MdAdd, MdArrowLeft} from "react-icons/md";
import {getAllItems, getItemResponse} from "@/services/item";

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

// 🔤 تبدیل نوع تراکنش به فارسی
function getItemTypeFa(type?: string): string {
    if (!type) return "نامشخص";
    const map: Record<string, string> = {
        Merchandise: "کالا",
        Service: "خدمت",
    };
    return map[type] ?? type;
}

export default function ItemsPage(): JSX.Element {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";
    const router = useRouter();

    const handleAddTransaction = () => {
        router.push(`/business/${businessId}/transactions/add`);
    };

    const handleOpenTransaction = (t: any) => {
        if (!t.id) return;

        if (t.transactionType === "Cash") {
            router.push(`/business/${businessId}/transactions/${t.id}/edit/cash`);
        } else if (t.transactionType === "Check") {
            router.push(`/business/${businessId}/transactions/${t.id}/edit/check`);
        } else {
            console.warn("نوع تراکنش ناشناخته:", t.transactionType);
        }
    };


    useEffect(() => {
        async function loadItems() {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllItems({page: 1, pageSize: 50}, businessId);
                setItems(data ?? []);
                console.log(data);
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

        if (businessId) loadItems();
    }, [businessId, router]);

    return (
        <main className="p-4">
            ITEMS!!!
            {/*<div className="flex items-center justify-between mb-4">*/}
            {/*    <div className="flex items-center gap-3">*/}
            {/*        <MdReceipt className="text-2xl"/>*/}
            {/*        <h1 className="text-2xl font-semibold">تراکنش‌ها</h1>*/}
            {/*    </div>*/}

            {/*    <div className="flex items-center gap-2">*/}
            {/*        <button*/}
            {/*            onClick={handleAddTransaction}*/}
            {/*            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded"*/}
            {/*        >*/}
            {/*            <MdAdd/> جدید*/}
            {/*        </button>*/}
            {/*        <ThemeToggle/>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {loading && <div className="py-6 text-center">در حال بارگذاری...</div>}

            {error && (
                <div className="py-4 text-red-600">{error}</div>
            )}

            {!loading && !error && items.length === 0 && (
                <div className="py-6 text-center text-gray-500">آیتمی یافت نشد.</div>
            )}

            <div className="flex flex-col items-center gap-3">
                {items.map((item: getItemResponse) => (
                    <Card onClick={() => handleOpenTransaction(item)}
                          customStyle='w-[80%] flex !flex-row justify-start items-center p-3 border rounded hover:shadow transition cursor-pointer  bg-red-400'
                          key={item.id}>
                        <div className='h-full flex bg-blue-300'>
                            <div className="flex justify-center items-center text-sm text-gray-600 bg-green-400">
                                {getItemTypeFa(item.itemType)}
                            </div>
                            <div className='flex flex-col'>
                                <div>{item.group}</div>
                                <div>{item.name}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </main>
    );
}