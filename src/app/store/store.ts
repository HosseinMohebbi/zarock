import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import clientReducer from './clientsSlice';
import bankAccountsSlice from './bankAccountsSlice';
import invoiceReducer from './invoivesSlice'

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        clients: clientReducer,
        bankAccounts: bankAccountsSlice,
        invoices: invoiceReducer,
    },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;