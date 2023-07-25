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

    try {
        // mkdir config
        try{
            fs.statSync(path.join(__dirname, '../config'))

            try{
                fs.statSync(path.join(__dirname, '../config/config.json'))

                // load config.json
                config.loadConfig(Object.assign(new configModel(), JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json')).toString())))
            }catch (err){

                // create config.json
                if (err.code == 'ENOENT') {
                    fs.writeFileSync(path.join(__dirname, '../config/config.json'), JSON.stringify(config, null, 1))
                }
            }

        }catch (err){
            if (err.code == 'ENOENT') {

                // create config dir and config.json
                fs.mkdirSync(path.join(__dirname, '../config'))
                fs.writeFileSync(path.join(__dirname, '../config/config.json'), JSON.stringify(config, null, 1))
            }
        }

    } catch(e){
        error(e.message)
    }

    return config;
}

export default ConfigFactory