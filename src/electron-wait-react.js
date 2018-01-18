const net = require("net");
const exec = require("child_process").exec;
const port = 8080;
const ePort = port + 1;
const client = new net.Socket();
let startedElectron = false;
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV !== "production") {
    process.env.ENTRY_URL = "http://localhost:" + port;
    process.env.NODE_ENV = "development";
};

const tryConnection = () => client.connect({ port: port }, () => {
    client.end();
    if(!startedElectron) {
        startedElectron = true;
        setTimeout(() => exec("npm run electron"), 10000);
    };
});

tryConnection();

client.on("error", err => {
    setTimeout(tryConnection, 1000);
})