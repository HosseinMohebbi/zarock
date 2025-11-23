// 'use client';
//
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { filterClients, updateClient, getClientById } from '@/services/client/client.service';
// import { Client } from '@/services/client/client.types';
//
// interface ClientsState {
//     clients: Client[];
//     selectedClient: Client | null;
//     loading: boolean;
//     error: string | null;
// }
//
// const initialState: ClientsState = {
//     clients: [],
//     selectedClient: null,
//     loading: false,
//     error: null,
// };
//
// // 📌 گرفتن لیست مشتری‌ها (با فیلتر)
// export const fetchClients = createAsyncThunk<
//     Client[],
//     {
//         businessId: string;
//         page?: number;
//         pageSize?: number;
//         pattern?: string;
//         tags?: string[];
//     }
// >(
//     'clients/fetchClients',
//     async ({ businessId, page = 1, pageSize = 50, pattern = '', tags = [] }, { rejectWithValue }) => {
//         try {
//             const res = await filterClients(businessId, { page, pageSize, pattern, tags });
//             return res ?? [];
//         } catch (err: any) {
//             return rejectWithValue(err?.message || 'خطا در دریافت مشتری‌ها');
//         }
//     }
// );
//
// // 📌 گرفتن اطلاعات یک مشتری
// export const fetchClientById = createAsyncThunk<
//     Client,
//     { businessId: string; clientId: string }
// >(
//     'clients/fetchClientById',
//     async ({ businessId, clientId }, { rejectWithValue }) => {
//         try {
//             const res = await getClientById(businessId, clientId);
//             return res;
//         } catch (err: any) {
//             return rejectWithValue(err?.message || 'خطا در بارگذاری اطلاعات مشتری');
//         }
//     }
// );
//
// // 📌 آپدیت مشتری
// export const updateClientThunk = createAsyncThunk<
//     Client,
//     { businessId: string; clientId: string; payload: Partial<Client> }
// >(
//     'clients/updateClient',
//     async ({ businessId, clientId, payload }, { rejectWithValue }) => {
//         try {
//             const res = await updateClient(businessId, clientId, payload);
//             return res;
//         } catch (err: any) {
//             return rejectWithValue(err?.message || 'خطا در ویرایش مشتری');
//         }
//     }
// );
//
// const clientsSlice = createSlice({
//     name: 'clients',
//     initialState,
//     reducers: {
//         clearClients(state) {
//             state.clients = [];
//             state.selectedClient = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // لیست مشتری‌ها
//             .addCase(fetchClients.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
//                 state.loading = false;
//                 state.clients = action.payload;
//             })
//             .addCase(fetchClients.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//
//             // اطلاعات یک مشتری
//             .addCase(fetchClientById.fulfilled, (state, action: PayloadAction<Client>) => {
//                 state.selectedClient = action.payload;
//             })
//
//             // آپدیت مشتری
//             .addCase(updateClientThunk.fulfilled, (state, action: PayloadAction<Client>) => {
//                 const idx = state.clients.findIndex(c => c.id === action.payload.id);
//                 if (idx !== -1) state.clients[idx] = action.payload;
//                 state.selectedClient = action.payload;
//             });
//     },
// });
//
// export const selectClients = (state: any) => state.clients.clients;
// export const selectClient = (state: any) => state.clients.selectedClient;
// export const selectClientsLoading = (state: any) => state.clients.loading;
//
// export const { clearClients } = clientsSlice.actions;
// export default clientsSlice.reducer;

'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    filterClients,
    updateClient,
    getClientById,
    deleteClient,
} from '@/services/client/client.service';
import { Client } from '@/services/client/client.types';

interface ClientsState {
    clients: Client[];
    selectedClient: Client | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClientsState = {
    clients: [],
    selectedClient: null,
    loading: false,
    error: null,
};

// ----------------------------------------------------------------------------------
// 📌 گرفتن لیست مشتری‌ها (با فیلتر)
// ----------------------------------------------------------------------------------
export const fetchClients = createAsyncThunk<
    Client[],
    {
        businessId: string;
        page?: number;
        pageSize?: number;
        pattern?: string;
        tags?: string[];
    }
>(
    'clients/fetchClients',
    async ({ businessId, page = 1, pageSize = 50, pattern = '', tags = [] }, { rejectWithValue }) => {
        try {
            const res = await filterClients(businessId, { page, pageSize, pattern, tags });
            return res ?? [];
        } catch (err: any) {
            return rejectWithValue(err?.message || 'خطا در دریافت مشتری‌ها');
        }
    }
);

// ----------------------------------------------------------------------------------
// 📌 گرفتن اطلاعات یک مشتری
// ----------------------------------------------------------------------------------
export const fetchClientById = createAsyncThunk<
    Client,
    { businessId: string; clientId: string }
>(
    'clients/fetchClientById',
    async ({ businessId, clientId }, { rejectWithValue }) => {
        try {
            const res = await getClientById(businessId, clientId);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'خطا در بارگذاری اطلاعات مشتری');
        }
    }
);

// ----------------------------------------------------------------------------------
// 📌 آپدیت مشتری
// ----------------------------------------------------------------------------------
export const updateClientThunk = createAsyncThunk<
    Client,
    { businessId: string; clientId: string; payload: Partial<Client> }
>(
    'clients/updateClient',
    async ({ businessId, clientId, payload }, { rejectWithValue }) => {
        try {
            const res = await updateClient(businessId, clientId, payload);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'خطا در ویرایش مشتری');
        }
    }
);

// ----------------------------------------------------------------------------------
// 📌 حذف مشتری
// ----------------------------------------------------------------------------------
export const deleteClientThunk = createAsyncThunk<
    string,
    { businessId: string; clientId: string }
>(
    'clients/deleteClient',
    async ({ businessId, clientId }, { rejectWithValue }) => {
        try {
            await deleteClient(businessId, clientId);
            return clientId;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'خطا در حذف مشتری');
        }
    }
);

// ----------------------------------------------------------------------------------

const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        clearClients(state) {
            state.clients = [];
            state.selectedClient = null;
        },
        updateClientField(
            state,
            action: PayloadAction<{ clientId: string; field: keyof Client; value: any }>
        ) {
            const { clientId, field, value } = action.payload;

            // اگر selectedClient همون مشتریه، آپدیتش کن
            if (state.selectedClient?.id === clientId) {
                (state.selectedClient as any)[field] = value;
            }

            // آپدیت مشتری داخل لیست clients
            const idx = state.clients.findIndex(c => c.id === clientId);
            if (idx !== -1) {
                (state.clients[idx] as any)[field] = value;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // -----------------------------
            // 📌 لیست مشتری‌ها
            // -----------------------------
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -----------------------------
            // 📌 اطلاعات یک مشتری
            // -----------------------------
            .addCase(fetchClientById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientById.fulfilled, (state, action: PayloadAction<Client>) => {
                state.loading = false;
                state.selectedClient = action.payload;
            })
            .addCase(fetchClientById.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -----------------------------
            // 📌 آپدیت مشتری
            // -----------------------------
            .addCase(updateClientThunk.fulfilled, (state, action: PayloadAction<Client>) => {
                state.selectedClient = action.payload;

                const idx = state.clients.findIndex(c => c.id === action.payload.id);
                if (idx !== -1) state.clients[idx] = action.payload;
            })

            // -----------------------------
            // 📌 حذف مشتری
            // -----------------------------
            .addCase(deleteClientThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.clients = state.clients.filter(c => c.id !== action.payload);

                if (state.selectedClient?.id === action.payload) {
                    state.selectedClient = null;
                }
            });
    },
});

// ----------------------------------------------------------------------------------
// 📌 Selectors — نسخه کامل
// ----------------------------------------------------------------------------------

export const selectClients = (state: any) => state.clients.clients;
export const selectClient = (state: any) => state.clients.selectedClient;
export const selectClientById = (state: any, id: string) =>
    state.clients.clients.find((c: Client) => c.id === id) ??
    (state.clients.selectedClient?.id === id ? state.clients.selectedClient : null);

export const selectClientsLoading = (state: any) => state.clients.loading;
export const selectClientsError = (state: any) => state.clients.error;

export const { clearClients, updateClientField  } = clientsSlice.actions;
export default clientsSlice.reducer;
