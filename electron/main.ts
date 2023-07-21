import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Claude',
        width: 1000,
        height: 800,
        icon: "public/logo.png",
    })

    win.loadURL("https://claude.ai/chat/")

})