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

export async function updateCheck(
    businessId: string,
    checkId: string,
    payload: AddCheckPayload
): Promise<AddCheckResponse> {
    const { data } = await http.put<AddCheckResponse>(
        `/api/Transaction/${businessId}/check/${checkId}`,
        payload
    );
    return data;
}

export async function createCash(
    businessId: string,
    payload: AddCashPayload
): Promise<AddCashResponse> {
    const { data } = await http.post<AddCashResponse>(
        `/api/Transaction/${businessId}/cash`,
        payload,
        {
            params: { businessId },
        }
    );
    return data;
}

export async function getCashById(
    businessId: string,
    cashId: string
): Promise<AddCashResponse> {
    const { data } = await http.get<AddCashResponse>(
        `/api/Transaction/${businessId}/cash/${cashId}`
    );
    return data;
}

export async function updateCash(
    businessId: string,
    cashId: string,
    payload: AddCashPayload
): Promise<AddCashResponse> {
    const { data } = await http.put<AddCashResponse>(
        `/api/Transaction/${businessId}/cash/${cashId}`,
        payload
    );
    return data;
}

export async function getAllTransactions(params: { page: number; pageSize: number }, businessId): Promise<getTransactionResponse[]> {
    const { page, pageSize } = params;
    const { data } = await http.get<getTransactionResponse[]>(`/api/Transaction/${businessId}/all`, {
        params: { page, pageSize }, // axios به‌صورت ?page=..&pageSize=.. اضافه می‌کند
    });
    return data;
}

