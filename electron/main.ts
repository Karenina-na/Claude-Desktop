import { app,protocol, BrowserWindow, Menu, Tray } from 'electron'
import menuTemplate from "./menu";
import createConfig from "./config"
import path from "path";

app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
]);

app.whenReady().then(() => {
    const win= new BrowserWindow({
        title: 'Claude',
        width: 1000,
        height: 800,
        center: true,
        icon: "public/logo.png",
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, '../electron/preload.js'),
            webSecurity: false,
        }
    })

    // load url
    win.loadURL('https://claude.ai/chat/')

    // tray
    createTray(win);

    // dev tools
    if (!app.isPackaged) {
        win.webContents.openDevTools()
    }

    // create config
    createConfig();

    // event
    win.webContents.on('did-finish-load', () => {

    });


})


// create menu
app.on('ready',() =>{
    const m = Menu.buildFromTemplate(menuTemplate());
    Menu.setApplicationMenu(m);
});


// create Tray
function createTray(win: BrowserWindow){
    // Tray
    const tray: Tray = new Tray(path.join(__dirname, '../public/logo.png'));
    const contextMenu = Menu.buildFromTemplate([{
            label: 'Control Center',
            click: () => {
                // Create the browser window.
                const win = new BrowserWindow({
                    title: 'Control Center',
                    width: 800,
                    height: 600,
                    icon: "public/logo.png",
                    modal: true,
                    center: true,
                    webPreferences: {
                        nodeIntegration: true,
                        nodeIntegrationInWorker: true,
                        webSecurity: false,
                    }
                })
                if (app.isPackaged) {
                    win.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'controlCenter' })
                } else {
                    win.loadURL('http://localhost:5173/#/controlCenter')
                }
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
