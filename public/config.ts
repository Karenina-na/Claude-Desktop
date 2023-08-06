// create config file
import path from "path";
import { app} from "electron";

import fs from "fs";
import { dialog } from "electron";
import configModel from "./configModel";


// create and load config file
function ConfigFactory(){
    let config: configModel;

    // config dir
    const configDir = path.join(app.getPath('home'), '.claude');
    // config file
    const configFile = path.join(configDir, 'config.json');

    // error dialog
    const error  = (message:string) => {dialog.showErrorBox('Error', message)}

    try{
        fs.statSync(configDir)
        // config dir exists
        try{
            fs.statSync(configFile)
            // config file exists
            config =  new configModel()
            Object.assign(config, JSON.parse(fs.readFileSync(configFile).toString()))
        }catch(err){
            // config file not exists
            config =  new configModel()
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

// load and update config file
function ConfigUpdate(config: configModel){
    // config dir
    const configDir = path.join(app.getPath('home'), '.claude');
    // config file
    const configFile = path.join(configDir, 'config.json');

    // error dialog
    const error  = (message:string) => {dialog.showErrorBox('Error', message)}

    try{
        fs.statSync(configDir)
        // config dir exists
        try{
            fs.statSync(configFile)
            // config file exists
            fs.writeFileSync(configFile, JSON.stringify(config, null, 1))
        }catch(err){
            // config file not exists
            error(err.message)
        }
    }catch(err){
        // config dir not exists
        error(err.message)
    }
}

export {ConfigFactory, ConfigUpdate}