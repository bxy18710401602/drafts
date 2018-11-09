
let socket = io.connect()

$(document).ready(function () {
  let chatApp = new Chat(socket)

  socket.on('nameResult', function (result) {
    let message

    if (result.success) {
      message = `你现在已经拥有了用户名${result.name}`
    } else {
      message = result.message
    }
    $('#message').append(divSystemContentElement(message))
  })

  socket.on('joinResult', function (result) {
    console.log(result.room, '查看房间的结果')
    $('#room').html(result.room)
    $('#message').append(divSystemContentElement('房间已经改变了'))
  })

  socket.on('message', function (message) {
    const newElement = $('<div></div>').text(message.text)
    $('#message').append(newElement)
  })

  socket.on('rooms', function (rooms) {
    $('#room-list').empty()

    for (let room in rooms) {
      room = room.substring(1, room.length)
      if (room !== '') {
        $('#room-list').append(divEscapedContentElement(room))
      }
    }
    $('#room-list div').click(function () {
      chatApp.processCommand('/join ' + $(this).text())
      $('#send-message').focus()
    })
  })

  setInterval(function () {
    socket.emit('rooms')
  }, 1000)

  $('#send-message').focus()

  $('#send-button').click(function () {
    processUserInput(chatApp, socket)
  })

})

// 显示可疑的文本数据
function divEscapedContentElement (message) {
  return $('<div></div>').text(message)
}

// 显示受信的文本数据
function divSystemContentElement (message) {
  return $('<div></div>').html(`<i>${message}</i>`)
}

// 处理原始的用户输入
function processUserInput (chatApp, socket) {
  const message = $('#send-message').val()
  let systemMessage
  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message)
    if (systemMessage) {
      $('#message').append(divSystemContentElement(systemMessage))
    }
  } else {
    chatApp.sendMessage($('#room').text(), message)
    $('#message').append(divEscapedContentElement(message))
    $('#message').scrollTop($('#message').prop('scrollHeight'))
  }
  $('#send-message').val('')
}