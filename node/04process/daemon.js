let child_process = require('child_process')
let obj = {flag: false}

function spawn (mainModule) {
  let worker = child_process.spawn('node', [ mainModule ], {
    stdio: [ 0, 1, 2, 'ipc']
  })
  worker.on('message', function (msg) {
    console.log(msg)
  })
  worker.send(obj)
  // 保护子进程
  worker.on('exit', (code) => {
    if (code !== 0) {
      spawn(mainModule)
      obj.flag = true
    } 
  })
}

spawn('worker.js')