import { app, BrowserWindow } from 'electron';
import path from 'path';
import { io, Socket } from 'socket.io-client';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Create the socket connection
const socket: Socket = io('ws://localhost:3000');

let mainWindow1: BrowserWindow | null = null;
let mainWindow2: BrowserWindow | null = null;

// Create and configure windows
const createWindow = (user: string, room: string) => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        x: user === 'user1' ? 0 : 800, // Position windows side by side
        y: 0,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            // Enable contextBridge for safe IPC
            nodeIntegration: false,
        },
    });

    // Load the HTML file or URL
    if (process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Open DevTools (remove in production)
    mainWindow.webContents.openDevTools();

    // Handle messages
    mainWindow.webContents.on('did-finish-load', () => {
        // Pass user and room to renderer process
        console.log('Sending init-data:', { user, room });
        mainWindow.webContents.send('init-data', { user, room });


    });

    return mainWindow;
};

// Create the windows
const createWindows = () => {
    mainWindow1 = createWindow('user1', 'Room1');
    mainWindow2 = createWindow('user2', 'Room1');

    // Handle incoming messages from socket
    const handleMessages = (message: any) => {
        console.log('Received message:', message);

        // Send the message to appropriate window
        if (mainWindow1 && mainWindow1.webContents) {
            mainWindow1.webContents.send('message', message);
        }
        if (mainWindow2 && mainWindow2.webContents) {
            mainWindow2.webContents.send('message', message);
        }
    };

    socket.on('message', handleMessages);

    const cleanUp = () => {
        socket.off('message', handleMessages);
    };

    mainWindow1.on('closed', cleanUp);
    mainWindow2.on('closed', cleanUp);
};

// Handle app readiness and activation
app.on('ready', createWindows);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindows();
    }
});
