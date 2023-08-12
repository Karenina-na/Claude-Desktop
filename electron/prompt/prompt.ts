import {join} from 'path'
import fs from 'fs'
import {app} from 'electron'
import logger from 'electron-log'
import https from "https";

const promptUrl = 'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv'
const promptPath = join(join(app.getPath('home'), '.claude'), 'prompt')
const promptInfo = join(promptPath, 'promptInfo.json')

function getPrompt() {
    if (!fs.existsSync(promptInfo)) {
        fs.writeFileSync(promptInfo, JSON.stringify({}), { encoding: 'utf-8' })

        // download
        logger.info('downloading prompt...')
        downloadPrompt().then(r => {
            logger.info('download prompt success')
        }).catch(e => {
            logger.error('download prompt failed')
            logger.error(e)
        })
    }
    let data = fs.readFileSync(promptInfo, { encoding: 'utf-8' })
    return JSON.parse(data)
}

async function downloadPrompt() {
    let data = await new Promise((resolve, reject) => {
        https.get(promptUrl, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve(data)
            })
        }).on('error', (e) => {
            reject(e)
        })
    })
    console.log(data)
}