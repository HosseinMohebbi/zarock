import { http } from "@/utils/api/http";
import {
    AddProjectPayload,
    AddProjectResponse,
    ProjectOverview,
    UploadProjectDocumentResponse,
    ProjectDocumentItem,
    ProjectDocumentItemFull, DeleteProjectDocumentResponse
} from "./project.types";
import {getTransactionResponse, AddCashResponse} from "../../services/transaction/transaction.types"
import {GetAllInvoicesResponse} from "../../services/invoice/invoice.types"
import {endpoints} from "@/config/endpoint.config";
import {GetStaticFileResponse} from "@/services/business/business.types";
export async function createProject(
    businessId: string,
    payload: AddProjectPayload
): Promise<AddProjectResponse> {
    const { data } = await http.post<AddProjectResponse>(
        endpoints.project.create(businessId),
        payload
    );
    return data;
}

export async function getProjectById(
    businessId: string,
    projectId: string
): Promise<ProjectOverview> {
    const { data } = await http.get<ProjectOverview>(
        endpoints.project.getProjectById(businessId, projectId),
    );
    return data;
}

export async function getAllProjects(
    params: { page: number; pageSize: number },
    businessId: string
): Promise<AddProjectResponse[]> {
    const { page, pageSize } = params;

    const { data } = await http.get<AddProjectResponse[]>(
        endpoints.project.getAll(businessId),
        {
            params: { page, pageSize },
        }
    );

    return data;
}

export async function filterProjects(
    businessId: string,
    params: {
        page: number;
        pageSize: number;
        pattern: string; 
        tags?: string[];
    }
): Promise<AddProjectResponse[]> {
    const { page, pageSize, pattern, tags } = params;

    const { data } = await http.post<AddProjectResponse[]>(
        `/api/Project/${businessId}/filter`,
        {
            pattern,
            tags,
        },
        {
            params: { page, pageSize },
        }
    );

    return data;
}

export async function updateProject(
    businessId: string,
    projectId: string,
    payload: AddProjectPayload
): Promise<AddProjectResponse> {
    const { data } = await http.put<AddProjectResponse>(
        endpoints.project.updateProject(businessId, projectId),
        payload
    );

    return data;
}

export async function deleteProject(
    businessId: string,
    projectId: string
): Promise<void> {
    await http.delete(endpoints.project.deleteProject(businessId, projectId));
}

export async function getProjectTransactions(
    businessId: string,
    projectId: string,
    params: { page: number; pageSize: number }
): Promise<getTransactionResponse[]> {
    const { page, pageSize } = params;

    const { data } = await http.get<getTransactionResponse[]>(
        endpoints.project.getProjectTransactions(businessId, projectId),
        {
            params: { page, pageSize },
        }
    );

    return data;
}

export async function assignTransactionToProject(
    businessId: string,
    projectId: string,
    transactionId: string
): Promise<void> {
    await http.put(
        endpoints.project.assignTransactionToProject(businessId, projectId, transactionId),
    );
}

export async function removeTransactionFromProject(
    businessId: string,
    projectId: string,
    transactionId: string
): Promise<void> {
    await http.put(
        endpoints.project.removeTransactionFromProject(businessId, projectId, transactionId),
    );
}

export async function getProjectInvoices(
    businessId: string,
    projectId: string,
    params: { page: number; pageSize: number }
): Promise<GetAllInvoicesResponse[]> {
    const { page, pageSize } = params;

    const { data } = await http.get<GetAllInvoicesResponse[]>(
        endpoints.project.getInvoiceTransactions(businessId, projectId),
        {
            params: { page, pageSize },
        }
    );

    return data;
}

export async function assignInvoiceToProject(
    businessId: string,
    projectId: string,
    invoiceId: string
): Promise<void> {
    await http.put(
        endpoints.project.assignInvoiceToProject(businessId, projectId, invoiceId),
    );
}

export async function removeInvoiceFromProject(
    businessId: string,
    projectId: string,
    invoiceId: string
): Promise<void> {
    await http.put(
        endpoints.project.removeInvoiceFromProject(businessId, projectId, invoiceId),
    );
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

export async function uploadProjectDocument(
    projectId: string,
    file: File
): Promise<UploadProjectDocumentResponse> {

    const form = new FormData();
    form.append("Id", projectId);
    form.append("Document", file);

    const { data } = await http.post<UploadProjectDocumentResponse>(
        endpoints.project.uploadProjectDocument,
        form,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return data;
}

export async function getProjectDocuments(
    projectId: string,
    params?: {
        businessId?: string;
        page?: number;
        pageSize?: number;
    }
): Promise<ProjectDocumentItem[]> {

    const { data } = await http.get<ProjectDocumentItem[]>(
        endpoints.project.getProjectDocuments(projectId),
        {
            params
        }
    );

    return data;
}

export async function getProjectDocumentsWithFiles(
    projectId: string,
    params?: {
        businessId?: string;
        page?: number;
        pageSize?: number;
    }
): Promise<ProjectDocumentItemFull[]> {

    const docs = await getProjectDocuments(projectId, params);
    
    const docsWithUrl = await Promise.all(
        docs.map(async (doc) => {
            try {
                const file = await getStaticFile(doc.id);
                return {
                    ...doc,
                    url: file.url,
                };
            } catch {
                return {
                    ...doc,
                    url: "",
                };
            }
        })
    );

    return docsWithUrl;
}

export async function deleteProjectDocument(id: string): Promise<DeleteProjectDocumentResponse> {
    const { data } = await http.delete<DeleteProjectDocumentResponse>(
        endpoints.project.deleteProjectDocument(id)
    );

    return data;
}
