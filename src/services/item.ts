import { http } from "@/utils/api/http";
import {Business} from "@/services/business";


export type itemType = "Service" | "Merchandise";

export interface AddItemPayload {
    name: string;
    group: string;
    type: itemType;
    tags: string[];
    defaultUnitPrice: number;
    unit: string;
    description: string;
}

export interface AddItemResponse {
    id: string
    name: string;
    group: string;
    defaultUnitPrice: number;
    unit: string;
    itemType: itemType;
    description: string;
}

export interface getItemResponse {
    id: String;
    name: string;
    group: string;
    defaultUnitPrice: number;
    unit: string;
    itemType: itemType;
    description: string;
}

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

