let child_process = require('child_process')

/* 使用这种方式的通信失败了
var child = child_process.spawn('node', [ 'child.js' ])
child.kill('SIGTERM')
 */

let child = child_process.spawn('node', [ 'child.js' ], {
  stdio: [ 0, 1, 2, 'ipc']
})

child.on('message', function (msg) {
  console.log(msg)
})

child.send({ hello: 'hello'})