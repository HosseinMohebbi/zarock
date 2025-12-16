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

export interface InvoiceItem {
    quantityMetric: string;
    quantity: number;
    price: number;
    fullName: string;
    description: string;
}

export interface Item {
    id: string;
    fullName: string;
    quantityMetric: string;
    quantity: number;
    price: number;
    description: string;
}

export interface AddInvoicePayload {
    hint: string;
    type: string;
    fromClient: Client;
    toClient: Client;
    dateTime: string;
    invoiceItems: InvoiceItem[];
    taxPercent: number;
    discountPercent: number;
    description: string
}

export interface AddInvoiceResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    number: string;
    type: string;
    taxPercent: number;
    discountPercent: number;
    description: string
    dateTime: string;
    hint: string;
    fromClient: Client;
    toClient: Client;
    flowType: string;
    isArchived: boolean;
    items: Item[];
}

export interface GetAllInvoicesResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    number: string;
    type: string;
    taxPercent: number;
    discountPercent: number;
    description: string
    dateTime: string;
    hint: string;
    fromClient: Client;
    toClient: Client;
    flowType: string;
    isArchived: boolean;
    items: Item[];
}