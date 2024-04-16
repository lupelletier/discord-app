import React, { createContext, useContext, useEffect, useMemo } from 'react';
import io, { Socket } from 'socket.io-client';

export const socketContext = createContext<Socket|null>(null);
// create context for messages, set messages
export const messagesContext = createContext<{messages: string[]; setImages(messages: string[]): void;} | null >(null);


const SocketProvider = ({children}: {children: React.ReactNode}) => {
    const socket = useMemo(() => io('ws://localhost:3000'), []);
    
    const [messages, setMessages] = React.useState<string[]>([]);
    // useMemo to pass messages 
    useEffect(()=>{
        socket.on('connect', () => {
            socket.emit('message', 'Hello from renderer');
            socket.on('message', (message: string) => {
                console.log('New message: ', message);
                handleMessages(message);
            });
        });
        return () => {
            socket.disconnect();
        };
    
    }, [socket]); // Include socket in the dependency array to avoid potential issues
    
    useEffect(() => {
        console.log(messages);
    }, [messages]); // Log messages whenever it changes
    
    const handleMessages = (message: string) => {
        console.log('New message handled: ', message);
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log(messages);
    }
    return (
        <socketContext.Provider value={socket}>
            <messagesContext.Provider value={{messages, setImages: setMessages}}>
                {children}
            </messagesContext.Provider>
        </socketContext.Provider>
    );
};

export default SocketProvider;
