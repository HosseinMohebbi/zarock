export interface AddClientPayload {
    fullName: string;
    nationalCode: string;
    phoneNumber: string;
    constantDescriptionInvoice: string;
    isJuridicalPerson: boolean;
    address: string;
    tags: string[];
}

export interface AddClientResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
    fullname: string;
    nationalCode: string;
    phoneNumber: string;
    address: string;
    credits: number;
    isJuridicalPerson: boolean;
    isOwnerClient: boolean;
    constantDescriptionInvoice: string;
    tags: string[];
}

export interface Client {
    createdAt: string;
    updatedAt: string;
    id: string;
    fullname: string;
    nationalCode: string;
    phoneNumber: string;
    address: string;
    credits: number;
    isJuridicalPerson: boolean;
    isOwnerClient: boolean;
    constantDescriptionInvoice: string;
    tags: string[];
}

export interface BankLogo {
    name: string;
    url: string;
}

export interface BankAccountPayload {
    bankName: string;
    accountNumber: string;
    cardNumber: string;
    shaBaCode: string;
}

export interface BankAccountResponse {
    id: string;
    bankName: string;
    accountNumber: string;
    cardNumber: string;
    shaBaCode: string;
}