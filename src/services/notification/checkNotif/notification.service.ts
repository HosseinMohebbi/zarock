import {AddCheckNotifResponse} from "./notification.types";
import {http} from "@/utils/api/http";
import {endpoints} from "@/config/endpoint.config";

export async function createCheckNotif(businessId: string): Promise<AddCheckNotifResponse> {
    const {data} = await http.post<AddCheckNotifResponse>(
        endpoints.notification.createCheck(businessId),
    );
    return data;
}

export async function getCheckNotif(businessId: string, params: { page: number; pageSize: number }): Promise<AddCheckNotifResponse[]> {
    const {data} = await http.get<AddCheckNotifResponse[]>(endpoints.notification.getCheck(businessId), {params});
    return data;
}