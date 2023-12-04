import {app, BrowserWindow, ipcMain, Menu, protocol, shell, Tray} from 'electron'
import menuTemplate from "./menu";
import cmdInit from "./cmd";
import {ConfigFactory, ConfigUpdate} from "../public/config"
import path, {join} from "path";
import Config from "../public/configModel";
import {autoUpdateInit} from "./update/autoUpdater";
import {getLocalData, setLocalData} from "./update/helperUpdater";
import { promptUrl, downloadAndGetPrompt, setPromptInfo, resetPromptInfo, syncPromptInfo,} from "./prompt/prompt";
import logger from 'electron-log'

// log
logger.transports.file.maxSize = 1002430 // 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
logger.transports.file.resolvePath = () => join(path.join(app.getPath('home'), '.claude'), 'logs/claude.log')

app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
]);

// config
const config = ConfigFactory();

app.whenReady().then(() => {

    const win= new BrowserWindow({
        title: 'Claude',
        width: config.main_width,
        height: config.main_height,
        center: true,
        icon: "public/logo.png",
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
        }
    })

    // set user agent
    let session = win.webContents.session;
    session.setUserAgent(config.ua_tray);

    // load url
    win.loadURL('https://claude.ai/chat/').then(r =>{
        // 执行cmdInit
        !win.webContents.executeJavaScript(
            `
            if(!window.__cmdInit__){
                window.__cmdInit__ = true;
                ${cmdInit.toString()}
                cmdInit();
            }
            `
        ) && logger.error('cmdInit failed')
        }

    ).catch(e => logger.error(e));

    // tray
    createTray(win);

    // dev tools
    if (!app.isPackaged) {
        // win.webContents.openDevTools({ mode: 'detach' });
    }

    // stay on top
    if (config.stay_on_top) {
        if (win) {
            win.setAlwaysOnTop(true);
        }
    }

})

// create menu
app.on('ready',() =>{
    const m = Menu.buildFromTemplate(menuTemplate(config));
    Menu.setApplicationMenu(m);
});

// create Tray
function createTray(win: BrowserWindow){
    // Tray
    const tray: Tray = new Tray(path.join(__dirname, '../public/logo.png'));
    let ControlCenterWin: BrowserWindow | null = null;
    const contextMenu = Menu.buildFromTemplate([{
            label: 'Control Center',
            click: () => {
                if (ControlCenterWin) {
                    ControlCenterWin.focus();
                    return;
                }
                // Create the browser window.
                ControlCenterWin = new BrowserWindow({
                    title: 'Control Center',
                    width: 1000,
                    height: 650,
                    resizable: false,
                    icon: "public/logo.png",
                    modal: true,
                    center: true,
                    parent: BrowserWindow.getFocusedWindow(),
                    webPreferences: {
                        nodeIntegration: true,
                        nodeIntegrationInWorker: true,
                        webSecurity: false,
                        preload: path.join(__dirname, '../electron/preload.js')
                    },
                })
                if (app.isPackaged) {
                    ControlCenterWin.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'controlCenter' })
                } else {
                    ControlCenterWin.loadURL('http://localhost:5173/#/controlCenter')
                }
                // Emitted when the window is closed.
                ControlCenterWin.on('closed', () => {
                    ControlCenterWin = null
                })
            }
        },
        { label: 'Show Window', click: () => win.show() },
        { label: 'Reload', click: () => win.reload() },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() }
    ])

    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        if (win.isVisible()) {
            win.hide();
        }else{
            win.show();
        }
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// render operation
app.whenReady().then(() => {

    const { ipcMain } = require('electron')

    // quit
    ipcMain.on('quit', () => {
        app.quit()
    })

    // get config path
    ipcMain.handle('getConfigPath', () => {
        return path.join(app.getPath('home'), '.claude')
    })

    // open config
    ipcMain.on('openConfig', () => {
        const configDir = path.join(app.getPath('home'), '.claude');
        const { shell } = require('electron')
        shell.openPath(configDir).then(r => logger.info(r))
    })

    // get update info
    ipcMain.handle('getUpdateInfo', () => {
        let { updater } = getLocalData()
        let { auto, version: ver, skip } = updater || {}
        if (auto) {
            // file exists
            return { auto, ver, skip }
        }else{
            // file not exists
            let updaterData = {
                version: app.getVersion(),
                skip: false,
                auto: false,
            }
            setLocalData({
                updater: {
                    ...updaterData,
                },
            })
            return { auto: false, version: app.getVersion() , skip: false }
        }
    })

    // set update info
    ipcMain.handle('setUpdateInfo', (event, arg) => {
        setLocalData({
            updater: {
                ...arg,
            },
        })
        return "ok";
    })

    // reset update info
    ipcMain.handle('resetUpdateInfo', () => {
        setLocalData({
            updater: {
                version: app.getVersion(),
                skip: false,
                auto: false,
            },
        })
        return "ok"
    })

    // get config
    ipcMain.handle('getConfig', () => {
        return ConfigFactory();
    })

    // update config
    ipcMain.handle('updateConfig', (event, arg) => {
        ConfigUpdate(arg);
        return "ok";
    })

    // reset config
    ipcMain.handle('resetConfig', () => {
        const config = new Config();
        ConfigUpdate(config);
        return "ok"
    })

    // get prompt url
    ipcMain.handle('getPromptURL', () => {
        return promptUrl;
    })

    // open prompt
    ipcMain.on('openPrompt', () => {
        const { shell } = require('electron')
        shell.openExternal(config.prompt_path).then(r => logger.info(r))
    })

    // get prompt
    ipcMain.handle('getPrompt', () => {
        return downloadAndGetPrompt(config.prompt_path);
    })

    // set prompt
    ipcMain.handle('setPrompt', (event, arg) => {
        setPromptInfo(config.prompt_path, arg);
        return "ok";
    })

    // reset prompt
    ipcMain.handle('resetPrompt', () => {
        return resetPromptInfo(config.prompt_path);
    })

    // sync prompt
    ipcMain.handle('syncPrompt', () => {
        syncPromptInfo(config.prompt_path).then(r => logger.info(r)).catch(e => logger.error(e));
        return "ok"
    })

    // auto update
    autoUpdateInit().then((r: any) => logger.info(r));

})