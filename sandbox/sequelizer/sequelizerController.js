const { bookshelf } = require('./sequelizer.js')
let mainWindow
exports.sequelizerController = {
  init: function (window) {
    mainWindow = window
    console.log("Installing Sequelizer controller")
    bookshelf.init()
    const ipc = require('electron').ipcMain
    ipc.on('sequelizer-new-row', newRow)
    ipc.on('sequelizer-refresh', refresh)

    function newRow(event, arg) {
      console.log("new row!! " + arg)
      bookshelf.insert(arg, function (err, result) {
        mainWindow.webContents.send('refresh-rows', result)
      })
    }

    function refresh(event, arg) {
      console.log("refresh")
      bookshelf.select(function (err, result) {
        mainWindow.webContents.send('refresh-rows', result)
      })
    }
  }
}