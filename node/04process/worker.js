process.on('message', function (msg) {
  if (!msg.flag) {
    console.log('aaa')
    process.exit(1)
  } else {
    console.log('bbb')
    process.exit(0)
  }
})