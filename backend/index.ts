import { Server, Socket } from "socket.io";
import connection from "./db";
import { ResultSetHeader } from "mysql2";
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

app.get('/conversations', async (req, res) => {
    const query = 'SELECT * FROM Conversations';
    try {
        const[ rows] = await connection.query(query);
        console.log('Fetched conversations:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const io = new Server({
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket: Socket) => {
    console.log("New connection", socket.id);

    socket.on('joinRoom', (conversationId: number) => {
        socket.join(`room${conversationId}`);
        console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    socket.on("message", async ({ message, conversationId }: { message: string, conversationId: number }) => {
        console.log(`New message from client: ${message} in conversation ${conversationId}`);

        const userId = 1; // Assuming a user with ID 1 exists
        const query = 'INSERT INTO Messages (content, userId, conversationId) VALUES (?, ?, ?)';

        try {
            const [results] = await connection.query<ResultSetHeader>(query, [message, userId, conversationId]);
            console.log('Message inserted with ID:', results.insertId);

            io.to(`room${conversationId}`).emit("message", { message, userId, conversationId, id: results.insertId });
        } catch (err) {
            console.error('Error inserting message into database:', err);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});

io.listen(3000);
console.log("Socket.io server running on port 3001");
