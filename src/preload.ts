// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("MessageAPI", {
    addMessageListener(callback: (message: string) => void) {
        const wrappedCallback = (_: IpcRendererEvent, message: string) => 
            callback(message);
        ipcRenderer.on("message", wrappedCallback);
        return () => ipcRenderer.off("message", wrappedCallback);
    }, 
    send (message: string) {
        ipcRenderer.send("socket-message",message);
    }
})