import { http } from "@/utils/api/http";
import {AddItemPayload, AddItemResponse, getItemResponse} from "./item.types"

export async function createItem(
    businessId: string,
    payload: AddItemPayload
): Promise<AddItemResponse> {
    const { data } = await http.post<AddItemResponse>(
        `/api/Item/${businessId}`,
        payload,
        {
            params: { businessId },
        }
    );
    return data;
}

export async function getAllItems(params: { page: number; pageSize: number }, businessId): Promise<getItemResponse[]> {
    const { page, pageSize } = params;
    const { data } = await http.get<getItemResponse[]>(`/api/Item/${businessId}/all`, {
        params: { page, pageSize }, // axios به‌صورت ?page=..&pageSize=.. اضافه می‌کند
    });
    return data;
}

export async function filterItems(
    businessId: string,
    params: {
        page: number;
        pageSize: number;
        pattern: string;  // برای جستجوی نام یا گروه
        type?: "Merchandise" | "Service";  // فیلتر بر اساس نوع
        tags?: string[];  // تگ‌ها برای فیلتر
    }
): Promise<getItemResponse[]> {
    const { page, pageSize, pattern, type, tags } = params;
    const { data } = await http.post<getItemResponse[]>(
        `/api/Item/${businessId}/filter`,
        {
            pattern,
            type,
            tags,
        },
        {
            params: { page, pageSize }, // ارسال page و pageSize به‌عنوان query params
        }
    );
    return data;
}

export async function updateItem(
    businessId: string,
    itemId: string,
    payload: AddItemPayload
): Promise<AddItemResponse> {
    const { data } = await http.put<AddItemResponse>(
        `/api/Item/${businessId}/${itemId}`,
        payload
    );
    return data;
}

export async function deleteItem(
    businessId: string,
    itemId: string
): Promise<void> {
    await http.delete(`/api/Item/${businessId}/${itemId}`);
}