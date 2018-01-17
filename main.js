
const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let win;

app.on("ready", function(){
    win = new BrowserWindow({ 
        width: 1000, 
        height: 600,
        frame: false,
    });

    win.once("ready-to-show", () => {
        win.show();
    })
    
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/src/index.html"),
        protocol: "file:",
        slashes: true
    }));

    win.on("closed", () => {
        win = null;
    });
});

app.on("window-all-closed", () => {
    if(process.platform != "darwin") {
        app.quit();
    };
});
