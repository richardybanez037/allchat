'use client'

import Message from '@/app/components/message'
import { FormEvent, useEffect, useRef, useState } from 'react';
import { all, insert, subscribeToMessages, unsubscribeToMessages } from './utils/supabase/actions';
import { IMessage, ISendMessage } from './definitions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { getMessages, isLoadingMessages } from './store/messages/messagesSlice';
import Loading from './components/loading';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

export default function Home() {
  const [nameInput, setNameInput] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const lastItemRef = useRef<HTMLDivElement | null>(null)

  const [showEmoji, setShowEmoji] = useState(false)

  const { messages, loading } = useSelector((state: RootState) => state.messages)
  const dispatch = useDispatch()

  subscribeToMessages(dispatch)

  useEffect(() => {
    const setMessagesHandler = async () => {
      dispatch(isLoadingMessages(true))
      const data = await all()
      dispatch(getMessages(data))
      dispatch(isLoadingMessages(false))
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

    setMessageInput('')
  }
  return (
    <div className='flex justify-center w-full'>
      <form 
        className='flex flex-col gap-1 p-2 pb-0 pt-0 h-screen w-full md:w-[50em]'
        onSubmit={submitMessage}
      >
        <div className='flex gap-1 items-center pb-2 sticky top-0 pt-2 bg-black'>
          <label className="text-gray-300">Name:</label>
          <input 
            onChange={e => setNameInput(e.target.value)}
            maxLength={20}
            minLength={1}
            name="message" 
            className="rounded border w-full h-full p-2 outline-none bg-gray-300 max-w-80 bg-black"
            required
            />
        </div>
        <div className='grow border-2 border-gray-300 rounded p-2 pb-0 mb-2 overflow-y-scroll sticky'>
          {
            loading ? 
              <Loading/> :
              messages.map((m: IMessage) => <Message message={m} key={m.messages_id}/>)
          }
          <span ref={lastItemRef}></span>
        </div>
        <div className="flex gap-2 pb-2">
          <input
            onChange={e => setMessageInput(e.target.value)} 
            value={messageInput}
            name="message" 
            className="rounded border w-full h-full p-2 outline-none bg-gray-100"
            required
          />
          <div className='relative flex items-center justify-center'>
            <div className='absolute bottom-12 -right-16'>
              <EmojiPicker 
                open={showEmoji} 
                lazyLoadEmojis={true}
                theme={Theme.DARK}
                emojiStyle={EmojiStyle.NATIVE}
                width={300}
                onEmojiClick={(selected) => setMessageInput(prev => prev + selected.emoji)}
              />
            </div>
            <button 
              type='button' 
              className='className="bg-black border-2 border-gray-300 text-gray-300 p-2 rounded hover:bg-gray-300 hover:text-black duration-200'
              onClick={() => setShowEmoji(!showEmoji)}>
              😛
            </button>
          </div>
          <div>
            <button className="bg-black border-2 border-gray-300 text-gray-300 p-2 rounded hover:bg-gray-300 hover:text-black duration-200">SEND</button>
          </div>
        </div>
      </form>
    </div>
  );
}
