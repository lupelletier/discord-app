import {useMessages} from "../providers/SocketProvider";


export const getRoomMessages = async (conversationId: number) => {
    try {
        const response = await fetch(`http://localhost:3001/messages/${conversationId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        useMessages().setMessages(data.map((message: { content: string }) => message.content));
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};
