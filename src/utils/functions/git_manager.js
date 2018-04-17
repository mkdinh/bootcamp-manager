// import fse dependencies
//--------------------------------------------------------
import fs from "fs";
import path from "path";
import git from "simple-git";

// Handle request modify files
//--------------------------------------------------------

const _this = {

    repo: null,

    configs: {},

    init: () => {
        return new Promise((resolve, reject) => {  
            // grab config to find the root path
            var file = path.join(__dirname, "../src/config.json");
            fs.readFile(file, "utf8", (err, data) => {
                if  (err) {
                    reject(err);
                } else {
                    // parse data -> json and grab root
                    var configs = JSON.parse(data);
                    var rootStudent = configs.roots.student; 
                    const repo = git(rootStudent);
                    _this.repo = repo;
                    _this.configs = configs;
                    resolve(_this.pull())
                }
            });
        });
    },

    pull: () => {
        return new Promise((resolve, reject) => {
            if (_this.repo) {
                // find student root directory and perform a git pull
                let root = _this.configs.roots.student;
                _this.repo.pull(root, (err ,data) => {
                    // if failed
                    if (err) reject(err);
                    // if succeed
                    resolve(data);
                });
            }
        });
    },

    status: () => { 
        return new Promise( (resolve, reject) => {   
            if (_this.repo) {
                _this.repo
                .pull((err, data) => {
                    if (err) reject(err);
                })
                .add("./*", (err, data) => {
                    if(err) reject(err);
                })   
                .status((err, data) => {
                    if(err) reject(err);
                    resolve(data)
                });
            }   
        })
    },

    push: message => {
        return new Promise((resolve, reject) => {
            if(_this.repo) {
                _this.repo                    
                    .commit(message, (err ,data) => {
                        if(err) reject(err);
                    })
                    .push("master", (err, data) => {
                        if(err) reject(err);
                    })
                    .exec((err, data) => {
                        resolve(data);
                    })
            }else {
                reject()
            }
        })
    }
};

export default _this;