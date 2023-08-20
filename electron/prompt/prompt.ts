import {join} from 'path'
import fs from 'fs'
import logger from 'electron-log'
import https from "https";

const promptUrl = 'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv'
// const promptPath = join(app.getPath('home'), '.claude', 'prompt')
// const promptInfo = join(promptPath, 'promptInfo.json')


function downloadAndGetPrompt(promptPath:string) {
    const promptInfo = join(promptPath, 'promptInfo.json')
    // csv
    if (!fs.existsSync(join(promptPath, 'prompts.csv'))) {
        downloadPrompt(promptPath)
    }

    let promptList = []

    // make promptInfo.json
    if (fs.existsSync(join(promptPath, 'prompts.csv')) && !fs.existsSync(promptInfo)) {
        let data = fs.readFileSync(join(promptPath, 'prompts.csv'), { encoding: 'utf-8' })
        let lines = data.split('\n')
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i]
            let [act, prompt] = line.split(',')
            if (act == undefined || prompt == undefined) {
                continue
            }
            let info = {
                CMD: act.toLowerCase().replace(/ /g, '_').replace(/"/g, ''),
                ACT: act.replace(/"/g, ''),
                PROMPT: prompt.replace(/"/g, ''),
                ENABLE: true,
            }
            promptList.push(info)
        }
        fs.writeFileSync(promptInfo, JSON.stringify(promptList, null, 4))
    }else if (fs.existsSync(promptInfo)) {

        // json exists
        promptList = JSON.parse(fs.readFileSync(promptInfo, { encoding: 'utf-8' }))
    }
    return promptList
}

function downloadPrompt(promptPath:string) {
    const file = fs.createWriteStream(join(promptPath, 'prompts.csv.temp'))
    logger.info('downloading prompts.csv to prompts.csv.temp')
    https.get(promptUrl, response=> {
        response.pipe(file)

        // finish
        file.on('finish', ()=> {
            file.close()
            logger.info('download prompts.csv.temp success')
            // rename
            fs.renameSync(join(promptPath, 'prompts.csv.temp'), join(promptPath, 'prompts.csv'))
            logger.info('rename prompts.csv.temp to prompts.csv success')
        })

        // error
        file.on('error', err=> {
            logger.error(err)
        })

    }).on('error', err=> {
        logger.error(err)
    })
}

function setPromptInfo(promptPath:string,promptList:any[]) {
    const promptInfo = join(promptPath, 'promptInfo.json')
    fs.writeFileSync(promptInfo, JSON.stringify(promptList, null, 4))
}

function resetPromptInfo(promptPath:string) {
    const promptInfo = join(promptPath, 'promptInfo.json')
    let promptList = []
    if (fs.existsSync(join(promptPath, 'prompts.csv'))) {
        // update json
        let data = fs.readFileSync(join(promptPath, 'prompts.csv'), { encoding: 'utf-8' })
        let lines = data.split('\n')
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i]
            let [act, prompt] = line.split(',')
            if (act == undefined || prompt == undefined) {
                continue
            }
            let info = {
                CMD: act.toLowerCase().replace(/ /g, '_').replace(/"/g, ''),
                ACT: act.replace(/"/g, ''),
                PROMPT: prompt.replace(/"/g, ''),
                ENABLE: true,
            }
            promptList.push(info)
        }
        fs.writeFileSync(promptInfo, JSON.stringify(promptList, null, 4))
    }else{
        // download csv
        downloadPrompt(promptPath)
    }
    return promptList
}

async function syncPromptInfo(promptPath:string) {
    const promptInfo = join(promptPath, 'promptInfo.json')
    // download
    await downloadPrompt(promptPath)
    // update json
    let promptList = []
    if (fs.existsSync(join(promptPath, 'prompts.csv'))) {
        // update json
        let data = fs.readFileSync(join(promptPath, 'prompts.csv'), { encoding: 'utf-8' })
        let lines = data.split('\n')
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i]
            let [act, prompt] = line.split(',')
            if (act == undefined || prompt == undefined) {
                continue
            }
            let info = {
                CMD: act.toLowerCase().replace(/ /g, '_').replace(/"/g, ''),
                ACT: act.replace(/"/g, ''),
                PROMPT: prompt.replace(/"/g, ''),
                ENABLE: true,
            }
            promptList.push(info)
        }
        fs.writeFileSync(promptInfo, JSON.stringify(promptList, null, 4))
    }
}

export {
    promptUrl,
    downloadAndGetPrompt,
    setPromptInfo,
    resetPromptInfo,
    syncPromptInfo,
}