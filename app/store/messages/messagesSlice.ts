'use client'

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage, InitMessageState } from '@/app/definitions';

const initialState: InitMessageState = {
    messages: [],
    loading: true
}

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        getMessages: (state, action: PayloadAction<IMessage[]>) => {
            state.messages = action.payload
        },
        isLoadingMessages: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        //received message
        addMessage: (state, action: PayloadAction<IMessage>) => {
            state.messages.push(action.payload)
        }
    }
})

export const {
    getMessages,
    isLoadingMessages,
    addMessage
} = messagesSlice.actions

export default messagesSlice.reducer