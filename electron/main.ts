import { app,protocol, BrowserWindow, Menu, Tray } from 'electron'
import menuTemplate from "./menu";

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
            webSecurity: false,
        }
    })

    win.loadURL('https://claude.ai/chat/')

    // Tray
    const tray: Tray = new Tray('public/logo.png');
    tray.on('click', () => {
        if (win.isVisible()) {
            win.hide();
        }else{
            win.show();
        }
    });
})

// create menu
app.on('ready',() =>{
    const m = Menu.buildFromTemplate(menuTemplate());
    Menu.setApplicationMenu(m);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})