import connection from './db';

async function insertInitialData() {
    const insertUser = `
        INSERT INTO Users (username, password) VALUES ('testuser', 'password')
    `;

    try {
        await connection.query(insertUser);
        console.log('Initial data inserted successfully.');
    } catch (err) {
        console.error('Error inserting initial data:', err);
    }
}

insertInitialData().then(() => process.exit(0));
