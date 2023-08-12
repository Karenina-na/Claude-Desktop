// src/main/autoUpdater.js

import { app, dialog } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'
import { name } from '../../package.json'
import path from "path";
import { getLocalData, setLocalData, sleep } from './helperUpdater'

export async function autoUpdateInit() {
    // log
    logger.transports.file.maxSize = 1002430 // 10M
    logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
    logger.transports.file.resolvePath = () => join(path.join(app.getPath('home'), '.claude'), 'logs/claude.log')

    autoUpdater.logger = logger
    autoUpdater.disableWebInstaller = false
    autoUpdater.autoDownload = false // Please write this as "false." When written as "true," I am encountering a permission issue and unable to determine the exact cause.
    autoUpdater.on('error', (error) => {
        logger.error(['check update error', error])
    })
    // Upon detecting available updates, it will be triggered to automatically initiate the download process for the updates.
    autoUpdater.on('update-available', (info) => {
        logger.info('Updates have been detected. Initiating the download of the new version.')
        logger.info(info)
        const { version } = info
        askUpdate(version)
    })
    // Upon detecting the absence of available updates, it will be triggered accordingly.
    autoUpdater.on('update-not-available', () => {
        logger.info('No updates have been detected.')
    })
    // Implementing the delta download logic during the application's startup.
    autoUpdater.on('download-progress', async (progress) => {
        logger.info(progress)
    })
    // Upon the completion of the update download process, it will be triggered accordingly.
    autoUpdater.on('update-downloaded', (res) => {
        logger.info('Download complete! Prompting to install updates.')
        logger.info(res)
        // To use 'dialog,' it must be created after the 'BrowserWindow' has been created.
        dialog.showMessageBox({
                type: 'info',
                buttons: ['OK'],
                title: 'Upgrade notification.！',
                message: 'The latest application has been downloaded for you. \n' +
                    'Click \'OK\' to replace it with the newest version immediately!',
                textWidth: 250,
            })
            .then(() => {
                logger.info('Exit the application, installation will begin!')
                // Restart the application and install the update after downloading.
                // It should only be called after the 'update-downloaded' event has been emitted.
                autoUpdater.quitAndInstall()
            })
    })

    await sleep(3000)
    // Each time it starts, it will automatically perform a version check and update itself accordingly,
    // either through scheduled updates or any other suitable method.
    await autoUpdater.checkForUpdates()
}

async function askUpdate(version:any) {
    logger.info(`The latest version. ${version}`)
    let { updater } = getLocalData()
    let { auto, version: ver, skip } = updater || {}
    logger.info(
        JSON.stringify({
            ...updater,
            ver: ver,
        })
    )
    if (skip && version === ver) return
    if (auto) {
        // Proceed with the update download without further inquiry.
        await autoUpdater.downloadUpdate()
    } else {
        const { response, checkboxChecked } = await dialog.showMessageBox({
            type: 'question',
            title: `${name} software update notification.`,
            buttons: ['Closing', 'Skipping this version.', 'Installing the update.'],
            message: `The latest version is ${version}，the current version is ${app.getVersion()}，Is it necessary to download updates now ?`,
            defaultId: 2,
            cancelId: -1,
            checkboxLabel: 'Automatic updates installation.',
            checkboxChecked: false,
            textWidth: 250,
        })
        if ([1, 2].includes(response)) {
            let updaterData = {
                version: version,
                skip: response === 1,
                auto: checkboxChecked,
            }
            setLocalData({
                updater: {
                    ...updaterData,
                },
            })
            if (response === 2) await autoUpdater.downloadUpdate()
            logger.info(['Updating process.', JSON.stringify(updaterData)])
        } else {
            logger.info(['Updating process.', 'Disable update notifications.'])
        }
    }
}

