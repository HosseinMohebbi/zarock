import {http} from "@/utils/api/http";
import {AddBusinessPayload, AddBusinessResponse, Business, UpdateBusinessPayload} from "./business.types"
import {endpoints} from "@/config/endpoint.config";
import axios from "axios";


// export async function createBusiness(payload: AddBusinessPayload): Promise<AddBusinessResponse> {
//     const { data } = await http.post<AddBusinessResponse>(
//         endpoints.business.createBusiness,
//         payload
//     );
//     return data;
// }

export async function createBusiness(payload: AddBusinessPayload & { logo?: File }): Promise<AddBusinessResponse> {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    if (payload.logo) formData.append("logo", payload.logo);

    const { data } = await http.post<AddBusinessResponse>(
        endpoints.business.createBusiness,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return data;
}


export async function getAllBusiness(
    params: { page: number; pageSize: number },
): Promise<AddBusinessResponse[]> {
    const {data} = await http.get<AddBusinessResponse[]>(
        endpoints.business.getAllBusiness,
        {
            params,
            // withCredentials: true,
        }
    );
    return data;
}

// export async function getAllBusiness(params: { page: number; pageSize: number }) {
//     const res = await axios.post("/api/proxy", {
//         path: "/api/Business/all",
//         method: "GET",
//         params
//     });
//     return res.data;
// }

export async function getBusinessById(id: string): Promise<Business[]> {
    const { data } = await http.get<Business[]>(endpoints.business.getBusinessById(id));
    return data;
}

export async function updateBusiness(
    id: string,
    payload: UpdateBusinessPayload
): Promise<Business> {
    const { data } = await http.put<Business>(endpoints.business.updateBusiness(id), payload);
    return data;
}