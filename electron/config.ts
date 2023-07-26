// create config file
import path from "path";
import { app} from "electron";

import fs from "fs";
import { dialog } from "electron";
import configModel from "../public/configModel";


// create and load config file
function ConfigFactory(){
    const config = new configModel();

    // config dir
    const configDir = path.join(app.getPath('home'), '.claude');
    // config file
    const configFile = path.join(configDir, 'config.json');

    console.log(configDir)

    // error dialog
    const error  = (message:string) => {dialog.showErrorBox('Error', message)}

    try{
        fs.statSync(configDir)
        // config dir exists
        try{
            fs.statSync(configFile)
            // config file exists
            Object.assign(config, JSON.parse(fs.readFileSync(configFile).toString()))
        }catch(err){
            // config file not exists
            fs.writeFileSync(configFile, JSON.stringify(config, null, 1))
        }
    }catch(err){
        // config dir not exists
        try{
            fs.mkdirSync(configDir)
            // mkdir success
            fs.writeFileSync(configFile, JSON.stringify(config, null, 1))
        }catch(err){

            // mkdir failed
            error(err.message)
        }
    }

    return config;
}

export default ConfigFactory