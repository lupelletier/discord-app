import React, { useEffect, useState } from 'react';
import {conversationContext, useConversation, useConversations, useSocket} from '../providers/SocketProvider';



const Sidebar: React.FC = () => {
    const [conversations, setConversations] = useState([]);
    const {  setConversationRoom } = useConversation();
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('http://localhost:3001/conversations');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);

            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

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
