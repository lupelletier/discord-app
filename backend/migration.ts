import connection from './db';

async function createTables() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `;

    const createConversationsTable = `
        CREATE TABLE IF NOT EXISTS Conversations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        );
    `;

    const createMessagesTable = `
        CREATE TABLE IF NOT EXISTS Messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content TEXT NOT NULL,
            userId INT,
            conversationId INT,
            FOREIGN KEY (userId) REFERENCES Users(id),
            FOREIGN KEY (conversationId) REFERENCES Conversations(id)
        );
    `;

    try {
        await connection.query(createUsersTable);
        await connection.query(createConversationsTable);
        await connection.query(createMessagesTable);
        console.log('Tables created or verified successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

createTables().then(() => process.exit(0));
