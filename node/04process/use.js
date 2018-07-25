// 获取命令行参数
function main (argv) {
  console.log(argv)
}
main(process.argv.slice(2))
// 退出程序
try {
  
} catch (err) {
  process.exit(1)
}
// 控制输入输出
function log () {
  process.stdout.write(
    util.format.apply(util, arguments) + '\n'
  )
}
// 降权
XMLHttpRequest.createServer(callback).listen(80, function () {
  var env = process.env, 
      uid = parseInt(env['SUDO_UID'] || process.getuid(), 10),
      gid = parseInt(env['SUDO_GID'] || process.getgid(), 10)

  // 必须先降GID，再降UID
  process.setgid(gid)
  process.setuid(uid)
})
// 创建子进程
var child = child_process.spawn('node', ['xxx.js'])

child.stdout.on('data', function (data) {
  console.log('stdout:' + data)
})

child.stderr.on('data', function (data) {
  console.log('stderr:', + data)
})

child.on('close', function (code) {
  console.log('child process exited with code' + code)
})