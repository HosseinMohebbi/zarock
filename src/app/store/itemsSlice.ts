// /store/itemsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {filterItems, getAllItems, updateItem, deleteItem} from '@/services/item/item.service';
import { getItemResponse } from '@/services/item/item.types';

interface ItemsState {
    items: getItemResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: null,
};

// Async thunk برای گرفتن همه آیتم‌ها
export const fetchItems = createAsyncThunk<
    getItemResponse[],
    {
        businessId: string;
        page?: number;
        pageSize?: number;
        pattern?: string;
        type?: 'Merchandise' | 'Service';
        tags?: string[];
    }
>(
    'items/fetchItems',
    async ({ businessId, page = 1, pageSize = 2000, pattern = '', type, tags }, { rejectWithValue }) => {
        try {
            const res = await filterItems(businessId, { page, pageSize, pattern, type, tags });
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'خطای نامشخص');
        }
    }
);

// Async thunk برای آپدیت یک آیتم
export const updateItemThunk = createAsyncThunk<
    getItemResponse,
    { businessId: string; itemId: string; payload: Partial<getItemResponse> }
>(
    'items/updateItem',
    async ({ businessId, itemId, payload }, { rejectWithValue }) => {
        try {
            const updated = await updateItem(businessId, itemId, payload);
            return updated;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'خطا در ویرایش آیتم');
        }
    }
);

// Async thunk برای حذف آیتم
export const deleteItemThunk = createAsyncThunk<
    string, // خروجی: فقط id آیتمی که حذف شده
    { businessId: string; itemId: string }
>(
    'items/deleteItem',
    async ({ businessId, itemId }, { rejectWithValue }) => {
        try {
            await deleteItem(businessId, itemId); // ← صدا زدن API حذف
            return itemId; // ← فقط id را برمی‌گردانیم تا از state حذف کنیم
        } catch (err: any) {
            return rejectWithValue(err?.message || 'خطا در حذف آیتم');
        }
    }
);

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        clearItems(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action: PayloadAction<getItemResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateItemThunk.fulfilled, (state, action: PayloadAction<getItemResponse>) => {
                // آپدیت آیتم در لیست Redux
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteItemThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
            });
    },
});

// Selectorها
export const selectItems = (state: { items: ItemsState }) => state.items.items;
export const selectItemsLoading = (state: { items: ItemsState }) => state.items.loading;
export const selectItemsError = (state: { items: ItemsState }) => state.items.error;

export const { clearItems } = itemsSlice.actions;
export default itemsSlice.reducer;
