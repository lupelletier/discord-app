import React, { useContext } from 'react';
import { socketContext } from '../providers/SocketProvider';
export default function ChatBox() {
    const socket = useContext(socketContext);
    const [message, setMessage] = React.useState<string>('');
    console.log()
    // Function to handle sending the message
    const sendMessage = () => {
        if (message.trim() !== '') { // Check if the message is not empty
            socket.emit('message', message); // Emit the message to the server
            setMessage(''); // Clear the input field after sending the message
        }
    };
    console.log(message)
    return (
        <div className='fixed bottom-0 w-5/6 bg-gray-900'>
        <div className="flex justify-evenly items-center p-4 border-t border-gray-600">
            <input
                onKeyDown={(e) => {
                    if (e.key === "Enter")
                       sendMessage();
                    }}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-700 rounded-md p-2 text-white bg-gray-800 focus:outline-none"
            />
            <button onClick={sendMessage} className="bg-gray-700 ml-10 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-800 focus:outline-none">Send</button>
        </div>
    </div>
    );
}


