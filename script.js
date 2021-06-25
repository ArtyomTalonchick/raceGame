const url = require("url").format({
    protocol: "file",
    slashes: true,
    pathname: require("path").join(__dirname, "index.html")
});

const {app, BrowserWindow} = require("electron");

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 340,
        height: 850,
        minWidth: 340,
        minHeight: 500,
    });

    win.loadURL(url);

    win.on("closed", () => win = null);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => app.quit());