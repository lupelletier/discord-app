import React from 'react';
import ChatBox from './ChatBox';
import { useMessages, useConversation } from '../providers/SocketProvider';
import MessageCard from './MessageCard';

export default function MainContent() {
    const { messages } = useMessages();
    const { conversationRoom } = useConversation();
    console.log('Messages:', messages);
    return (
        <main className='fixed w-5/6 h-full top-0 right-0 bg-gray-800 flex flex-col'>
            <div className='p-4 h-full'>
                <div className='flex flex-col h-5/6 justify-end top-0'>
                    {messages.map((message, index) =>
                        <MessageCard key={index} message={message} />
                    )}
                </div>
            </div>
            <ChatBox />
        </main>
    );
}
