import {AddOneTimeNotifPayload, AddOneTimeNotifResponse} from "./notification.types";
import {http} from "@/utils/api/http";
import {endpoints} from "@/config/endpoint.config";

export async function createOneTimeNotif(businessId: string, payload: AddOneTimeNotifPayload): Promise<AddOneTimeNotifResponse> {
    const {data} = await http.post<AddOneTimeNotifResponse>(
        endpoints.notification.createOneTime(businessId),
        payload
    );
    return data;
}

export async function getOneTimeNotif(businessId: string, params: { page: number; pageSize: number }): Promise<AddOneTimeNotifResponse[]> {
    const {data} = await http.get<AddOneTimeNotifResponse[]>(endpoints.notification.getOneTime(businessId), {params});
    return data;
}