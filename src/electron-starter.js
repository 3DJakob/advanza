const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const { ipcMain } = require('electron')

const path = require('path')
const url = require('url')

const Avanza = require('avanza')
const avanza = new Avanza()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000')

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

ipcMain.on('hello', (event, arg) => {
  console.log(arg)
})

const authenticate = async (login) => {
  return new Promise((resolve, reject) => {
    const res = avanza.authenticate({
      username: login.userName,
      password: login.password,
      totpSecret: login.totpSecret
    }).then(() => {
      console.log(res)
      resolve()
    }).catch((error) => {
      console.log(error)
      reject(error)
    })
  })
}

ipcMain.on('connect', (event, arg) => {
  const login = JSON.parse(arg)
  authenticate(login).then(async () => {
    const positions = await avanza.getPositions()
    event.reply('positions', JSON.stringify(positions))
  }).catch(
    'chart', 'error'
  )
})

ipcMain.on('chartData', (event, arg) => {
  const login = JSON.parse(arg)
  authenticate(login).then(async () => {
    const chartData = await avanza.getChartdata('3901', Avanza.ONE_WEEK)
    event.reply('chart', JSON.stringify(chartData))
  }).catch(
    'chart', 'error'
  )
})
