import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';

export type AppSocket = {
    onMessage(callback: (message: { conversationRoomId: number; text: string }) => void): () => void;
    send(message: string, conversationRoomId: number): void;
};

export const socketContext = createContext<AppSocket | null>(null);
export const messagesContext = createContext<{ messages: string[]; setMessages: (messages: string[]) => void } | null>(null);
export const conversationContext = createContext<{ conversationRoom: Conversation | null; setConversationRoom: (conversationRoom: Conversation) => void; } | null>(null);
export const conversationsContext = createContext<{ conversations: Conversation[]; setConversations: (conversations: Conversation[]) => void; } | null>(null);

class Conversation {
    id: number;
    name: string;
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class Message {
    content: string;
    userId: number;
    conversationId: number;
    constructor(content: string, userId: number, conversationId: number) {
        this.content = content;
        this.userId = userId;
        this.conversationId = conversationId;
    }
}

export function SocketProvider({ children }: { children: ReactNode }) {
    const socket = useMemo(() => io('ws://localhost:3000'), []);
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationRoom, setConversationRoom] = useState<Conversation | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const appSocket = useMemo<AppSocket>(
        () => ({
            onMessage(callback) {
                socket.on('message', callback);

                return () => socket.off('message', callback);
            },
            send(message, conversationRoomId) {
                socket.emit('message', { text: message, conversationRoomId });
                // Manually update the messages state
                setMessages(prevMessages => [...prevMessages, message]);
            },
        }),
        [socket]
    );

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('http://localhost:3001/conversations');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);
                setConversationRoom(data[0] || null);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        if (conversationRoom) {
            socket.emit('joinRoom', conversationRoom.id);
            getRoomMessages(conversationRoom.id);
        }
    }, [conversationRoom]);

    const getRoomMessages = async (conversationId: number) => {
        try {
            const response = await fetch(`http://localhost:3001/messages/${conversationId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            setMessages(data.map((message: { content: string }) => message.content));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        const handleMessage = (message: { conversationRoomId: number; text: string }) => {
            if (message.conversationRoomId === conversationRoom?.id) {
                setMessages(prevMessages => [...prevMessages, message.text]);
            }
        };

        const unsubscribe = appSocket.onMessage(handleMessage);
        return () => unsubscribe();
    }, [conversationRoom, appSocket]);

    return (
        <socketContext.Provider value={appSocket}>
            <conversationsContext.Provider value={{ conversations, setConversations }}>
                <conversationContext.Provider value={{ conversationRoom, setConversationRoom }}>
                    <messagesContext.Provider value={{ messages, setMessages }}>
                        {children}
                    </messagesContext.Provider>
                </conversationContext.Provider>
            </conversationsContext.Provider>
        </socketContext.Provider>
    );
}

export function useSocket() {
    const socket = useContext(socketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
}

export function useMessages() {
    const messages = useContext(messagesContext);
    if (!messages) {
        throw new Error('useMessages must be used within a SocketProvider');
    }
    return messages;
}

export function useConversation() {
    const conversation = useContext(conversationContext);
    if (!conversation) {
        throw new Error('useConversation must be used within a SocketProvider');
    }
    return conversation;
}

export function useConversations() {
    const conversations = useContext(conversationsContext);
    if (!conversations) {
        throw new Error('useConversations must be used within a SocketProvider');
    }
    return conversations;
}
