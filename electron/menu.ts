import { app, dialog, BrowserWindow, nativeTheme , MenuItemConstructorOptions } from 'electron'
import path from "path";

export default function createMenu() {
    const menuTemplate: Array<MenuItemConstructorOptions> = [{
        label: 'Claude',
        submenu: [
            {
                label: 'About Claude', click: () => {
                    dialog.showMessageBox({
                        icon: 'public/logo.png',
                        title: 'About Claude',
                        // package.json version
                        message: `Version ${app.getVersion()}`,
                        detail: 'Claude is a desktop app for the Claude chatbot.',
                        buttons: ['OK']
                    });
                }
            },
            {label: 'Check for Updates'},
            {
                role: 'minimize', label: 'Hide', accelerator: 'ctrl+H', click: () => {
                }
            },
            {type: 'separator'},
            {role: 'quit', label: 'Quit', accelerator: 'ctrl+W'}
        ]
    }, {
        label: 'Preferences',
        submenu: [{
            label: 'Control Center',
            accelerator: 'ctrl+shift+P',
            click: () => {
                // 新开一个窗口
                const win = new BrowserWindow({
                    title: 'Control Center',
                    width: 800,
                    height: 600,
                    icon: "public/logo.png",
                    parent: BrowserWindow.getFocusedWindow(),
                    modal: true,
                    center: true,
                    webPreferences: {
                        nodeIntegration: true,
                        nodeIntegrationInWorker: true,
                        webSecurity: false,
                    }
                })
                if (app.isPackaged) {
                    win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
                } else {
                    win.loadURL('http://localhost:5173/')
                }
            }
        },
            {type: 'separator'},
            {
                label: 'Stay On Top', type: 'checkbox', checked: false, click: () => {
                    const win = BrowserWindow.getFocusedWindow()
                    if (win) {
                        win.setAlwaysOnTop(!win.isAlwaysOnTop());
                    }
                }, accelerator: 'ctrl+T'
            },
            {
                label: 'Theme', submenu: [
                    {label: 'Light', type: 'radio', click: () => {
                            nativeTheme.themeSource = 'light';
                        }},
                    {label: 'Dark', type: 'radio', click: () => {
                            nativeTheme.themeSource = 'dark';
                        }},
                    {label: 'System', type: 'radio', checked: true, click: () => {
                            nativeTheme.themeSource = 'system';
                    }},
                ]
            },]
        }, {
            label: 'Window',
            submenu: [
                {role: 'minimize'},
                {role: 'togglefullscreen'}
            ]
        }, {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'copy'},
                {role: 'paste'},
                {type: 'separator'},
                {role: 'selectAll'},
            ]
        }, {
            label: 'View',
            submenu: [
                {role: 'reload'},
                {role: 'forceReload'},
                {type: 'separator'},
                {role: 'resetZoom'},
                {role: 'zoomIn'},
                {role: 'zoomOut'},
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://github.com/Karenina-na/Claude-Desktop')
                    }
                },
                {
                    label: 'About Author',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://github.com/Karenina-na')
                    }
                },
                {type: 'separator'},
                {role: 'toggleDevTools'},
            ]
        }
    ]

    return menuTemplate;
}