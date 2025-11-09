import { http } from "@/utils/api/http";
import {Business} from "@/services/business";

export interface AddClientPayload {
    fullName: string;
    nationalCode: string;
    constantDescriptionInvoice: string;
    isJuridicalPerson: boolean;
    isOwnerMember: boolean;
    address: string;
    tags: string[];
}

export interface AddClientResponse {
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
export async function createClient(
    businessId: string,
    payload: AddClientPayload
): Promise<AddClientResponse> {
    const { data } = await http.post<AddClientResponse>(
        `/api/Client/${businessId}`,
        payload,
        {
            params: { businessId }, // axios به‌صورت ?businessId=... اضافه می‌کند
        }
    );
    return data;
}

export async function getََAllClients(params: { page: number; pageSize: number }, BusinessId): Promise<Client[]> {
    const { page, pageSize } = params;
    const { data } = await http.get<Client[]>(`/api/client/${BusinessId}/all`, {
        params: { page, pageSize }, // axios به‌صورت ?page=..&pageSize=.. اضافه می‌کند
    });
    return data;
}

// export async function createClient(
//     businessId: string,
//     payload: AddClientPayload
// ): Promise<AddClientResponse> {
//     // businessId در مسیر API قرار می‌گیرد، نیازی به ارسال آن به‌عنوان query نیست
//     const { data } = await http.post<AddClientResponse>(
//         `/api/Client/${businessId}`,
//         payload
//     );
//     return data;
// }