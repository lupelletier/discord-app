import connection from './db';

async function insertInitialData() {
    const insertUser = `
        INSERT INTO Users (username, password) VALUES ('testuser', 'password')
    `;
    const insertConversations = `
        INSERT INTO Conversations (name) VALUES ('Room1'), ('Room2')
    `;
    try {
        await connection.query(insertUser);
        await connection.query(insertConversations);

        console.log('Initial data inserted successfully.');
    } catch (err) {
        console.error('Error inserting initial data:', err);
    }
}

insertInitialData().then(() => process.exit(0));
