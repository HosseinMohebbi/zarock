import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/react-query";
import { queryKeys } from "@/utils/query-keys";
import { filterItems, getAllItems } from "./item.service";
import {getItemResponse} from "@/services/item";


// ✔ گرفتن لیست آیتم‌ها + کش کامل
export function useItemsQuery(businessId: string, filters: any) {
    return useQuery({
        queryKey: [...queryKeys.items(businessId), filters],
        queryFn: () => filterItems(businessId, filters),
    });
}


// ✔ گرفتن همه آیتم‌ها برای صفحات edit و استفاده برای cache
export function fetchAllItems(businessId: string) {
    return getAllItems({ page: 1, pageSize: 2000 }, businessId);
}

export function preloadAllItems(businessId: string) {
    queryClient.prefetchQuery({
        queryKey: queryKeys.items(businessId),
        queryFn: () => fetchAllItems(businessId),
    });
}

export function getCachedItems(businessId: string) {
    return queryClient.getQueryData<getItemResponse[]>(queryKeys.items(businessId));
}

export async function fetchAllItemsWithCache(businessId: string) {
    const items = await getAllItems({ page: 1, pageSize: 2000 }, businessId);

    // cache لیست
    queryClient.setQueryData(queryKeys.items(businessId), items);

    // cache آیتم تکی
    items.forEach(item => {
        queryClient.setQueryData(["item", businessId, item.id], item);
    });

    return items;
}

export function useItemQuery(businessId: string, itemId: string) {
    return useQuery({
        queryKey: ["item", businessId, itemId],
        queryFn: async () => {
            const cachedItems = queryClient.getQueryData<getItemResponse[]>(queryKeys.items(businessId));
            const cachedItem = cachedItems?.find(i => i.id === itemId);
            if (cachedItem) return cachedItem;

            const items = await fetchAllItemsWithCache(businessId);
            return items.find(i => i.id === itemId);
        },
        initialData: () => {
            const cachedItems = queryClient.getQueryData<getItemResponse[]>(queryKeys.items(businessId));
            return cachedItems?.find(i => i.id === itemId);
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
}


// export function useItemQuery(businessId: string, itemId: string) {
//     return useQuery({
//         queryKey: ["item", businessId, itemId],
//         queryFn: async () => {
//             const cachedItems = getCachedItems(businessId);
//             const cachedItem = cachedItems?.find(i => i.id === itemId);
//             if (cachedItem) return cachedItem;
//
//             const allItems = await fetchAllItems(businessId);
//             return allItems.find(i => i.id === itemId);
//         },
//         initialData: () => {
//             // اگر cached item موجود است، آن را بازگردان
//             const cachedItems = getCachedItems(businessId);
//             return cachedItems?.find(i => i.id === itemId);
//         },
//         staleTime: 1000 * 60 * 5,
//         refetchOnMount: false,  // این خط خیلی مهم است
//         refetchOnWindowFocus: false,
//     });
// }


// export function useItemQuery(businessId: string, itemId: string) {
//    
//     return useQuery({
//         queryKey: ["item", businessId, itemId],
//         queryFn: async () => {
//             // اگر تو cache لیست items پیدا نشد، fetch کن
//             const cachedItems = getCachedItems(businessId);
//             const cachedItem = cachedItems?.find(i => i.id === itemId);
//             if (cachedItem) return cachedItem;
//
//             // fallback: fetch همه آیتم‌ها (یا fetch یک آیتم جداگانه)
//             const allItems = await fetchAllItems(businessId);
//             return allItems.find(i => i.id === itemId);
//         },
//         initialData: () => {
//             const cachedItems = getCachedItems(businessId);
//             return cachedItems?.find(i => i.id === itemId);
//         },
//         staleTime: 1000 * 60 * 5,
//         refetchOnWindowFocus: false,
//         refetchOnMount: false,
//     });
// }
