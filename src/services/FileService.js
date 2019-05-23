import fse from 'fs-extra';
import path from 'path';
import store from '../store';
import XLSX from 'xlsx';

class FileService {
  constructor(store) {
    this._store = store;
  }

  get regex() {
    return {
      activities: {
        readme: new RegExp(
          `.*${path.sep}.*-(Ins|Stu).*${path.sep}README.md${path.sep}.*`,
          'i',
        ),
        instructor: {
          solved: new RegExp(
            `.*${path.sep}.*-Ins.*${path.sep}\\Solved.*${path.sep}.*`,
            'i',
          ),
          unsolved: new RegExp(
            `.*${path.sep}.*-Ins.*${path.sep}Unsolved.*${path.sep}.*`,
            'i',
          ),
        },
        student: {
          solved: new RegExp(
            `.*${path.sep}.*-Stu.*${path.sep}\\Solved.*${path.sep}.*`,
            'i',
          ),
          unsolved: new RegExp(
            `.*${path.sep}.*-Stu.*${path.sep}Unsolved.*${path.sep}.*`,
            'i',
          ),
        },
      },
    };
  }

  get store() {
    return this._store.getState();
  }

  async getActivitiesForDay() {
    const absolutePath = this.getDailyActivityPath();
    const result = await fse.readdir(absolutePath);
    return {
      absolutePath,
      result,
    };
  }

  async getAllItemsInDirectoryR(currentPath, list) {
    const children = await fse.readdir(currentPath);
    // read each child and recursively loop through directory tree
    const promises = children.map(async node => {
      const nodePath = path.join(currentPath, node);
      const stat = await fse.stat(nodePath);
      if (stat.isDirectory()) {
        return this.getAllItemsInDirectoryR(nodePath, list);
      }

      if (stat.isFile()) {
        list.push(nodePath);
      }
    });

    await Promise.all(promises);

    return list;
  }

  async copyDailyUnsolvedToStudentWorkBook() {
    const absolutePathToActivities = this.getDailyActivityPath();
    const nodeList = await this.getAllItemsInDirectoryR(
      absolutePathToActivities,
      [],
    );
    const stuUnsolvedAndInsSolved = nodeList.filter(
      x =>
        !x.match(this.regex.activities.student.solved) &&
        !x.match(this.regex.activities.instructor.unsolved),
    );
    const promises = stuUnsolvedAndInsSolved.map(file => {
      const targetPath = file.replace(
        this.store.directories.roots.instructor,
        this.store.directories.roots.student,
      );
      return fse.copy(file, targetPath);
    });

    await Promise.all(promises);
  }

  async copyDailySolvedToStudentWorkBook() {
    const absolutePathToActivities = this.getDailyActivityPath();
    const nodeList = await this.getAllItemsInDirectoryR(
      absolutePathToActivities,
      [],
    );
    const studentSolved = nodeList.filter(x =>
      x.match(this.regex.activities.student.solved),
    );
    const promises = studentSolved.map(file => {
      const targetPath = file.replace(
        this.store.directories.roots.instructor,
        this.store.directories.roots.student,
      );
      return fse.copy(file, targetPath);
    });

    await Promise.all(promises);
  }

  getPathToDailyActivities(rootModule, activityModule, weekModule) {
    const absolutePath = activityModule.params.reduce((currentPath, param) => {
      if (!param[0] === ':') {
        return path.join(currentPath, param);
      }
      const key = param.substring(1);

      switch (key) {
        case 'root':
          return path.join(currentPath, rootModule.instructor);
        case 'week':
          return path.join(currentPath, weekModule.week);
        case 'day':
          return path.join(currentPath, weekModule.day.toString());
        default:
          return path.join(currentPath, activityModule[key]);
      }
    }, '');

    return absolutePath;
  }

  getDailyActivityPath() {
    const rootModule = this.store.directories.roots;
    const activityModule = this.store.directories.activities;
    const weekModule = this.store.weeks;
    const absolutePath = this.getPathToDailyActivities(
      rootModule,
      activityModule,
      weekModule,
    );
    return absolutePath;
  }

  getDailyContentPath() {
    const rootModule = this.store.directories.roots;
    const activityModule = {
      ...this.store.directories.activities,
      params: [...this.store.directories.activities.params],
    };
    activityModule.params = activityModule.params.filter(x => x !== ':topic');
    const weekModule = this.store.weeks;
    const absolutePath = this.getPathToDailyActivities(
      rootModule,
      activityModule,
      weekModule,
    );

    return absolutePath;
  }

  getPathToDailyFile(uri) {
    const contentPath = this.getDailyContentPath();
    return path.join(contentPath, uri);
  }

  getPathToDailyImage(uri) {
    const activityPath = this.getDailyActivityPath();
    return activityPath.replace(/Activities/i, uri);
  }

  async readXlsx(uri) {
    const workbook = XLSX.readFile(uri);
    return workbook;
  }

  async readXlsxToCSV(uri) {
    const workbook = await this.readXlsx(uri);
    let sheets = {};
    for (let key in workbook.Sheets) {
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[key]);
      sheets[key] = csv;
    }
    return sheets;
  }
}

export default new FileService(store);
