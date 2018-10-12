const crypto = require('crypto')

let WebSocket = function (url) {
  this.options = parseUrl(url)
  this.connect()
}

WebSocket.prototype.onopen = function () {

}

WebSocket.prototype.setSocket = function (socket) {
  this.socket = socket
  this.socket.on('data', this.receiver)
}
WebSocket.prototype.send = function (data) {
  this._send(data)
}
WebSocket.prototype.connect = function () {
  let that = this
  let key = new Buffer(`${this.options.protocolVersion}-${Date.now()}`).toString('base64')
  let shasum = crypto.createHash('sha1')
  let expected = shasum.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')
  let options = {
    port: this.options.port,
    host: this.options.hostname,
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websoket',
      'Sec-WebSocket-Version': this.options.protocolVersion,
      'Sec-WebSocket-Key': key
    }
  }
  let req = http.request(options)
  req.end()
  req.on('upgrade', function (res, socket, upgradeHead) {
    that.setSocket(socket)
    that.onopen()
  })
}