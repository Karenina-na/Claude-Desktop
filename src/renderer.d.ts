// if you need to add some types for electron, you can add here
// for electron ipcRenderer
export interface IElectronAPI {
    getUpdateInfo: () => Promise<any>,
    setUpdateInfo: (arg: any) => Promise<any>,
    resetUpdateInfo: () => Promise<any>,
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