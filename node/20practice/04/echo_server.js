let net = require('net')

let server = net.createServer(function (socket) {
  // socket.on('data', function (data) {
  //   socket.write(data)
  // })
  // data事件只被处理一次
  socket.once('data', function (data) {
    socket.write(data)
  })
})

server.listen(3000, '127.0.0.1')