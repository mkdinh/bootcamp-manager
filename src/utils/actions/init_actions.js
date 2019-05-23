// import json fs functions
//--------------------------------------------------------
import fse from 'fs-extra';
import path from 'path';
import electron from 'electron';
import fileService from '../../services/FileService';
let configs = {};

// helper functions
//--------------------------------------------------------
const getTimeSheet = async () => {
  const filePath = fileService.getPathToDailyFile('TimeTracker.xlsx');
  const sheets = await fileService.readXlsxToCSV(filePath);
  const csv = sheets['Sheet1'];

  const data = csv.split('\n').map(r => r.split(','));
  data.shift(); // remove title row
  data.shift();

  return { header: ['Time', '#', 'Activity', 'Dur.'], activities: data };
};

const getPath = (root, dir, cWeek, today) => {
  let dirPath = '';
  let todayPath = today.toString();

  dir.params.forEach(el => {
    if (el[0] === ':') {
      el = el.substring(1);
      if (el === 'root') {
        return (dirPath = path.join(dirPath, root));
      }
      if (el === 'week') {
        return (dirPath = path.join(dirPath, cWeek));
      } else {
        return (dirPath = path.join(dirPath, dir[el]));
      }
    } else {
      return (dirPath = path.join(dirPath, el));
    }
  });

  if (today) {
    dirPath = path.join(dirPath, todayPath);
  }

  return dirPath;
};

// parse info from files
const getInfo = async (cwd, files) => {
  let lessonPlan = files.filter(el => el.match('LessonPlan.md'))[0];
  lessonPlan = path.join(cwd, lessonPlan);
  return parseLessonPlan(lessonPlan);
};

const parseLessonPlan = async (file, cb) => {
  let activity = {
    start: 0,
    end: 0,
  };
  const overview = await fse.readFile(file, 'utf8');
  const timesheet = await getTimeSheet();

  return {
    overview,
    timesheet,
  };
};

// update current week
//--------------------------------------------------------
const updateCurrentWeek = (file, configs) => {
  return new Promise((resolve, reject) => {
    // update current date
    var dateStart = new Date(configs.weeks.start_date).getTime();
    var dateCurrent = new Date().getTime();
    var millPerDay = 1000 * 60 * 60 * 24 * 7;
    var weekDiff = Math.abs(dateCurrent - dateStart) / millPerDay;
    configs.weeks.start_date = dateStart;
    configs.weeks.current_date = dateCurrent;
    fse
      .writeJson(file, configs, { spaces: 2 })
      .then(() => resolve(configs))
      .catch(err => reject(err));
  });
};

// handle dispatching functions
//--------------------------------------------------------
export default cWeek => dispatch => {
  let dayPath, todayPath, weekFormat;
  let appRoot = electron.remote.app.getAppPath();
  return new Promise((resolve, reject) => {
    let jsonFile = path.join(__dirname, '../src/config.json');
    process.env.CONFIGS = jsonFile;

    fse
      .readJson(jsonFile)
      .then(json => {
        return updateCurrentWeek(jsonFile, json);
      })
      .then(json => {
        dispatch({
          type: 'INIT_DIRECTORIES',
          payload: json,
        });

        dispatch({
          type: 'INIT_WEEKS',
          payload: cWeek || json.weeks,
        });
        //global variable
        configs = { ...json };
        let root = configs.roots.instructor;

        if (!cWeek) {
          weekFormat = json.weeks.current.week;
        } else {
          weekFormat = cWeek.week;
        }

        todayPath = getPath(
          root,
          json.slides,
          weekFormat,
          json.weeks.current.day,
        );
        return fse.readdir(todayPath, 'utf8');
      })
      .then(files => getInfo(todayPath, files))
      .then(info => {
        dispatch({
          type: 'INIT_TODAY_LESSON',
          payload: info,
        });
        resolve();
      })
      .catch(err => reject(err));
  });
};
