import React from 'react';
import {Message} from "../providers/SocketProvider";

export default function MessageCard({message}: {message: string}) {
    return (
        <div className='bg-white shadow-md rounded-md p-4 mb-4 w-fit'>
            {message}
        </div>
    );
}
