import React, { ReactNode, createContext, useContext, useMemo, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export type AppSocket = {
    onMessage(callback: (message: string) => void): () => void;
    send(message: unknown): void;
}

// create context for socket, set socket
export const socketContext = createContext<AppSocket | null>(null);

// create context for messages, set messages
export const messagesContext = createContext<{ messages: string[]; setMessages(messages: string[]): void; } | null>(null);

// create socket provider
export function SocketProvider({ children }: { children: ReactNode }) {
    const socket = useMemo(() => io('ws://localhost:3000'), []);

    const [messages, setMessages] = useState<string[]>([]);

    const appSocket = useMemo<AppSocket>(
        () => ({
            onMessage(callback) {
                socket.on('message', callback);
                return () => socket.off('message', callback); // Return a cleanup function
            },
            send(message) {
                socket.send(message, 1);
            },
        }),
        [socket]
    );

    useEffect(() => {
        const handleMessage = (message: string) => {
            console.log('New message: ', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        const unsubscribe = appSocket.onMessage(handleMessage);

        socket.on('connect', () => {
            console.log('Connected to server');
            socket.emit('message', 'Hello from renderer');
        });

        return () => {
            unsubscribe();
            socket.disconnect();
        };
    }, [appSocket, socket]);

    return (
        <socketContext.Provider value={appSocket}>
            <messagesContext.Provider value={{ messages, setMessages }}>
                {children}
            </messagesContext.Provider>
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
