// create config file
import path from "path";
import fs from "fs";
import { dialog } from "electron";
import configModel from "../public/configModel";


// create and load config file
function ConfigFactory(){
    const config = new configModel();

    // error dialog
    const error  = (message:string) => {dialog.showErrorBox('Error', message)}

    try{
        fs.statSync(path.join(__dirname, '../config'))
        // config dir exists
        try{
            fs.statSync(path.join(__dirname, '../config/config.json'))
            // config file exists

            config.loadConfig()
        }catch(err){
            // config file not exists

            config.writeConfig()
        }
    }catch(err){
        // config dir not exists
        try{
            fs.mkdirSync(path.join(__dirname, '../config'))
            // mkdir success
            config.writeConfig()
        }catch(err){
            // mkdir failed
            error(err.message)
        }
    }

    return config;
}

export default ConfigFactory