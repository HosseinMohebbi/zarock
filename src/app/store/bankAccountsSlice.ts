import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getBankLogos,
    getBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount
} from "@/services/client/client.service";

interface BankAccountResponse {
    id: string;
    bankName?: string;
    accountNumber?: string;
    cardNumber?: string;
    shaBaCode?: string;
}

interface BankAccountsState {
    logos: any[];
    accounts: BankAccountResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: BankAccountsState = {
    logos: [],
    accounts: [],
    loading: false,
    error: null,
};

// ---------------- Async Thunks ----------------

export const fetchBankAccounts = createAsyncThunk(
    "bank/fetchAccounts",
    async ({ businessId, clientId }: { businessId: string; clientId: string }) => {
        return await getBankAccounts(businessId, clientId);
    }
);

export const fetchBankLogos = createAsyncThunk(
    "bank/fetchLogos",
    async () => {
        return await getBankLogos();
    }
);

export const addBankAccount = createAsyncThunk(
    "bank/addAccount",
    async ({ businessId, clientId, payload }: { businessId: string; clientId: string; payload: any }) => {
        await createBankAccount(businessId, clientId, payload);
        return await getBankAccounts(businessId, clientId);
    }
);

export const editBankAccount = createAsyncThunk(
    "bank/editAccount",
    async ({ businessId, clientId, accountId, payload }: { businessId: string; clientId: string; accountId: string; payload: any }) => {
        await updateBankAccount(businessId, accountId, payload);
        return await getBankAccounts(businessId, clientId);
    }
);

export const removeBankAccount = createAsyncThunk(
    "bank/deleteAccount",
    async ({ businessId, accountId, clientId }: { businessId: string; accountId: string; clientId: string }) => {
        await deleteBankAccount(businessId, accountId);
        return await getBankAccounts(businessId, clientId);
    }
);

// ---------------- Slice ----------------

const bankAccountsSlice = createSlice({
    name: "bankAccounts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchBankAccounts
            .addCase(fetchBankAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBankAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload || [];
            })
            .addCase(fetchBankAccounts.rejected, (state) => {
                state.loading = false;
                state.error = "خطا در دریافت حساب‌ها";
            })

            // fetchBankLogos
            .addCase(fetchBankLogos.fulfilled, (state, action) => {
                state.logos = action.payload || [];
            })

            // addBankAccount
            .addCase(addBankAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBankAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload || [];
            })
            .addCase(addBankAccount.rejected, (state) => {
                state.loading = false;
                state.error = "خطا در اضافه کردن حساب";
            })

            // editBankAccount
            .addCase(editBankAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editBankAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload || [];
            })
            .addCase(editBankAccount.rejected, (state) => {
                state.loading = false;
                state.error = "خطا در ویرایش حساب";
            })

            // removeBankAccount
            .addCase(removeBankAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeBankAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload || [];
            })
            .addCase(removeBankAccount.rejected, (state) => {
                state.loading = false;
                state.error = "خطا در حذف حساب";
            });
    },
});

export default bankAccountsSlice.reducer;

// ---------------- Selectors ----------------

export const selectBankAccounts = (state: any) => state.bankAccounts.accounts;
export const selectBankLogos = (state: any) => state.bankAccounts.logos;
export const selectBankLoading = (state: any) => state.bankAccounts.loading;
export const selectBankError = (state: any) => state.bankAccounts.error;
