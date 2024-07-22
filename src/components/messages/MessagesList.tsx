import React, {useState} from "react";
import {useEffect} from "react";
import MessageCard from "../MessageCard";

export default function MessagesList ({conversationId}: {conversationId: number}) {
    const [messages, setMessages] = useState<string[]>([]);

    console.log(conversationId);
    useEffect(() => {
        fetch(`http://localhost:3001/messages/${conversationId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setMessages(data.map((message: { content: string }) => message.content));
            });

    }, []);
    return (
        <div className='p-4 h-full'>
            <div className='flex flex-col h-5/6 justify-end top-0'>
                {messages.map((message, index) =>
                    <MessageCard key={index} message={message}/>
                )}
            </div>
        </div>
    );
}