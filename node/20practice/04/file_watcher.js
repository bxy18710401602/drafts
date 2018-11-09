let events = require('events'),
    util = require('util'),
    fs = require('fs'),
    watchDir = './watch',
    processedDir = './done'

util.inherits(Watcher, events.EventEmitter)

function Watcher (watchDir, processedDir) {
  this.watchDir = watchDir
  this.processedDir = processedDir
}
Watcher.prototype.watch = function () {
  let watcher = this
  fs.readdir(watcher.watchDir, function (err, files) {
    if (err) throw err
    for (let index in files) {
      watcher.emit('process', files[index])
    }
  })
}

Watcher.prototype.start = function () {
  var watcher = this
  fs.readdir(watcher.watchDir, function () {
    watcher.watch()
  })
}

let watcher = new Watcher(watchDir, processedDir)

watcher.on('process', function (file) {
  let watchFile = this.watchDir + '/' + file
  let processedFile = this.processedDir + '/' + file.toLowerCase()

  fs.rename(watchFile, processedFile, function (err) {
    if (err) throw err
  })
})

watcher.start()

