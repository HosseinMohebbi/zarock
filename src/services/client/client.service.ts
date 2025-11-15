import { http } from "@/utils/api/http";
import {AddClientPayload, AddClientResponse, Client, BankLogo, BankAccountPayload, BankAccountResponse} from "./client.types"
import {Business} from "@/services/business";

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

export async function updateClient(
    businessId: string,
    clientId: string,
    payload: AddClientPayload
): Promise<AddClientResponse> {
    const { data } = await http.put<AddClientResponse>(
        `/api/Client/${businessId}/${clientId}`,
        payload
    );
    return data;
}

export async function getAllClients(params: { page: number; pageSize: number }, BusinessId): Promise<Client[]> {
    const { page, pageSize } = params;
    const { data } = await http.get<Client[]>(`/api/client/${BusinessId}/all`, {
        params: { page, pageSize }, // axios به‌صورت ?page=..&pageSize=.. اضافه می‌کند
    });
    return data;
}

export async function getBankLogos(): Promise<BankLogo[]> {
    const { data } = await http.get<BankLogo[]>(`/api/BankLogo`);
    return data;
}

export async function createBankAccount(
    businessId: string,
    clientId: string,
    payload: BankAccountPayload
): Promise<BankAccountResponse> {
    const { data } = await http.post<BankAccountResponse>(
        `/api/Client/${businessId}/BankAccount/${clientId}`,
        payload
    );
    return data;
}

export async function updateBankAccount(
    businessId: string,
    bankAccountId: string,
    payload: BankAccountPayload
): Promise<BankAccountResponse> {
    const { data } = await http.put<BankAccountResponse>(
        `/api/Client/${businessId}/BankAccount/${bankAccountId}`,
        payload
    );
    return data;
}

export async function getBankAccounts(
    businessId: string,
    clientId: string
): Promise<BankAccountResponse[]> {
    const { data } = await http.get<BankAccountResponse[]>(
        `/api/Client/${businessId}/BankAccount/${clientId}/all`
    );
    return data;
}
