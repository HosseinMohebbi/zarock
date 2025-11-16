import {http} from "@/utils/api/http";

import {
    AddClientPayload,
    AddClientResponse,
    BankAccountPayload,
    BankAccountResponse,
    BankLogo,
    Client
} from "./client.types";
import {endpoints} from "@/config/endpoint.config";

export async function createClient(businessId: string, payload: AddClientPayload): Promise<AddClientResponse> {
    const {data} = await http.post<AddClientResponse>(
        endpoints.client.create(businessId),
        payload
    );
    return data;
}

export async function updateClient(businessId: string, clientId: string, payload: AddClientPayload): Promise<AddClientResponse> {
    const {data} = await http.put<AddClientResponse>(
        endpoints.client.update(businessId, clientId),
        payload
    );
    return data;
}

export async function getAllClients(businessId: string, params: { page: number; pageSize: number }): Promise<Client[]> {
    const {data} = await http.get<Client[]>(endpoints.client.getAll(businessId), {params});
    return data;
}

export async function filterClients(businessId: string, params: {
    page: number;
    pageSize: number;
    pattern: string;
    tags?: string[]
}): Promise<Client[]> {
    const {page, pageSize, pattern, tags} = params;
    const {data} = await http.post<Client[]>(
        endpoints.client.filter(businessId),
        {pattern, tags},
        {params: {page, pageSize}}
    );
    return data;
}

export async function getBankLogos(): Promise<BankLogo[]> {
    const {data} = await http.get<BankLogo[]>(endpoints.bank.logos);
    return data;
}

export async function createBankAccount(businessId: string, clientId: string, payload: BankAccountPayload): Promise<BankAccountResponse> {
    const { data } = await http.post<BankAccountResponse>(
        endpoints.bank.createAccount(businessId, clientId),
        payload
    );
    return data;
}

export async function updateBankAccount(businessId: string, bankAccountId: string, payload: BankAccountPayload): Promise<BankAccountResponse> {
    const { data } = await http.put<BankAccountResponse>(
        endpoints.bank.updateAccount(businessId, bankAccountId),
        payload
    );
    return data;
}

export async function getBankAccounts(businessId: string, clientId: string): Promise<BankAccountResponse[]> {
    const { data } = await http.get<BankAccountResponse[]>(
        endpoints.bank.getAccounts(businessId, clientId)
    );
    return data;
}

export async function deleteBankAccount(businessId: string, bankAccountId: string): Promise<void> {
    await http.delete(
        endpoints.bank.deleteAccount(businessId, bankAccountId)
    );
}
