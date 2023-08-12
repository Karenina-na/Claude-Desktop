// load node.js modules in the renderer process
window.addEventListener('DOMContentLoaded', () => {
    // console.log('DOMContentLoaded')

    const { contextBridge, ipcRenderer } = require('electron')

    contextBridge.exposeInMainWorld('electronAPI', {
        getUpdateInfo: () => ipcRenderer.invoke('getUpdateInfo'),
        setUpdateInfo: (updateInfo) => ipcRenderer.invoke('setUpdateInfo', updateInfo),
        resetUpdateInfo: () => ipcRenderer.invoke('resetUpdateInfo'),
        quit: () => ipcRenderer.send('quit'),
        getConfigPath: () => ipcRenderer.invoke('getConfigPath'),
        getConfig: () => ipcRenderer.invoke('getConfig'),
        openConfig: () => ipcRenderer.send('openConfig'),
        updateConfig: (config) => ipcRenderer.invoke('updateConfig', config),
        resetConfig: () => ipcRenderer.invoke('resetConfig'),
        getPrompt: () => ipcRenderer.invoke('getPrompt'),
        setPrompt: (prompt) => ipcRenderer.invoke('setPrompt', prompt),
        resetPrompt: () => ipcRenderer.invoke('resetPrompt'),
        syncPrompt: () => ipcRenderer.invoke('syncPrompt'),
    })
})