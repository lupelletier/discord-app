import React, { useEffect, useState } from 'react';
import {conversationContext, useConversation, useConversations, useSocket} from '../providers/SocketProvider';

interface Conversation {
    id: number;
    name: string;
}

const Sidebar: React.FC = () => {
    const { conversationRoom, setConversationRoom } = useConversation();
    const { conversations, setConversations } = useConversations();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    return (
        <div className="fixed w-1/6 h-full top-0 left-0 bg-gray-700">
            <div className="p-4 text-white">
                <div className="text-center mb-8">
                    <img src="logo.png" alt="Logo" className="w-16 h-16 mx-auto" />
                </div>
                <nav>
                    <ul className="space-y-4">
                        {conversations.map((conversation) => (

                            <li key={conversation.id}>
                                <a
                                    href="#"
                                    className="block px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                                    onClick={() => setConversationRoom(conversation)}
                                >
                                    {conversation.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;
