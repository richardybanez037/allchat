'use client'

import { IMessage } from '../definitions';

export default function Message({message}: {message: IMessage}){
  return <div className="message break-words border-2 border-gray-300 rounded p-2 text-gray-300 mb-2">
    <div className='flex gap-1'>
      <h2 className="font-semibold">{message.messages_name}</h2>
      <h2>&nbsp;&#8226;&nbsp;</h2>
      <h2>{new Date(message.messages_created_at).toLocaleString()}</h2>
    </div>
    <h2>{message.messages_content}</h2>
  </div>
}