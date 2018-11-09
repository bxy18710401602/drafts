const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

let cache = {}
const config = {
  port: 3000
}

const server = http.createServer(function (request, response) {
  let filePath = false
  if (request.url == '/') {
    filePath = 'public/index.html'
  } else {
    filePath = 'public' + request.url
  }
  const absPath = './' + filePath
  serveStatic(response, cache, absPath)
})

const chatServer = require('./lib/chat_server')
chatServer.listen(server)

const port = config.port
server.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`)
})

// 请求文件不存在时发送404错误
function send404 (response) {
  response.writeHead(404, {'Content-Type': 'text/plain'})
  response.write('Error 404: resource not found')
  response.end()
}

// 提供文件数据服务
function sendFile (response, filePath, fileContents) {
  response.writeHead(200,
    {'content-type': mime.getType(path.basename(filePath))}
  )
  response.end(fileContents)
}

// 提供静态文件服务
function serveStatic (response, cache, absPath) {
  // 如果文件缓存在内存中，就直接从内存中取
  if (cache[absPath]) { 
    sendFile(response, absPath, cache[absPath])
  } else { // 检查文件是否存在，如果存在则从硬盘中读取
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          if (err) {
            send404(response)
          } else {
            cache[absPath] = data
            sendFile(response, absPath, data)
          }
        })
      } else {
        send404(response)
      }
    })
  }
}