// import json fs functions
//--------------------------------------------------------
import fse from "fs-extra";
import path from "path";

let configs = {};

// helper functions
//--------------------------------------------------------
const getTodayPath = () => {
    let day = new Date().getDay();
    if(day <= 2 || day === 7) {
        return "01-Day";
    } else if(day > 2 && day <= 4) {
        return "02-Day";
    } else if(day > 4 && day <= 6) {
        return "03-Day";
    };
};

const getPath = (dir, cWeek, today) => {
    let dirPath = "";
    let dayPath = getTodayPath();
    // add extra params to look for current day
    if(today) {
        dir.params.push(":day")
        dir.day = dayPath;
    }

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
        // find current day
    });
    //revert changes
    dir.params.pop();
    delete dir.day;
    
    return dirPath;
}

// parse info from files
const getInfo = (cwd, files) => {
    return new Promise ((resolve, reject) => {
        let info = {};
        let lessonPlan = files.filter(el => el.match("LessonPlan.md"))[0];
        lessonPlan = path.join(cwd, lessonPlan);
        parseLessonPlan(lessonPlan, (err, activities) => {
                info.activities = {};
                if(err) {
                    info.activities.nested = {};
                }else {
                    info.activities.nested = activities;
                };
                resolve(info);
        });
    })
};

const parseLessonPlan = (file, cb) => {
    let activity = {
            start: 0,
            end: 0
    };
    
    fse.readFile(file, "utf8")
    .then(content => {
        content = content.split("\n\r")

        for(let i = 0; i < 20; i++) {
            if(content[i].match("Summary:")) {
                let summary = content[i];     
                // find the activity number for today lesson
                let range = summary.match(/(\w+)-(\w+)/);
                // if there can't find activity throw error
                if(!range) throw cb(new Error("activity is not available", null))
                // parse out activity information
                return parseActivities(
                    parseInt(range[1]), 
                    parseInt(range[2]), 
                    cb
                );
            };
        };
        // no summary
        throw cb(new Error("summary is not available", null))
    })
    .catch( err => err );
};

const parseActivities = (start, end, cb) => {
    let activities = {};
    // find absPath of files in instructor directory
    let cWeek = configs.weeks.current.subject;
    let activityConfigs = configs.instructor.activities;
    let activityPath = getPath(activityConfigs, cWeek);
    // get rel to find the absPath for student directory
    let relPath = activityPath.replace(configs.instructor.root, "");
    // grab the relative and absolute path
    fse.readdir(activityPath, "utf8")
    .then( files => {
        for(let i = start - 1; i <= end - 1; i++) {
            let file = {};
            let name = files[i];
            let info = {
                name: name,
                type: "file",
                ext: "md",
                abs: path.join(activityPath, name),
                rel: path.join(relPath, name)
            };
            file.__info = info;
            activities[name] = file;
        }

        return cb(null, activities);
    });
}

const parseTimeTracker = (file, cb) => {
    fse.readFile(file, "utf8")
    .then( content => {
        cb(content);
    })
};

// handle dispatching functions
//--------------------------------------------------------
export default () => 
    dispatch => 
        new Promise((resolve, reject) => {
            fse.readJson(__dirname + "/config.json")
            .then( json => {
                    for(let key in json) {
                        dispatch({
                            type: "INIT_APP",
                            payload: { ...json[key], key: key }
                        });
                    };
                    //global variable
                    configs = json;
                    let dayPath = getTodayPath();
                    let todayPath = getPath(json.instructor.slides, json.weeks.current.week, dayPath);
                    fse.readdir(todayPath, "utf8")
                    .then(files => {
                        getInfo(todayPath, files)
                        .then(info => {
                            dispatch({
                                type: "INIT_TODAY_LESSON",
                                payload: info
                            })
                            resolve();
                        });
                    })
                })
            .catch( err => reject(err) )
        })
        
