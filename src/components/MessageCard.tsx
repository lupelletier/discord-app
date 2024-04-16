import React from 'react';
export default function MessageCard({message}: {message: string}) {

    return (
        <div className='p-4'>
            {message}
        </div>
    );
}