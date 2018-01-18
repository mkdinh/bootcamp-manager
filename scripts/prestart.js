var fse = require("fs-extra");
var path = require("path");

// grab config to find the root path
var file = path.join(__dirname, "../public/config.json");
let weekFile = path.join(__dirname, "../public/weeks.json");

fse.readJson(file, (err, configs) => {
    if(err) {
        console.log(err);
    } else {
        // grab student root dir
        var rootStudent = configs.student.root; 

        // update current date
        var dateStart = new Date(configs.weeks.start_date).getTime();
        var dateCurrent = new Date().getTime();
        var millPerDay = 1000 * 60 * 60 * 24 * 7;
        var weekDiff = Math.abs( dateCurrent - dateStart ) / millPerDay;

        configs.weeks.start_date = dateStart;
        configs.weeks.current_date = dateCurrent;

        fse.writeJson(file, configs, { spaces: 2 },  err => {
            if(err) {
                console.log(err);
            };
        })

        // run git pull before start app
        var commandStudent = "pull " + rootStudent + " origin master";

        // start process before starting app
        var args = [commandStudent];
        var opts = {
            stdio: "inherit", 
            cwd: rootStudent, 
            shell: true
        };

        // run child process
        require("child_process").spawn("git", args, opts);
    };
});