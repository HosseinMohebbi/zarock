'use client';
import { useEffect, useState } from "react";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import { useParams, useRouter } from "next/navigation";
import { MdReceipt, MdAdd, MdArrowLeft, MdOutlineHomeRepairService, MdInventory, MdBuild } from "react-icons/md";
import { getAllItems, filterItems } from "@/services/item/item.service";
import { getItemResponse } from "@/services/item/item.types";

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

const getItemIcon = (type?: string) => {
    if (type === "Merchandise") return <MdInventory size={22} />;
    if (type === "Service") return <MdBuild size={22} />;
    return null;
};

export default function ItemsPage(): JSX.Element {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPattern, setSearchPattern] = useState('');
    const [typeFilter, setTypeFilter] = useState<'Merchandise' | 'Service' | ''>('');
    const [tags, setTags] = useState<string[]>([]); // تگ‌ها برای فیلتر
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50); // تعداد آیتم‌ها در هر صفحه

    const params = useParams() as { businessId?: string };
    const businessId = params.businessId ?? "";
    const router = useRouter();

    const handleAddItem = () => {
        router.push(`/business/${businessId}/items/add-item`);
    };

    const handleOpenItem = (itemId: any) => {
        if (!itemId) return;

        router.push(`/business/${businessId}/items/edit-item/${itemId}`);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await filterItems(businessId, {
                page,
                pageSize,
                pattern: searchPattern,
                type: typeFilter || undefined,
                tags,
            });
            setItems(data ?? []);
        } catch (err: any) {
            console.error("Failed to load items:", err);
            if (err?.response?.status === 401) {
                router.push("/login");
                return;
            }
            setError(err?.response?.data?.message ?? err?.message ?? "خطای نامشخص");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (businessId) handleSearch();  // بارگذاری آیتم‌ها به‌هنگام تغییر در businessId یا فیلترها
    }, [businessId, searchPattern, typeFilter, tags, page, pageSize]);

    return (
        <main className="!p-4">
            {/* header */}
            <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
                <h1 className="text-lg !font-semibold text-right">کالا و خدمات</h1>
                <button
                    onClick={handleAddItem}
                    aria-label="افزودن کالا"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded shadow-sm cursor-pointer"
                >
                    <MdAdd className="w-5 h-5" />
                </button>
            </div>

            {/* فیلتر جستجو */}
            <div className="!mb-4 !px-3 flex gap-4">
                <Input
                    type="text"
                    placeholder="جستجو بر اساس نام یا گروه"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                />
                <div className="flex gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={typeFilter === 'Merchandise'}
                            onChange={() => setTypeFilter(typeFilter === 'Merchandise' ? '' : 'Merchandise')}
                            className="cursor-pointer"
                        />
                        کالا
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={typeFilter === 'Service'}
                            onChange={() => setTypeFilter(typeFilter === 'Service' ? '' : 'Service')}
                            className="cursor-pointer"
                        />
                        خدمت
                    </label>
                </div>
            </div>

            {loading && <div className="!py-6 text-center">در حال بارگذاری...</div>}
            {error && <div className="!py-4 text-red-600">{error}</div>}
            {!loading && !error && items.length === 0 && (
                <div className="py-6 text-center text-gray-500">آیتمی یافت نشد.</div>
            )}

            {/* list */}
            <div className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 !pb-4 lg:grid-cols-3 xl:grid-cols-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {items.map((item: getItemResponse) => (
                    <div
                        key={item.id}
                        onClick={() => handleOpenItem(item.id)}
                        className="w-full bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                    >
                        <div className="flex items-stretch">
                            <div className="flex flex-col items-center justify-center w-16 bg-green-500 text-white !p-2 rounded-r-lg">
                                <div className="!mb-1">
                                    {getItemIcon(item.itemType)}
                                </div>
                                <span className="text-lg font-semibold">
                                    {getItemTypeFa(item.itemType)}
                                </span>
                            </div>

                            <div className="flex-1 !p-3">
                                <div className="flex flex-col gap-4 !p-4">
                                    <div className="flex gap-2 text-lg">
                                        <h2>گروه: </h2>
                                        <span className="text-md">{item.group ?? "-"}</span>
                                    </div>
                                    <div className="flex gap-2 text-lg">
                                        <h2>زیر گروه: </h2>
                                        <span>{item.name ?? "-"}</span>
                                    </div>
                                    <div className="flex gap-2 text-lg">
                                        <h2>قیمت واحد: </h2>
                                        <span>
                                            {typeof item.defaultUnitPrice === "number"
                                                ? item.defaultUnitPrice.toLocaleString() + " تومان"
                                                : item.defaultUnitPrice ?? "-"}
                                        </span>
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