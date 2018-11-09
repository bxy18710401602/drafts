let events = require('events')
let net = require('net')
let channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

channel.on('join', function (id, client) {
  this.setMaxListeners(10)
  console.log(this.listeners('broadcast').length, 'aaa')
  this.clients[id] = client
  this.subscriptions[id] = function (senderId, message) {
    if (id != senderId) {
      this.clients[id].write(message)
    }
  }
  this.on('broadcast', this.subscriptions[id])
  this.on('live', function(id) {
    this.removeListener('broadcast', this.subscriptions[id])
    this.emit('broadcast', id, `${id} 退出聊天了\n`)
  })
  this.on('shutdown', function () {
    this.emit('broadcast', '', '聊天被中止了')
    this.removeAllListeners('broadcast')
  })
})

let server = net.createServer(function (client) {
  let id = client.remoteAddress + ':' + client.remotePort
  channel.emit('join', id, client)
  client.on('data', function (data) {
    data = data.toString()
    if (data.indexOf('shutdown') > -1) {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, data)
  })
  client.on('close', function () {
    channel.emit('leave', id)
  })
})

server.listen(3000)
