import {Client} from "@/services/client/client.types"
import {getTransactionResponse} from "@/services/transaction/transaction.types"
import {AddInvoiceResponse} from "@/services/invoice/invoice.types"

export interface AddProjectPayload {
    name: string;
    employerId: string;
    tags: string[];
    description: string;
}

export interface AddProjectResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    progress: number;
    description: string;
    tags: string[];
    client: Client;           // می‌تونی دقیق‌تر تایپش کنی
    transactions: getTransactionResponse[];   // بعداً می‌تونم برات کاملش کنم
    invoices: AddInvoiceResponse[];
}