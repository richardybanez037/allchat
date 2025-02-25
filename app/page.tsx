'use client'

import Message from '@/app/components/message'
import { FormEvent, useEffect, useRef, useState } from 'react';
import { all, insert, subscribeToMessages, unsubscribeToMessages } from './utils/supabase/actions';
import { IMessage, ISendMessage } from './definitions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { getMessages } from './store/messages/messagesSlice';

export default function Home() {
  const [nameInput, setNameInput] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const lastItemRef = useRef<HTMLDivElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const messageInputRef = useRef<HTMLInputElement | null>(null)

  const messages = useSelector((state: RootState) => state.messages.messages)
  const dispatch = useDispatch()

  subscribeToMessages(dispatch)

  useEffect(() => {
    const setMessagesHandler = () => {
      const allMessages = all
      const data: IMessage[] = allMessages.data!

      dispatch(getMessages(data))
    }
    setMessagesHandler()

    return () => { unsubscribeToMessages() }
  },[])

  useEffect(() => {
    if(lastItemRef.current) lastItemRef.current.scrollIntoView({ behavior: "instant" })
  },[messages])

  const submitMessage = (e: FormEvent) => {
    e.preventDefault()

    const sendMesssage: ISendMessage = {
      messages_content: messageInput,
      messages_name: nameInput
    }
    insert(sendMesssage)

    if (messageInputRef.current) messageInputRef.current.value = "";  
  }
  return (
    <div className='flex justify-center w-full'>
      <form 
        className='flex flex-col gap-1 p-2 h-screen w-full md:w-[50em]'
        onSubmit={submitMessage}
      >
        <div className='flex gap-1 items-center pb-2'>
          <label className="text-gray-300">Name:</label>
          <input 
            ref={nameInputRef}
            onChange={e => setNameInput(e.target.value)}
            maxLength={20}
            minLength={1}
            name="message" 
            className="rounded border w-full h-full p-2 outline-none bg-gray-300 max-w-80"
            required
            />
        </div>
        <div className='grow border-2 border-gray-300 rounded p-2 pb-0 mb-2 overflow-y-scroll'>
          {messages.map((m: IMessage) => <Message message={m} key={m.messages_id}/>)}
          <span ref={lastItemRef}></span>
        </div>
        <div className="flex gap-2">
          <div className="grow">
            <input
              ref={messageInputRef}
              onChange={e => setMessageInput(e.target.value)} 
              name="message" 
              className="rounded border w-full h-full p-2 outline-none bg-gray-100"
              required
            />
          </div>
          <div>
            <button className="bg-black border-2 border-gray-300 text-gray-300 p-2 rounded hover:bg-gray-300 hover:text-black duration-200">SEND</button>
          </div>
        </div>
      </form>
    </div>
  );
}
