import { Server, Socket } from "socket.io";
import connection from "./db";
import {ResultSetHeader} from "mysql2";

function main() {

    const io = new Server({
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log("New connection", socket.id);

        // Sending the socket id to the client
        socket.emit("message", "Welcome to chat!", socket.id);

        // Listening for messages from the client
        socket.on("message", async (message: string, conversationId:string) => {
            console.log("New message from client: ", message, conversationId);

            // Assuming a user with ID 1 exists
            const userId = 1;
            const query = 'INSERT INTO Messages (content, userId, conversationId) VALUES (?, ?, 1)';

            try {
                const [results] = await connection.query<ResultSetHeader>(query, [message, userId]);
                console.log('Message inserted with ID:', results.insertId);
                // Sending the received message back to the client
                socket.emit("message", message);
            } catch (err) {
                console.error('Error inserting message into database:', err);
            }
        });
    });

    io.listen(3000);

    console.log("Server running on port 3000");
}

main();
