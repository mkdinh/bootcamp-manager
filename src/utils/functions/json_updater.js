// import fs extra
//--------------------------------------------------------
import fse from "fs-extra";
const configFile = __dirname + "/config.json"

// handle updating json file
//--------------------------------------------------------
export default {
    updateCurrentWeek: (week) => {
        return new Promise( (resolve, reject) => {
        fse.readJson(configFile, "utf8", (err, data) => {
            data.weeks.current = week;
                fse.writeJson(configFile, data, { spaces: 2 }, err => {
                    if(err) {
                        reject(err);
                    }else {
                        resolve();
                    }
                })
            })
        });
    },

    updateDir: (key, dir, value) => {
        return new Promise( (resolve, reject) => {
        fse.readJson(configFile, "utf8", (err, data) => {
            data[key][dir] = value;
                fse.writeJson(configFile, data, { spaces: 2 }, err => {
                    if(err) {
                        reject(err);
                    }else {
                        resolve();
                    }
                })
            })
        });
    }
};