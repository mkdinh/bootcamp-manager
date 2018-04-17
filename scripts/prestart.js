var fse = require("fs-extra");
var path = require("path");

// grab config to find the root path
var file = path.join(__dirname, "../src/config.json");
let weekFile = path.join(__dirname, "../src/weeks.json");

fse.readJson(file, (err, configs) => {
    if(err) {
        console.log(err);
    } else {

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
            }
        });
    }
});