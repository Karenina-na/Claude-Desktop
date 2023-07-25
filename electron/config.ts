// create config file
import path from "path";
import fs from "fs";
import { dialog } from "electron";


function createConfig(){
    // error dialog
    const error  = (message:string) => {dialog.showErrorBox('Error', message)}

    fs.stat(path.join(__dirname, '../config'), (err : any, stats : any) => {
        if (err) {
            // mkdir config
            fs.mkdir(path.join(__dirname, '../config'), (err : any) => {if (err) {
                error(err.message);
            }})
        }
    })
    fs.stat(path.join(__dirname, '../config/config.json'), (err : any, stats : any) => {
        if (err){
            // create config.json
            fs.writeFile(path.join(__dirname, '../config/config.json'), JSON.stringify({

            }), (err : any) => {
                if (err) {
                    error(err.message);
                }
            })
        }
    })
}

export default createConfig