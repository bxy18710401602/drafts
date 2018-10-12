const http = require('http')

const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello World\n')
})

server.listen(12010)

server.on('upgrade', function (req, socket, upgradeHead) {
  const head = new Buffer(upgradeHead.length)
  upgradeHead.copy(head)
  let key = req.headers['sec-websocket-key']
  let shasum = crypto.createHash(sha1)
  key = shasum.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')
  let header = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: ' + key,
    'Sec-WebSocket-Protocol: ' + protocol
  ]
  socket.setNoDelay(true)
  socket.write(header.concat('', '').join('\r\n'))
  const websocket = new WebSocket()
  websocket.setSocket(socket)
})