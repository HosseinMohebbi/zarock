import { http } from "@/utils/api/http";
import {
    AddCashPayload,
    AddCashResponse,
    AddCheckPayload,
    AddCheckResponse,
    getTransactionResponse
} from "./transaction.types";
import {endpoints} from "@/config/endpoint.config";

export async function createCheck(
    businessId: string,
    payload: AddCheckPayload
): Promise<AddCheckResponse> {
    const { data } = await http.post<AddCheckResponse>(
        endpoints.transaction.createCheck(businessId),
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
        endpoints.transaction.getCheckById(businessId, checkId),
    );
    return data;
}

export async function updateCheck(
    businessId: string,
    checkId: string,
    payload: AddCheckPayload
): Promise<AddCheckResponse> {
    const { data } = await http.put<AddCheckResponse>(
        endpoints.transaction.updateCheck(businessId, checkId),
        payload
    );
    return data;
}

export async function deleteCheck(businessId: string, checkId: string): Promise<void> {
    await http.delete(
        endpoints.transaction.deleteCheck(businessId, checkId)
    );
}

export async function createCash(
    businessId: string,
    payload: AddCashPayload
): Promise<AddCashResponse> {
    const { data } = await http.post<AddCashResponse>(
        endpoints.transaction.createCash(businessId),
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
        endpoints.transaction.getCashById(businessId, cashId),
    );
    return data;
}

export async function updateCash(
    businessId: string,
    cashId: string,
    payload: AddCashPayload
): Promise<AddCashResponse> {
    const { data } = await http.put<AddCashResponse>(
        endpoints.transaction.updateCash(businessId, cashId),
        payload
    );
    return data;
}

export async function deleteCash(businessId: string, cashId: string): Promise<void> {
    await http.delete(
        endpoints.transaction.deleteCash(businessId, cashId)
    );
}

export async function getAllTransactions(params: { page: number; pageSize: number }, businessId): Promise<getTransactionResponse[]> {
    const { page, pageSize } = params;
    const { data } = await http.get<getTransactionResponse[]>(endpoints.transaction.getAll(businessId), {
        params: { page, pageSize }, // axios به‌صورت ?page=..&pageSize=.. اضافه می‌کند
    });
    return data;
}