import {http} from "@/utils/api/http";
import {AddBusinessPayload, AddBusinessResponse, Business, UpdateBusinessPayload, UploadBusinessLogoResponse, GetStaticFileResponse} from "./business.types"
import {endpoints} from "@/config/endpoint.config";
import axios from "axios";


export async function addBusiness(payload: AddBusinessPayload): Promise<AddBusinessResponse> {
    const { data } = await http.post<AddBusinessResponse>(
        endpoints.business.createBusiness,
        payload
    );
    return data;
}

export async function uploadBusinessLogo(
    businessId: string,
    file: File
): Promise<UploadBusinessLogoResponse> {

    const form = new FormData();
    form.append("Id", businessId);
    form.append("Document", file);

    const { data } = await http.post<UploadBusinessLogoResponse>(
        endpoints.business.uploadBusinessLogo,
        form,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return data;
}

export async function createBusinessWithLogo(
    payload: AddBusinessPayload,
    logoFile?: File
) {
    const business = await addBusiness(payload);

    if (logoFile) {
        await uploadBusinessLogo(business.id, logoFile);
    }

    return business;
}

export async function getStaticFile(id: string): Promise<GetStaticFileResponse> {

    const response = await http.get(endpoints.business.getStatic(id), {
        responseType: "blob",
    });

    // گرفتن نام فایل از هدر
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "download";

    if (contentDisposition) {
        const match = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="(.+)"/);
        if (match) {
            fileName = decodeURIComponent(match[1] || match[2]);
        }
    }

    // ساخت لینک دانلود
    const fileUrl = URL.createObjectURL(response.data);

    return {
        id,
        fileName,
        url: fileUrl
    };
}

// export async function createBusiness(payload: AddBusinessPayload & { logo?: File }): Promise<AddBusinessResponse> {
//     const formData = new FormData();
//     formData.append("name", payload.name);
//     formData.append("description", payload.description);
//     if (payload.logo) formData.append("logo", payload.logo);
//
//     const { data } = await http.post<AddBusinessResponse>(
//         endpoints.business.createBusiness,
//         formData,
//         {
//             headers: {
//                 "Content-Type": "multipart/form-data"
//             }
//         }
//     );
//     return data;
// }


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

export async function deleteBusiness(
    id: string,
): Promise<void> {
    await http.delete(endpoints.business.deleteBusiness(id));
}