let fs = require('fs')
let path = require('path')

// 同步遍历目录
function travelSync (dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    let pathname = path.join(dir, file)

    if (fs.statSync(pathname).isDirectory()) {
      travelSync(pathname, callback)
    } else {
      callback(pathname)
    }
  })
}

travelSync('/Users/yubai/Desktop/practice/drafts/node', function (pathname) {
  console.log(pathname)
})

// 异步遍历目录
/*
function travel (dir, callback, finish) {
  fs.readdir(dir, function (err, files) {
    (function next(i) {
      if (i < files.length) {
        var pathname = path.join(dir, files[i])
        fs.stat(pathname, function (err, stat) {
          if (stat.isDirectory()) {
            travel(pathname, callback, function () {
              next(i + 1)
            })
          } else {
            callback(pathname, function () {
              next(i + 1)
            })
          }
        })
      } else {
        callback(pathname, function () {
          next(i + 1)
        })
      }
    }(0))
  })
}
*/
// travel('/Users/yubai/Desktop/practice/drafts/node', function (pathname) {
//   console.log(pathname)
// })