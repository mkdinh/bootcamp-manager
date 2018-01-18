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
    if(today) {
        dir.params.pop();
        delete dir.day;
    }
    
    return dirPath;
}

// parse info from files
const getInfo = (cwd, files) => {
    let info = {};
    let lessonPlan = files.filter(el => el.match("LessonPlan.md"))[0];
    lessonPlan = path.join(cwd, lessonPlan);
    return parseLessonPlan(lessonPlan)
};

const parseLessonPlan = (file, cb) => {
    let activity = {
            start: 0,
            end: 0
    };
    
    return fse.readFile(file, "utf8")
        .then(overview => {
            let data = {
                overview: [],
                today_activities: []
            };

            overview = overview.split("\n\r")
            data.overview = overview;

            for(let i = 0; i < 20; i++) {
                if(overview[i].match("Summary:")) {
                    let summary = overview[i];     
                    // find the activity number for today lesson
                    let range = summary.match(/(\w+)-(\w+)/);
                    // if there can't find activity throw error
                    if(range) {
                        data.today_activities = [range[1], range[2]]
                    };
                    return data;
                };
            };
            // no summary
            throw cb(new Error("summary is not available", null))
        })
        .catch( err => err );
};

// handle dispatching functions
//--------------------------------------------------------
export default () => 
    dispatch => {
        let dayPath, todayPath;
        return new Promise((resolve, reject) => {
            fse.readJson(__dirname + "/config.json")
            .then( json => {
                for(let key in json) {
                    dispatch({
                        type: "INIT_APP",
                        payload: { ...json[key], key: key }
                    });
                };
                //global variable
                configs = { ...json };
                dayPath = getTodayPath();
                todayPath = getPath(json.instructor.slides, json.weeks.current.week, dayPath);

                return fse.readdir(todayPath, "utf8");
            })
            .then( files => getInfo(todayPath, files) )
            .then( info => {
                
                dispatch({
                    type: "INIT_TODAY_LESSON",
                    payload: info
                });
                    
                resolve();
            } )
            .catch( err => reject(err) )

        })
    }  
