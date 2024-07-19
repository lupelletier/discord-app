import React, { ReactNode, createContext, useContext, useMemo, useEffect, useState } from 'react';
import io from 'socket.io-client';

export type AppSocket = {
    onMessage(callback: (message: { conversationRoomId: number; text: string }) => void): () => void;
    send(message: string, conversationRoomId: number): void;
};

export const socketContext = createContext<AppSocket | null>(null);
export const messagesContext = createContext<{ messages: Record<number, string[]>; setMessages: (messages: (prevMessages: any) => any) => void; } | null>(null);
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

export function SocketProvider({ children }: { children: ReactNode }) {
    const socket = useMemo(() => io('ws://localhost:3000'), []);
    const [messages, setMessages] = useState<Record<number, string[]>>({});
    const [conversationRoom, setConversationRoom] = useState<Conversation | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isConversationsFetched, setIsConversationsFetched] = useState(false);

    const appSocket = useMemo<AppSocket>(
        () => ({
            onMessage(callback) {
                socket.on('message', callback);
                return () => socket.off('message', callback);
            },
            send(message, conversationRoomId) {
                socket.emit('message', { text: message, conversationRoomId });
            },
        }),
        [socket]
    );

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('http://localhost:3003/conversations');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);
                setConversationRoom(data[0] || null);
                setIsConversationsFetched(true);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        if (!isConversationsFetched) return;

        const handleMessage = (message: { conversationRoomId: number; text: string }) => {
            setMessages((prevMessages) => {
                const { conversationRoomId, text } = message;
                const roomMessages = prevMessages[conversationRoomId] || [];
                return {
                    ...prevMessages,
                    [conversationRoomId]: [...roomMessages, text],
                };
            });
        };

        const unsubscribe = appSocket.onMessage(handleMessage);

        socket.on('connect', () => {
            if (conversationRoom) {
                socket.emit('joinRoom', conversationRoom.id);
            }
        });

        return () => {
            unsubscribe();
            socket.disconnect();
        };
    }, [appSocket, socket, conversationRoom, isConversationsFetched]);

    useEffect(() => {
        if (conversationRoom) {
            socket.emit('joinRoom', conversationRoom.id);
        }
    }, [conversationRoom, socket]);

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
