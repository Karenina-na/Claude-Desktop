// if you need to add some types for electron, you can add here
// for electron ipcRenderer
export interface IElectronAPI {
    getPath: () => Promise<void>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}