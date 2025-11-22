import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import clientReducer from './clientsSlice';
import bankAccountsSlice from "@/app/store/bankAccountsSlice";

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        clients: clientReducer,
        bankAccounts: bankAccountsSlice,
    },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;