'use client';
import {useEffect, useState} from "react";
import Input from "@/app/components/ui/Input";
import {useParams, useRouter} from "next/navigation";
import {MdAdd, MdInventory, MdBuild} from "react-icons/md";
import {getItemResponse} from "@/services/item/item.types";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
import {useDispatch, useSelector} from "react-redux";
import {fetchItems, selectItems} from "@/app/store/itemsSlice";
import Loader from "@/app/components/ui/Loader";
import {AppDispatch} from "@/app/store/store";

dayjs.extend(jalaliday);

function getItemTypeFa(type?: string): string {
    if (!type) return "نامشخص";
    const map: Record<string, string> = {
        Merchandise: "کالا",
        Service: "خدمت",
    };
    return map[type] ?? type;
}

const getItemIcon = (type?: string) => {
    if (type === "Merchandise") return <MdInventory size={22} className="text-primary"/>;
    if (type === "Service") return <MdBuild size={22} className="text-primary"/>;
    return null;
};

export default function ItemsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector(selectItems);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPattern, setSearchPattern] = useState('');
    const [typeFilter, setTypeFilter] = useState<'Merchandise' | 'Service' | ''>('');
    const [tags, setTags] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [isFetching, setIsFetching] = useState(true);
    const [filteredItems, setFilteredItems] = useState<getItemResponse[]>([]);


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

    useEffect(() => {
        if (!businessId) return;

        setIsFetching(false);
        if (items.length > 0) {
            return;
        }
        
        dispatch(fetchItems({businessId, page, pageSize, pattern: searchPattern, type: typeFilter || undefined, tags}))
            .unwrap()
            .catch(err => setError(err))
            .finally(() => setLoading(false));

    }, [businessId]);

    useEffect(() => {
        let result = items;

        if (searchPattern.trim() !== "") {
            const q = searchPattern.trim().toLowerCase();
            result = result.filter(item =>
                (item.group ?? "").toLowerCase().includes(q) ||
                (item.name ?? "").toLowerCase().includes(q)
            );
        }

        if (typeFilter) {
            result = result.filter(item => item.itemType === typeFilter);
        }

        setFilteredItems(result);

    }, [items, searchPattern, typeFilter]);

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
            {/* header */}
            <div className="flex items-center justify-between !mt-6 !mb-4 !px-3">
                <h1 className="!text-lg !font-semibold text-right">کالا و خدمات</h1>
                <div
                    className="flex justify-center items-center w-12 h-10 !bg-primary !rounded border border-gray-300 cursor-pointer"
                    onClick={handleAddItem}
                >
                    <MdAdd className="w-6 h-6 text-background"/>
                </div>
            </div>

            <div className="!mb-4 !px-3 flex gap-4">
                <Input
                    name="searchPattern"
                    type="text"
                    placeholder="جستجو بر اساس گروه یا زیرگروه"
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

            {items.length === 0 ? (
                <div className="flex items-center justify-center text-gray-500 w-full h-[60vh]">
                    هیچ کالا یا خدمتی برای نمایش وجود ندارد
                </div>
            ) : (
                <div className="overflow-x-auto !px-3 !py-3" style={{maxHeight: 'calc(100vh - 250px)'}}>
                    <table className="w-full table-fixed !border-collapse !border !border-gray-300 bg-white shadow-md !rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="!border !border-gray-300 !px-6 !py-3 text-right font-semibold text-gray-700 w-4/12">گروه</th>
                                <th className="!border !border-gray-300 !px-6 !py-3 text-right font-semibold text-gray-700 w-4/12">زیرگروه</th>
                                <th className="!border !border-gray-300 !px-6 !py-3 text-right font-semibold text-gray-700 w-4/12">قیمت واحد</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item: getItemResponse) => (
                                <tr
                                    key={item.id}
                                    className="!cursor-pointer hover:bg-gray-50 transition-colors !duration-200 !border-b !border-gray-200"
                                    onClick={() => handleOpenItem(item.id)}
                                >
                                    <td className="!border !border-gray-300 !px-6 !py-4 text-gray-800">
                                        <div className="flex items-center gap-2">
                                            {getItemIcon(item.itemType)}
                                            <span>{item.group ?? "-"}</span>
                                        </div>
                                    </td>
                                    <td className="!border !border-gray-300 !px-6 !py-4 text-right text-gray-800">
                                        {item.name ?? "-"}
                                    </td>
                                    <td className="!border !border-gray-300 !px-6 !py-4 text-right text-gray-800">
                                        {item.defaultUnitPrice.toLocaleString()} تومان
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
