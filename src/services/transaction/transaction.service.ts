import { http } from "@/utils/api/http";
import {
    AddCashPayload,
    AddCashResponse,
    AddCheckPayload,
    AddCheckResponse,
    getTransactionResponse
} from "./transaction.types";

export async function createCheck(
    businessId: string,
    payload: AddCheckPayload
): Promise<AddCheckResponse> {
    const { data } = await http.post<AddCheckResponse>(
        `/api/Transaction/${businessId}/check`,
        payload,
        {
            params: { businessId },
        }
    );
    return data;
}

export async function getCheckById(
    businessId: string,
    checkId: string
): Promise<AddCheckResponse> {
    const { data } = await http.get<AddCheckResponse>(
        `/api/Transaction/${businessId}/check/${checkId}`
    );
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