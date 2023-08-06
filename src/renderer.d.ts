// if you need to add some types for electron, you can add here
// for electron ipcRenderer
export interface IElectronAPI {
    quit: () => void,
    getConfigPath: () => Promise<void>,
    getConfig: () => Promise<void>,
    openConfig: () => void,
    updateConfig: (config: any) => Promise<void>,
    resetConfig: () => Promise<void>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}