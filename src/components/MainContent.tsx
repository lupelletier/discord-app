import React, { useContext } from 'react';
import ChatBox from './ChatBox';
import { messagesContext } from '../providers/SocketProvider';
import MessageCard from './MessageCard';
export default function MainContent() {
  const messages = useContext(messagesContext);
    return (
      <main className='fixed w-5/6 h-full top-0 right-0 bg-gray-800'>
        <div className='p-10'>
          <div className='h-5/6 flex flex-col w-full'>
            {messages?.messages.map((message, index) => (
            <MessageCard key={index} message={message} />
            ))}
          </div>
        </div>
          <ChatBox />

      </main>
    );
  }
