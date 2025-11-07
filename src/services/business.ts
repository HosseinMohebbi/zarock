import { http } from "@/utils/api/http";

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

export async function addBusiness(
    payload: AddBusinessPayload
): Promise<AddBusinessResponse> {
    const { data } = await http.post<AddBusinessResponse>(
        "/api/Business/addBusiness",
        payload
    );
    return data;
}
