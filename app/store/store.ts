'use client'

import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from '@/app/store/messages/messagesSlice'

export const store = configureStore({
    reducer: {
        messages: messagesReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch