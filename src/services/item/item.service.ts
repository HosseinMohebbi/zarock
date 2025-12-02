import { http } from "@/utils/api/http";
import {AddItemPayload, AddItemResponse, getItemResponse} from "./item.types"
import {endpoints} from "@/config/endpoint.config";

export async function createItem(
    businessId: string,
    payload: AddItemPayload
): Promise<AddItemResponse> {
    const { data } = await http.post<AddItemResponse>(
        endpoints.item.createItem(businessId),
        payload,
        {
            params: { businessId },
        }
    );
    return data;
}

export async function getAllItems(params: { page: number; pageSize: number }, businessId): Promise<getItemResponse[]> {
    const { page, pageSize } = params;
    const { data } = await http.get<getItemResponse[]>(endpoints.item.getAllItems(businessId), {
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
        endpoints.item.updateItem(businessId, itemId),
        payload
    );
    return data;
}

export async function deleteItem(
    businessId: string,
    itemId: string
): Promise<void> {
    await http.delete(endpoints.item.deleteItem(businessId, itemId));
}