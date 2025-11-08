import { http } from "@/utils/api/http";
import {GetUserResponse} from "@/services/auth";

export interface AddBusinessPayload {
    name: string;
    description: string;
    logo?: string | null;
}

export interface AddBusinessResponse {
    id: string;
    name: string;
    description: string;
    logoUrl?: string;
}

export interface BusinessUser {
    username: string;
    fullname: string;
    role: string;
    nationalCode: string;
}

export interface BusinessLogo {
    id: string;
    fileName: string;
    extension: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface Business {
    id: string;
    name: string;
    description: string;
    user: BusinessUser;
    logo: BusinessLogo | null;     // اگر بعضی بیزینس‌ها لوگو نداشته باشند
    invitedUsers: unknown[];       // ساختارش مشخص نیست؛ فعلاً unknown[]
    createdAt: string;             // ISO string
    updatedAt: string;
}

export async function addBusiness(
    payload: AddBusinessPayload
): Promise<AddBusinessResponse> {
    const { data } = await http.post<AddBusinessResponse>(
        "/api/Business/addBusiness",
        payload
    );
    return data;
}

export async function getََAllBusinesses(params: { page: number; pageSize: number }): Promise<Business[]> {
    const { page, pageSize } = params;
    const { data } = await http.get<Business[]>("/api/Business/all", {
        params: { page, pageSize }, // axios به‌صورت ?page=..&pageSize=.. اضافه می‌کند
    });
    return data;
}
