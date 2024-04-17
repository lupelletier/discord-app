import { Server, Socket } from "socket.io";

function main() {
    const io = new Server({
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log("New connection", socket.id);

        // Sending the socket id to the client
        socket.emit("message", "welcome to chat !", socket.id);

        // Listening for messages from the client
        socket.on("message", (message: string) => {
            console.log("New message from client: ", message);
            // Sending the received message back to the client
            socket.emit("message", message);
        });
    });

    io.listen(3000); // Moved this line here

    console.log("Server running on port 3000");
}

main();
