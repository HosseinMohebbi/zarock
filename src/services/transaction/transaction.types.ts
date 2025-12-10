export interface AddCheckPayload {
    amount: number;
    checkNumber: string;
    bank: string;
    receiveDate: string;
    dueDate: string;
    fromClient: string;
    toClient: string;
    state: string;
    description: string;
    tags: string[];
}

export interface AddCheckResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    toClient: Client;
    fromClient: Client;
    amount: number;
    document: Document;
    tags: string[];
    transactionType: "Check";              // چون آبجکت توی نمونه Check بود
    flowType: FlowType;                    // "None" | "Inflow" | "Outflow"
    hasNotification: boolean;
    notificationId: string;
    checkNumber: string;
    bank: string;
    receiveDate: string;                   // ISO string
    dueDate: string;                       // ISO string
    state: StateType;
}

export interface AddCashPayload {
    trackingCode: string;
    amount: number;
    date: string;
    fromClient: string;
    toClient: string;
    description: string;
    tags: string[];
}

export interface AddCashResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    toClient: Client;
    fromClient: Client;
    amount: number;
    document: Document;
    tags: string[];
    transactionType: TransactionType; // می‌تونی مقادیر واقعی‌اش رو اصلاح کنی
    flowType: "None" | "Inflow" | "Outflow"; // همینطور برای نوع جریان
    hasNotification: boolean;
    notificationId: string;
    date: string;
    trackingCode: string
}


export interface Client {
    createdAt: string;
    updatedAt: string;
    id: string;
    fullname: string;
    nationalCode: string;
    address: string;
    credits: number;
    isJuridicalPerson: boolean;
    isOwnerClient: boolean;
    constantDescriptionInvoice: string;
}

export interface Document {
    createdAt: string;
    updatedAt: string;
    id: string;
    fileName: string;
    extension: string;
}

export type TransactionType = "None" | "Passed" | "Bounced" | "Expended" | "Cashed";
export type FlowType = "None" | "Inflow" | "Outflow";
export type StateType = "None" | "Pending" | "Completed" | "Canceled";

export interface getTransactionResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    fromClient: Client;
    toClient: Client;
    amount: number;
    document: Document;
    tags: string[];
    transactionType: TransactionType;
    flowType: FlowType;
    hasNotification: boolean;
    notificationId: string;
}

export interface UploadTransactionDocumentResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    fileName: string;
    extension: string;
}

export interface CheckClient {
    id: string;
    fullname: string;
    nationalCode: string;
    address: string;
    credits: number;
    isJuridicalPerson: boolean;
    isOwnerClient: boolean;
    constantDescriptionInvoice: string;
}

export interface CheckDocument {
    id: string;
    fileName: string;
    extension: string;
}

export interface CheckTransaction {
    id: string;
    toClient: CheckClient;
    fromClient: CheckClient;
    amount: number;
    document: CheckDocument | null;
    tags: string[];
    transactionType: "Check";
    flowType: string;
    hasNotification: boolean;
    notificationId: string | null;
    checkNumber: string;
    bank: string;
    receiveDate: string;
    dueDate: string;
    state: string;
}