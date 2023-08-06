// load node.js modules in the renderer process
window.addEventListener('DOMContentLoaded', () => {
    // console.log('DOMContentLoaded')

    const { contextBridge, ipcRenderer } = require('electron')

    contextBridge.exposeInMainWorld('electronAPI', {
        getPath: () => ipcRenderer.invoke('getPath'),
    })
})