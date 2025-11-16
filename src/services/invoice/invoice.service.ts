import {http} from "@/utils/api/http";
import {AddInvoicePayload, AddInvoiceResponse, GetAllInvoicesResponse} from "./invoice.types"
import {endpoints} from "@/config/endpoint.config";

export async function createInvoice(
    businessId: string,
    payload: AddInvoicePayload
): Promise<AddInvoiceResponse> {
    const {data} = await http.post<AddInvoiceResponse>(
        endpoints.invoice.create(businessId),
        payload,
        {params: {businessId}}
    );
    return data;
}

export async function updateInvoice(businessId: string, invoiceId: string, payload: AddInvoicePayload): Promise<AddInvoiceResponse> {
    const {data} = await http.put<AddInvoiceResponse>(
        endpoints.client.update(businessId, invoiceId),
        payload
    );
    return data;
}

export async function getAllInvoice(
    params: { page: number; pageSize: number },
    businessId: string
): Promise<GetAllInvoicesResponse[]> {
    const {page, pageSize} = params;
    const {data} = await http.get<GetAllInvoicesResponse[]>(
        endpoints.invoice.getAll(businessId),
        {params: {page, pageSize}}
    );
    return data;
}

