// /services/endpoint.config.ts
import {getCheckById} from "@/services/transaction/transaction.service";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export const endpoints = {
    auth: {
        login: `/api/user/login`,
        register: `/api/auth/register`,
        refresh: `/api/auth/refresh`,
    },
    business: {
        createBusiness: `/api/Business/addBusiness`,
        uploadBusinessLogo: `/api/Static/attachBusinessLogo`,
        getAllBusiness: `/api/Business/all`,
        getBusinessById: (id: string) => `/api/Business/${id}`,
        updateBusiness: (id: string) => `/api/Business/${id}`,
        getStatic: (id: string) => `/api/Static/${id}`,
        deleteBusiness: (id: string) => `/api/Static/${id}`,
    },
    client: {
        create: (businessId: string) => `/api/Client/${businessId}`,
        update: (businessId: string, clientId: string) => `/api/Client/${businessId}/${clientId}`,
        getAll: (businessId: string) => `/api/Client/${businessId}/all`,
        getClient: (businessId: string, clientId: string) => `/api/Client/${businessId}/${clientId}`,
        filter: (businessId: string) => `/api/Client/${businessId}/filter`,
        deleteClient: (businessId: string, clientId: string) => `/api/Client/${businessId}/${clientId}`,
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
        updateInvoiceArchive: (businessId: string, invoiceId: string) => `/api/Invoice/${businessId}/archive/${invoiceId}`,
        // اگر بعداً نیاز به filter یا جزئیات داشتیم می‌تونیم اضافه کنیم
        // filter: (businessId: string) => `${API_BASE}/api/Invoice/${businessId}/filter`,
        // getById: (businessId: string, invoiceId: string) => `${API_BASE}/api/Invoice/${businessId}/${invoiceId}`,
    },
    transaction: {
        createCheck: (businessId: string) => `/api/Transaction/${businessId}/check`,
        getCheckById: (businessId: string, checkId: string) => `/api/Transaction/${businessId}/check/${checkId}`,
        updateCheck: (businessId: string, checkId: string) => `/api/Transaction/${businessId}/check/${checkId}`,
        deleteCheck: (businessId: string, checkId: string) => `/api/Transaction/${businessId}/check/${checkId}`,
        createCash: (businessId: string) => `/api/Transaction/${businessId}/cash`,
        getCashById: (businessId: string, cashId: string) => `/api/Transaction/${businessId}/cash/${cashId}`,
        updateCash: (businessId: string, cashId: string) => `/api/Transaction/${businessId}/cash/${cashId}`,
        deleteCash: (businessId: string, cashId: string) => `/api/Transaction/${businessId}/cash/${cashId}`,
        getAll: (businessId: string) => `/api/Transaction/${businessId}/all`
    },
    project: {
        create: (businessId: string) => `/api/Project/${businessId}`,
        getAll: (businessId: string) => `/api/Project/${businessId}/all`,
        getProjectById: (businessId: string, projectId: string) => `/api/Project/${businessId}/overview/${projectId}`,
        updateProject: (businessId: string, projectId: string) => `/api/Project/${businessId}/${projectId}`,
        assignTransactionToProject: (businessId: string, projectId: string, transactionId: string) => `/api/Project/${businessId}/transaction/${projectId}/attach/${transactionId}`,
        removeTransactionFromProject: (businessId: string, projectId: string, transactionId: string) => `/api/Project/${businessId}/transaction/${projectId}/detach/${transactionId}`,
        getProjectTransactions: (businessId: string, projectId: string) => `/api/Project/${businessId}/transaction/${projectId}/all`,
    },
    notification: {
        createOneTime: (businessId: string) => `/api/Notification/${businessId}/onetime`,
        getOneTime: (businessId: string) => `/api/Notification/${businessId}/onetime`,
        createMonthly: (businessId: string) => `/api/Notification/${businessId}/monthly`,
        getMonthly: (businessId: string) => `/api/Notification/${businessId}/monthly`,
        createCheck: (businessId: string) => `/api/Notification/${businessId}/check`,
        getCheck: (businessId: string) => `/api/Notification/${businessId}/check`,
    }
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