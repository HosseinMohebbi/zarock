// /services/endpoint.config.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export const endpoints = {
    auth: {
        login: `/api/user/login`,
        register: `/api/auth/register`,
        refresh: `/api/auth/refresh`,
    },
    client: {
        create: (businessId: string) => `/api/Client/${businessId}`,
        update: (businessId: string, clientId: string) => `/api/Client/${businessId}/${clientId}`,
        getAll: (businessId: string) => `/api/client/${businessId}/all`,
        filter: (businessId: string) => `/api/client/${businessId}/filter`,
    },
    bank: {
        logos: `/api/BankLogo`,
        createAccount: (businessId: string, clientId: string) => `/api/Client/${businessId}/BankAccount/${clientId}`,
        updateAccount: (businessId: string, bankAccountId: string) => `/api/Client/${businessId}/BankAccount/${bankAccountId}`,
        getAccounts: (businessId: string, clientId: string) => `/api/Client/${businessId}/BankAccount/${clientId}/all`,
        deleteAccount: (businessId: string, bankAccountId: string) => `/api/Client/${businessId}/BankAccount/${bankAccountId}`,
    },
    invoice: {
        create: (businessId: string) => `/api/Invoice/${businessId}`,
        getAll: (businessId: string) => `/api/Invoice/${businessId}/all`,
        updateInvoice: (businessId: string, invoiceId: string) => `/api/Invoice/${businessId}/${invoiceId}`,
        // اگر بعداً نیاز به filter یا جزئیات داشتیم می‌تونیم اضافه کنیم
        // filter: (businessId: string) => `${API_BASE}/api/Invoice/${businessId}/filter`,
        // getById: (businessId: string, invoiceId: string) => `${API_BASE}/api/Invoice/${businessId}/${invoiceId}`,
    },
};

// export const endpoints = {
//     auth: {
//         login: `api/user/login`,
//         register: `/auth/register`,
//         refresh: `/auth/refresh`,
//     },
//     client: {
//         getAllClients: `/api/clients`,
//     },
//     users: {
//         me: `/users/me`,
//     },
// };