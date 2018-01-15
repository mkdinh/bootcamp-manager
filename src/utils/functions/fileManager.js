// import fse dependencies
//--------------------------------------------------------
import fs from "fs";
import path from "path";
import git from "simple-git";

// Handle request modify files
//--------------------------------------------------------

const _this = {
    gitPush: message => { 
        return new Promise( (resolve, reject) => {      
            // grab config to find the root path
            var file = path.join(__dirname, "config.json");

            fs.readFile(file, "utf8", (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    // parse data -> json and grab root
                    var configs = JSON.parse(data);
                    var rootStudent = configs.student.root; 
                    const repo = git(rootStudent);

                    let status = {};

                        repo.add("./*", (err, data) => {
                                if(err) reject(err);
                            })
                            .status((err, data) => {
                                if(err) reject(err);
                                status = data;
                            })
                            .commit(message, (err ,data) => {
                                if(err) reject(err);
                            })
                            .push("master", (err, data) => {
                                if(err) reject(err);
                            })
                            .exec((err, data) => {
                                resolve(status);
                            })
                    };
            });
        })
    }
};

export default _this;