import { Server, Socket } from "socket.io";
import connection from "./db";
import { ResultSetHeader } from "mysql2";
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/conversations', async (req, res) => {
    const query = 'SELECT * FROM Conversations';
    try {
        const [rows] = await connection.query(query);
        console.log('Fetched conversations:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const query = 'SELECT * FROM Messages WHERE conversationId = ?';
    try {
        const [rows] = await connection.query(query, [conversationId]);
        console.log(`Fetched messages for conversation ${conversationId}:`, rows);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching messages:', err);
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

    socket.on('joinRoom', async (conversationId: number) => {
        socket.join(`room${conversationId}`);

        console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    socket.on('message', ({ text, conversationRoomId }) => {
        if (typeof text !== 'string' || !text.trim() || typeof conversationRoomId !== 'number') {
            console.error('Invalid message or conversationRoomId received', { text, conversationRoomId });
            return;
        }
        const userId = 1; // Hardcoded user ID for now
        // Perform database insert
        connection.query('INSERT INTO Messages (content, userId, conversationId) VALUES (?, ?, ?)', [text, userId, conversationRoomId])
            .then(() => {
                console.log('Message inserted successfully');
            })
            .catch(err => {
                console.error('Error inserting message into database:', err);
            });
    });
});

app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});

io.listen(3000);
console.log("Socket.io server running on port 3001");
