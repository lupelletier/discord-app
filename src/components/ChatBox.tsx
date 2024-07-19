import React, { useEffect } from 'react';
import { useSocket, useMessages, useConversation } from '../providers/SocketProvider';

const ChatBox: React.FC = () => {
    const socket = useSocket();
    const { setMessages } = useMessages();
    const { conversationRoom } = useConversation();
    const [input, setInput] = React.useState('');

    const sendMessage = () => {
        if (input.trim() !== '' && conversationRoom) {
            const newMessage = input.trim();
            socket.send(newMessage, conversationRoom.id);
            setMessages((prevMessages: any) => ({
                ...prevMessages,
                [conversationRoom.id]: [...(prevMessages[conversationRoom.id] || []), `You: ${newMessage}`]
            }));
            setInput('');
        }
    };

    useEffect(() => {
        console.log(input);
    }, [input]);

    return (
        <div className="fixed bottom-0 w-5/6 bg-gray-900">
            <div className="flex flex-col h-full">
                <div className="flex justify-evenly items-center p-4 border-t border-gray-600">
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-700 rounded-md p-2 text-white bg-gray-800 focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-gray-700 ml-4 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-800 focus:outline-none"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
