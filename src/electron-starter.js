
const { app, BrowserWindow, globalShortcut } = require("electron");
const url = require("url");
const path = require("path");
const dotenv = require("dotenv");

dotenv.load();
let win;

let ENTRY_URL;
if(process.env.ENTRY_URL) {
    ENTRY_URL = process.env.ENTRY_URL;
} else if(process.env.NODE_ENV === "development") {
    ENTRY_URL = url.format({
        pathname: path.join(__dirname, "../public/index.html"),
        protocol: "file:",
        slashes: true
    });
} else {
    ENTRY_URL = url.format({
        pathname: path.join(__dirname, "../dist/index.html"),
        protocol: "file:",
        slashes: true
    });

};


if (app) {

    app.on("ready", function(){
        win = new BrowserWindow({ 
            width: 1000, 
            height: 600,
            frame: false,
            show: false,
            backgroundColor: "rgb(54,53,53)",
        });

        // win.webContents.openDevTools()

        win.once("ready-to-show", () => {
            win.show();
        }); 

        win.loadURL(ENTRY_URL);

        win.on("closed", () => {
            win = null;
        });

        globalShortcut.register('Control+I', () => win.webContents.openDevTools());
    });

    app.on("window-all-closed", () => {
        if(process.platform != "darwin") {
            app.quit();
        };
    })

} else {
    throw 'electron started'
}