// if you need to add some types for electron, you can add here
// for electron ipcRenderer
export interface IElectronAPI {
    quit: () => void,
    getConfigPath: () => Promise<void>,
    openConfig: () => void,
    getUpdateInfo: () => Promise<any>,
    setUpdateInfo: (arg: any) => Promise<any>,
    resetUpdateInfo: () => Promise<any>,
    getConfig: () => Promise<void>,
    updateConfig: (config: any) => Promise<void>,
    resetConfig: () => Promise<void>,
    getPromptURL: () => Promise<void>,
    getPrompt: () => Promise<any>,
    setPrompt: (prompt: any) => Promise<void>,
    resetPrompt: () => Promise<any>,
    syncPrompt: () => Promise<void>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}