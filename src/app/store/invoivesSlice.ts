import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {getAllInvoice, updateInvoice, updateInvoiceArchive} from "@/services/invoice/invoice.service";
import {GetAllInvoicesResponse, AddInvoicePayload} from "@/services/invoice/invoice.types";
import {RootState} from "@/app/store/store";

export interface InvoiceState {
    invoices: GetAllInvoicesResponse[];
    selectedInvoice: GetAllInvoicesResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: InvoiceState = {
    invoices: [],
    selectedInvoice: null,
    loading: false,
    error: null,
};

export const fetchInvoices = createAsyncThunk(
    "invoices/fetchInvoices",
    async ({ businessId }: { businessId: string }) => {
        const data = await getAllInvoice({ page: 1, pageSize: 1000 }, businessId);
        return data;
    }
);

export const fetchInvoiceById = createAsyncThunk(
    "invoices/fetchInvoiceById",
    async ({businessId, invoiceId}: { businessId: string; invoiceId: string }, {getState}) => {
        const state: any = getState();
        const existing = state.invoices.invoices.find((i: any) => i.id === invoiceId);
        
        if (existing) {
            return existing;
        }

        const all = await getAllInvoice({page: 1, pageSize: 1000}, businessId);
        const invoice = all.find((i: any) => i.id === invoiceId);

        if (!invoice) throw new Error("فاکتور پیدا نشد");

        return invoice;
    }
);

export const updateInvoiceThunk = createAsyncThunk(
    "invoices/updateInvoice",
    async ({
               businessId,
               invoiceId,
               payload,
           }: { businessId: string; invoiceId: string; payload: AddInvoicePayload }) => {
        await updateInvoice(businessId, invoiceId, payload);
        return {businessId, invoiceId};
    }
);

export const archiveInvoiceThunk = createAsyncThunk(
    "invoices/archiveInvoice",
    async ({businessId, invoiceId}: { businessId: string; invoiceId: string }) => {
        await updateInvoiceArchive(businessId, invoiceId);
        return invoiceId;
    }
);

export const refetchInvoices = createAsyncThunk(
    "invoices/refetchInvoices",
    async ({businessId}: { businessId: string }) => {
        const data = await getAllInvoice({page: 1, pageSize: 1000}, businessId);
        return data;
    }
);


const invoiceSlice = createSlice({
    name: "invoices",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoices.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.invoices = action.payload;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "خطا در دریافت فاکتورها";
            })


            .addCase(fetchInvoiceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedInvoice = action.payload;
            })
            .addCase(fetchInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "خطا در دریافت فاکتور";
            })


            .addCase(updateInvoiceThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateInvoiceThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateInvoiceThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "خطا در ویرایش فاکتور";
            })


            .addCase(archiveInvoiceThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(archiveInvoiceThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices = state.invoices.filter((inv) => inv.id !== action.payload);
            })
            .addCase(archiveInvoiceThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "خطا در بایگانی فاکتور";
            })
            .addCase(refetchInvoices.fulfilled, (state, action) => {
                state.invoices = action.payload;
            });

    },
});

export const selectInvoices = (state: RootState) => state.invoices.invoices;
export const selectInvoiceById = (state: any, id: string) =>
    state.invoices.invoices.find((i: any) => i.id === id);

export default invoiceSlice.reducer;
