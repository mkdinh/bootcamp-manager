// import fse dependencies
//--------------------------------------------------------
import fse from "fs-extra";
import path from "path";

// Handle request to update page
//--------------------------------------------------------
const _this = {

    absPath: {
        instructor: "",
        student: "",
        rootStudent: ""
    },

    initialize: (iPath, sPath, iWeek, sWeek) => {
        return new Promise( (resolve, reject) => {
            let relPathInstructor, relPathStudent;
            let dirInstructor, dirStudent;
            // concat params into path string

            if(iPath) {
                relPathInstructor = _this.genPath(iPath, iWeek);
                console.log(relPathInstructor)
            };

            if(sPath) {
                relPathStudent = _this.genPath(sPath, sWeek);
            };
 
            // update root directory for later functions (copy/delete)
            _this.absPath.instructor = relPathInstructor;
            _this.absPath.student = relPathStudent;
            _this.absPath.rootStudent = sPath.root;

            // recursively find document paths
            try {
                dirInstructor = _this.rSearch(relPathInstructor, "/", {}, null, true, true);
                if(Object.keys(dirInstructor.nested).length === 0) {
                    throw "empty dir";
                };
            } catch(err) {
                dirInstructor = {
                    flatten: {},
                    nested: {}
                };
            };

            try {
                dirStudent = _this.rSearch(relPathStudent, "/", {}, null, true, true);
                if(Object.keys(dirStudent.nested).length === 0) {
                    throw "empty dir";
                };
            } catch(err) {
                dirStudent = {
                    flatten: {},
                    nested: {}
                }
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
            let source = path.join(_this.absPath.instructor, file);
            let target = path.join(_this.absPath.student, file);
            return fse.copy(source, target)
    },

    remove: file => {
        let cwd;
        let target = path.join(_this.absPath.student, file);
        
        //read delete file current directory
        // if empty also remove the directory
        return _this.isEmptyAfterRemove(file)
        .then( cwd => fse.remove(cwd) )
        .catch( () => fse.remove(target) )
    },

    isEmptyAfterRemove: (file) => {
        return new Promise ( (resolve, reject) => {
            //split into params
            let params = file.split("\\");
            params.pop();
            let cwd = path.join(_this.absPath.student, params.join("\\"));

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

    rSearch: (abs, rel, node, queue, root, flatten) => {
        // check for existing dir before reading
        let isDir = _this.isDir(abs);
        let exists = fse.existsSync(abs);

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
                flatten: flatNode,
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
            
            for(let key in flatten) {
                // console.log(flatten[key].__info)
                if(flatten[key].__info) {
                    optimized[key] = {};
                    optimized[key].__info = flatten[key].__info;
                }
            };
            return optimized;
        }
    },

    genPath: (dir, cWeek) => {
        let dirPath = "";
        dir.params.forEach(el => {
            if(el[0] === ":") {
                el = el.substring(1);
                if(el === "week"){
                    return dirPath = path.join(dirPath, cWeek)
                }else {
                    return dirPath = path.join(dirPath, dir[el]);
                };
            }else {
                return  dirPath = path.join(dirPath, el);
            }
        });
        return dirPath;
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