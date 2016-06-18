const { app, BrowserWindow, ipcMain, Menu } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow

function onClick(menuItem, browserWindow) {
  browserWindow.webContents.send('pong', 'sent directly')
}

function onClickPromise(menuItem, browserWindow) {
  Promise.resolve().then(() => {
    browserWindow.webContents.send('pong', 'sent from a promise')
  })
}

function onClickNextTick(menuItem, browserWindow) {
  process.nextTick(() => Promise.resolve().then(() => {
    browserWindow.webContents.send('pong', 'sent from a promise via nextTick')
  }))
}

function onClickSetImmediate(menuItem, browserWindow) {
  setImmediate(() => Promise.resolve().then(() => {
    browserWindow.webContents.send('pong', 'sent from a promise via setImmediate')
  }))
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  var menuTemplate = [
    {
      label: 'PromiseFirst',
      submenu: [
        { label: 'Ping Promise', type: 'normal', click: onClickPromise },
        { label: 'Ping Direct', type: 'normal', click: onClick }
      ]
    },
    {
      label: 'PromiseLast',
      submenu: [
        { label: 'Ping Direct', type: 'normal', click: onClick },
        { label: 'Ping Promise', type: 'normal', click: onClickPromise }
      ]
    },
    {
      label: 'PromiseLastNotWorking',
      submenu: [
        { label: 'Ping Direct', type: 'normal', click: onClick },
        { label: 'Ping Promise', type: 'normal', click: onClickPromise }
      ]
    },
    {
      label: 'JustPromises',
      submenu: [
        { label: 'Ping Promise', type: 'normal', click: onClickPromise },
        { label: 'Ping Promise', type: 'normal', click: onClickPromise }
      ]
    },
    {
      label: 'Workaround',
      submenu: [
        { label: 'Ping nextTick', type: 'normal', click: onClickNextTick },
        { label: 'Ping setImmediate', type: 'normal', click: onClickSetImmediate }
      ]
    }
  ]

  var menu = Menu.buildFromTemplate(menuTemplate)

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(this.menu)
  } else {
    mainWindow.setMenu(menu)
  }

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
