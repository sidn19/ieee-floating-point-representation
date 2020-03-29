const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1024,
    height: 728,
    webPreferences: {
      nodeIntegration: false
    }
  });

  // and load the index.html of the app.
  win.loadFile('./index.html')
}

app.whenReady().then(createWindow);
