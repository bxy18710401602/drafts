let Chat = function (socket) {
  this.socket = socket
}

Chat.prototype = {
  constructor: Chat,
  // 处理发送消息
  sendMessage (room, text) {
    const message = {
      room,
      text
    }
    this.socket.emit('message', message)
  },
  // 处理改变房间
  changeRoom (room) {
    this.socket.emit('join', {
      newRoom: room
    })
  },

  // 处理聊天命令
  processCommand (command) {
    let words = command.split(' ')
    let word1 = words[0]
    command = word1.substring(1, word1.length).toLowerCase()
    let message = false
    let name = false
    switch (command) {
      case 'join':
        words.shift()
        name = words.join(' ')
        this.changeRoom(name)
        break
      case 'nick':
        words.shift()
        name = words.join(' ')
        this.socket.emit('nameAttempt', name)
        break
      default: 
        message = '不能识别的命令'
        break
    }
    return message
  }
}