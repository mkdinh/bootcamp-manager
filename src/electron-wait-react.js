const net = require("net");
const exec = require("child_process").exec;
const electron = require("electron");
const port = 8080;
const client = new net.Socket();
const app = electron.remote.app;

let startedElectron = false;
if(process.env.NODE_ENV !== "production") {
    process.env.ENTRY_URL = "http://localhost:" + port;
    process.env.NODE_ENV = "development";
};

// process.env.APP_ROOT = app.getAppPath();

// const tryConnection = () => client.connect({ port: port }, () => {
//     client.end();
//     if(!startedElectron) {
//         startedElectron = true;
//         exec("npm run electron-start");
//     };
// });

// tryConnection();

// client.on("error", err => {
//     if(!startedElectron) {
//         setTimeout(tryConnection, 1000);
//     }
// })