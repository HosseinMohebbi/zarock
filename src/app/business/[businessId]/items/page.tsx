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
    if (type === "Merchandise") return <MdInventory size={22}/>;
    if (type === "Service") return <MdBuild size={22}/>;
    return null;
};

export default function ItemsPage(): JSX.Element {
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
                <div
                    className="!px-3 !mt-4 grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 !pb-4 lg:grid-cols-3 xl:grid-cols-4"
                    style={{maxHeight: 'calc(100vh - 200px)'}}>
                    {filteredItems?.map((item: getItemResponse) => (
                        <div
                            key={item.id}
                            onClick={() => handleOpenItem(item.id)}
                            className="w-full bg-card !rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                        >
                            <div className="flex items-stretch">
                                <div
                                    className="flex flex-col items-center justify-center w-16 bg-primary text-white !p-2 rounded-r-lg">
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
                                            {item.defaultUnitPrice.toLocaleString()} تومان
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

