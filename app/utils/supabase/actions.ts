'use client'

import { IMessage, IMessagePayload, ISendMessage } from "@/app/definitions";
import { supabaseClient } from "./client";
import { addMessage } from "@/app/store/messages/messagesSlice";
import { AppDispatch } from '@/app/store/store'
import { PostgrestError } from "@supabase/supabase-js";

export const all = async (): Promise<IMessage[]> => {
    const { data, error }: { data: IMessage[] | null , error: PostgrestError | null } = await supabaseClient
    .from('messages')
    .select()

    if(error) throw new Error(`Error fetching all messages: ${error.message}`)
    return data ?? []
}

function isIMessagePayload(payload: unknown): payload is IMessagePayload {
    if (typeof payload !== "object" || payload === null) return false;
    
    const obj = payload as Record<string, unknown>;
    return (
        typeof obj.schema === "string" &&
        typeof obj.table === "string" &&
        (typeof obj.errors === "string" || obj.errors === null) &&
        typeof obj.commit_timestamp === "string" &&
        typeof obj.eventType === "string" &&
        (obj.new === null || isIMessage(obj.new)) &&
        (obj.old === null || isIMessage(obj.old))
    );
}

function isIMessage(payload: unknown): payload is IMessage {
    if (typeof payload !== "object" || payload === null) return false;
    
    const obj = payload as Record<string, unknown>;
    
    return (
        Object.keys(obj).length === 0 || 
        (typeof obj.messages_id === "string" &&
        typeof obj.messages_content === "string" &&
        typeof obj.messages_created_at === "string" &&
        typeof obj.messages_name === "string")
    );
}

export const subscribeToMessages = (dispatch: AppDispatch) => {
    supabaseClient
        .channel('messages')
        .on('postgres_changes', 
            {        
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages' 
            }, 
            (payload: unknown) => {
                if (isIMessagePayload(payload) && payload.new)
                    dispatch(addMessage(payload.new));
            })
        .subscribe()
}

export const unsubscribeToMessages = () => supabaseClient.channel('messages').unsubscribe()

export const insert = async (message: ISendMessage) => {
    await supabaseClient
        .from('messages')
        .insert(message)
} 