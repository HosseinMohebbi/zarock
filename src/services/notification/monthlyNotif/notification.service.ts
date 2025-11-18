import {AddMonthlyNotifPayload, AddMonthlyNotifResponse} from "./notification.types";
import {http} from "@/utils/api/http";
import {endpoints} from "@/config/endpoint.config";

export async function createMonthlyNotif(businessId: string, payload: AddMonthlyNotifPayload): Promise<AddMonthlyNotifResponse> {
    const {data} = await http.post<AddMonthlyNotifResponse>(
        endpoints.notification.createMonthly(businessId),
        payload
    );
    return data;
}

export async function getMonthlyNotif(businessId: string, params: { page: number; pageSize: number }): Promise<AddMonthlyNotifResponse[]> {
    const {data} = await http.get<AddMonthlyNotifResponse[]>(endpoints.notification.getMonthly(businessId), {params});
    return data;
}