export interface IMessage {
    messages_content: string
    messages_created_at: string
    messages_id: string
    messages_name: string
}

export interface ISendMessage {
    messages_content: string
    messages_name: string
}

export interface IMessagePayload {
    schema: string
    table: string
    commit_timestamp: string
    eventType: string
    new: IMessage | null
    old: IMessage | null 
}

export interface InitMessageState {
    messages: IMessage[]
}