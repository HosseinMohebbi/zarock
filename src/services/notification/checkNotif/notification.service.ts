import {AddCheckNotifResponse} from "./notification.types";
import {http} from "@/utils/api/http";
import {endpoints} from "@/config/endpoint.config";

export async function createCheckNotif(
    businessId: string,
    checkId: string
): Promise<AddCheckNotifResponse> {
    const { data } = await http.post(
        endpoints.notification.createCheck(businessId),
        null,
        { params: { checkId } }
    );
    return data;
}
export async function getCheckNotif(businessId: string, params: { page: number; pageSize: number }): Promise<AddCheckNotifResponse[]> {
    const {data} = await http.get<AddCheckNotifResponse[]>(endpoints.notification.getCheck(businessId), {params});
    return data;
}