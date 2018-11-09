const socketio = require('socket.io')
let io, 
    guestNumber = 1,
    nickNames = {},
    nameUsed = [],
    currentRoom = {}
exports.listen = function (server) {
  io = socketio(server)
  io.set('log level', 1)
  io.on('connection', function (socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, nameUsed) 
    joinRoom(socket, 'room1')
    handleMessageBroadcasting(socket, nickNames) 
    handleNameChangeAttempts(socket, nickNames, nameUsed) 
    handleRoomJoining(socket) 

    socket.on('rooms', function () {
      socket.emit('rooms', io.sockets.adapter.rooms)
    })
    
    handleClientDisconnection(socket, nickNames, nameUsed) 
  })
}

// 给连接上来的用户访客名
function assignGuestName(socket, guestNumber, nickNames, nameUsed) {
  const name = '用户' + guestNumber
  nickNames[socket.id] = name
  socket.emit('nameResult', {
    success: true,
    name: name
  })
  nameUsed.push(name)
  return guestNumber + 1
}

// 连接上的时候默认进入1号聊天室
function joinRoom (socket, room) {
  socket.join(room)
  currentRoom[socket.id] = room
  socket.emit('joinResult', { room: room })
  socket.to(room).emit('message', {
    text: `${nickNames[socket.id]} 加入了 ${room} .`
  })
  let usersInRoom = false
  io.of(room).clients((error, clients) => {
    if (error) throw error
    usersInRoom = clients
  })
  if (usersInRoom.length > 1) {
    let usersInRoomSummary = `用户现在在房间${room}:`
    for (let index in usersInRoom) {
      const userSocketId = usersInRoom[index].id
      if (userSocketId !== socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', '
        }
        usersInRoomSummary += nickNames[userSocketId]
      }
    }
    usersInRoomSummary += '.'
    socket.emit('message', { text: usersInRoomSummary })
  }
}

// 处理用户名修改
function handleNameChangeAttempts(socket, nickName, nameUsed) {
  socket.on('nameAttempt', function (name) {
    if (name.indexOf('用户') === 0) {
      socket.emit('nameResult', {
        success: false,
        message: '名称不能以"用户"开头'
      })
    } else {
      if (nameUsed.indexOf(name) == -1) {
        let previousName = nickNames[socket.id]
        let previousNameIndex = nameUsed.indexOf(previousName)
        nameUsed.push(name)
        nickNames[socket.id] = name
        delete nameUsed[previousNameIndex]
        socket.emit('nameResult', {
          success: true,
          name: name
        })
        socket.to(currentRoom[socket.id]).emit('message', {
          text: `${previousName} 现在改名为 ${name} 了`
        })
      } else {
        socket.emit('nameResult', {
          success: false,
          message: `这个名字现在已经有人使用了`
        })
      }
    }
  })
}

// 处理信息广播
function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.to(message.room).emit('message', {
      text: `${nickNames[socket.id]} : ${message.text}`
    })
  })
}

// 处理切换房间
function handleRoomJoining (socket) {
  socket.on('join', function (room) {
    socket.leave(currentRoom[socket.id])
    joinRoom(socket, room.newRoom)
  })
}

// 处理客户端断开连接
function handleClientDisconnection (socket) {
  socket.on('disconnect', function () {
    let nameIndex = nameUsed.indexOf(nickNames[socket.id])
    delete nameUsed[nameIndex]
    delete nickNames[socket.id]
  })
}