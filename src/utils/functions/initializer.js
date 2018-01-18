// import fse dependencies
//--------------------------------------------------------
import fse from "fs-extra";
import path from "path";

// Handle request to update page
//--------------------------------------------------------
const _this = {

    absPaths: {
        instructor: "",
        student: "",
        rootStudent: ""
    },

    relPaths: {
        instructor: {},
        student: {}
    },

    initialize: (iPath, sPath, iWeek, sWeek) => {
        return new Promise( (resolve, reject) => {
            let relPathInstructor, relPathStudent;
            let dirInstructor, dirStudent;
            
            if(iPath) {
                // concat params into path string
                relPathInstructor = _this.genPath(iPath, iWeek);
                // recursively find document paths
                dirInstructor = _this.rSearch(relPathInstructor, "/", {}, null, true, true, "instruct");
                // update root directory for later functions (copy/delete)
                _this.absPaths.instructor = relPathInstructor;
                _this.relPaths.instructor = dirInstructor.relPaths;
            };

            if(sPath) {
                // same as instructor
                relPathStudent = _this.genPath(sPath, sWeek);
                dirStudent = _this.rSearch(relPathStudent, "/", {}, null, true, true, "student");
                _this.absPaths.student = relPathStudent;
                // save directory files for easy retrieval during match function
                _this.absPaths.rootStudent = sPath.root;
                _this.relPaths.student = dirStudent.relPaths;
            };

            // combine results
            let dirs = {
                instructor: dirInstructor, 
                student: dirStudent
            };
                        
            resolve(dirs);
        } )   
    },

    copy: file => {
            // grab the absoulte path
            // rel path should be the same for both student / teacher

            // absolute path of file
            let source = path.join(_this.absPaths.instructor, file);
            let target = path.join(_this.absPaths.student, file);
            return fse.copy(source, target)
    },

    remove: file => {
        let cwd;
        let target = path.join(_this.absPaths.student, file);
        
        //read delete file current directory
        // if empty also remove the directory
        return _this.isEmptyAfterRemove(file)
        .then( cwd => fse.remove(cwd) )
        .catch( () => fse.remove(target) )
    },

    match: relPath => {
        let instructorPath = _this.relPaths.instructor[relPath];
        let studentPath = _this.relPaths.student[relPath];

        if(studentPath && instructorPath) {
            return true;
        }else {
            return false;
        };
    },

    isEmptyAfterRemove: (file) => {
        return new Promise ( (resolve, reject) => {
            //split into params
            let params = file.split("\\");
            params.pop();
            let cwd = path.join(_this.absPaths.student, params.join("\\"));

            return fse.readdir(cwd)
            .then( files => {
                if(files.length === 1) {
                    resolve(cwd);
                }else {
                    reject();
                }
            });
        });
    },

    rSearch: (abs, rel, node, queue, root, flatten, role) => {
        // check for existing dir before reading
        let isDir = _this.isDir(abs);
        let exists = fse.existsSync(abs);

        if(root && !exists) {
            return {
                flatten: {},
                relPaths: {},
                nested: {}
            };
        }
        if(!queue && isDir && exists) {  
            try {
                queue = fse.readdirSync(abs);
            } catch (err) {
                if(err) {
                    return {};
                }
            };
        }else {
            return {};
        };
        // append each element into node
        queue.map(dir => {
            // update abs and rel path
            let cAbs = path.join(abs, dir);
            let cRel = path.join(rel, dir);
            node[dir] = {};
            let info = {
                name: dir,
                abs: cAbs,
                rel: cRel,
            };

            node[dir].__info = info;
            // read each child and recursively search if it is a directory
            if(isDir) {
                let info = path.parse(dir);
                    if(_this.isFile(info.base)){
                    node[dir].__info.type = "file";
                    node[dir].__info.ext = info.ext;
                }else{
                    node[dir].__info.type = "dir";

                }
                _this.rSearch(cAbs, cRel, node[dir], null, false); 
            }else{
                return node[dir].__info.type = "file";
                node[dir].__info.ext = info.ext;
            }
        });

        // final config after finished with recursive loop
        if(root) {
            let flatNode;

            if(flatten) {
                let clone = _this.clone(node);
                flatNode = _this.flatten(clone, null, true);
            };   
            let result = {
                flatten: flatNode.flatten,
                relPaths: flatNode.relPaths,
                nested: node
            };   
            return result;
        };
    },

    clone: (source, clone) => {
        if(!clone) {
            clone = new Object();
        };

        for(let key in source) {
            if(source[key] instanceof Object) {
                if(source[key].__info) {
                    clone[key] = {};
                    clone[key].__info = source[key].__info;
                };
                // clone.__info = source.__info;
                _this.clone(source[key], clone[key]);
                // delete clone[key]
            }else{
                clone.__info = source.__info;
                // delete source[key]
            }
        };
        return clone;
    },

    flatten: (dir, flatten, root) => {
        // init object
        if(!flatten) {
            flatten = {};
        };
        // loop through each object and rearrange them into a level object
        for(let key in dir) {
            // ignore __info when going through recursiely
            if(key !== "__info" && dir[key].__info.type === "dir") {
                flatten[key] = dir[key];
                _this.flatten(dir[key], flatten);
                // delete dir[key];
            } else {
                flatten[key] = dir[key];
            };
        };

        if(root) {

            let optimized = new Object();
            let relPaths = new Object();

            for(let key in flatten) {
                if(flatten[key].__info) {
                    optimized[key] = {};
                    optimized[key].__info = flatten[key].__info;
                    relPaths[flatten[key].__info.rel] = flatten[key].__info.rel;
                }
            };

            return {
                flatten: optimized,
                relPaths: relPaths
            };
        }
    },

    genPath: (dir, cWeek) => {
        let dirPath = "";
        dir.params.forEach(el => {
            if(el[0] === ":") {
                el = el.substring(1);
                if(el === "week"){
                    return dirPath = path.join(dirPath, cWeek);
                }else if(el === "day") {
                    let day = _this.genToday();
                    return dirPath = path.join(dirPath, day);
                } {
                    return dirPath = path.join(dirPath, dir[el]);
                };
            }else {
                return  dirPath = path.join(dirPath, el);
            }
        });
        return dirPath;
    },

    genToday: () => {
        let day = new Date().getDay();
        if(day <= 2 || day === 7) {
            return "01-Day";
        } else if(day > 2 && day <= 4) {
            return "02-Day";
        } else if(day > 4 && day <= 6) {
            return "03-Day";
        };
    },

    openFile: relPath => {
        //concat abs + rel paths;
        let absPath = _this.absPaths.instructor;
        let fullPath = path.join(absPath, relPath);
        // open via childprocess
        require("child_process").exec(fullPath);

    },

    isFile: name => {
        let dotFile = RegExp(/^\.\w+|Procfile/, "gi");
        let extFile = RegExp(/.*\.\w*$/, "gi" )
        if(name.match(dotFile)){
            return true;
        }else if(name.match(extFile)) {
            return true;
        }else {
            return false;
        }
    },

    isDir: name => {
        let info = path.parse(name);
        let dotFile = RegExp(/^\.\w+|Procfile/, "gi");
        if(info.base.match(dotFile)){
            return false;
        }else if(info.ext) {
            return false
        }else {
            return true
        }
    }

}

export default _this;