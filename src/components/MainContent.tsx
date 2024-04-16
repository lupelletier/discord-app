import React, { useContext } from 'react';
import ChatBox from './ChatBox';
import { messagesContext } from '../providers/SocketProvider';
import MessageCard from './MessageCard';
export default function MainContent() {
  const messages = useContext(messagesContext);
    return (
      <main className='fixed w-3/4 h-full top-0 right-0 bg-gray-800'>
        <h2 className='text-stone-400'>Main Content</h2>
        <div className='h-5/6'>
          {messages?.messages.map((message, index) => (
           <MessageCard key={index} message={message} />
          ))}
        </div>
        <ChatBox />
      </main>
    );
  }
