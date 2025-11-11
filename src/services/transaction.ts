import { http } from "@/utils/api/http";
import {Business} from "@/services/business";

export interface AddCheckPayload {
    amount: number;
    checkNumber: string;
    bank: string;
    receiveDate: string;
    dueDate: string;
    fromClient: string;
    toClient: string;
    state: string;
    description: string;
    tags: string[];
}

export interface AddCheckResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    toClient: Client;
    fromClient: Client;
    amount: number;
    document: Document;
    tags: string[];
    transactionType: "Check";              // چون آبجکت توی نمونه Check بود
    flowType: FlowType;                    // "None" | "Inflow" | "Outflow"
    hasNotification: boolean;
    notificationId: string;
    checkNumber: string;
    bank: string;
    receiveDate: string;                   // ISO string
    dueDate: string;                       // ISO string
    state: StateType;
}

export interface AddCashPayload {
    trackingCode: string;
    amount: number;
    date: string;
    fromClient: string;
    toClient: string;
    description: string;
    tags: string[];
}

export interface AddCashResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    toClient: Client;
    fromClient: Client;
    amount: number;
    document: Document;
    tags: string[];
    transactionType: "Check" | "Cash" | "Card" | "Other"; // می‌تونی مقادیر واقعی‌اش رو اصلاح کنی
    flowType: "None" | "Inflow" | "Outflow"; // همینطور برای نوع جریان
    hasNotification: boolean;
    notificationId: string;
    checkNumber: string;
    bank: string;
    receiveDate: string;
    dueDate: string;
    state: "None" | "Pending" | "Completed" | "Canceled"; // مقادیر ممکن رو می‌تونی با داده واقعی تنظیم کنی
}


export interface Client {
    createdAt: string;
    updatedAt: string;
    id: string;
    fullname: string;
    nationalCode: string;
    address: string;
    credits: number;
    isJuridicalPerson: boolean;
    isOwnerClient: boolean;
    constantDescriptionInvoice: string;
}

export interface Document {
    createdAt: string;
    updatedAt: string;
    id: string;
    fileName: string;
    extension: string;
}

export type TransactionType = "Cash" | "Check" | "Card" | "Other";
export type FlowType = "None" | "Inflow" | "Outflow";
export type StateType = "None" | "Pending" | "Completed" | "Canceled";

export interface getTransactionResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    fromClient: Client;
    toClient: Client;
    amount: number;
    document: Document;
    tags: string[];
    transactionType: TransactionType;
    flowType: FlowType;
    hasNotification: boolean;
    notificationId: string;
}

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

