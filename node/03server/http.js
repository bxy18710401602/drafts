let http = require('http')

// 创建一个服务器
http.createServer(function (request, response) {
  // response.writeHead(200, { 'Content-Type': 'text-plain' })
  // response.end('Hello World\n')
  var body = []
  console.log(request.method)
  console.log(request.headers)

  request.on('data', function (chunk) {
    body.push(chunk)
  })

  request.on('end', function (){
    body = Buffer.concat(body)
    console.log(body.toString())
  })

}).listen(8124)

// 是否使用gzip压缩，如果是，就解压缩
var options = {
  hostname: 'www.example.com',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Accept-Encoding': 'gzip, deflate'
  }
}

http.request(options, function (response) {
  var body = []
  response.on('data', function (response) {
    body.push(chunk)
  })
  response.on('end', function () {
    body = Buffer,concat(body)

    if (response.headers['content-encoding'] === 'gzip') {
      zlib.gunzip(body, function (err, data) {
        console.log(data.toString())
      })
    } else {
      console.log(data.toString)
    }
  })
}).end()