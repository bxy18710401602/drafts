/*
process.on('SIGTERM', function () {
  console.log('aaa')
  process.exit(0)
})
*/ 

process.on('message', function (msg) {
  msg.hello = msg.hello.toUpperCase()
  process.send(msg)
  process.exit(0)
})
