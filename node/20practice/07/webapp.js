const http = require('http')
const parse = require('url').parse
const join = require('path').join
const fs = require('fs')

const root = __dirname

let server = http.createServer(function (req, res) {
  let url = parse(req.url)
  let path = join(root, url.pathname)
  let stream = fs.createReadStream(path)
  // stream.on('data', function (chunk) {
  //   res.write(chunk)
  // })
  // stream.on('end', function () {
  //   res.end()
  // })

  // 使用pipe简化
  stream.pipe(res)
  stream.on('error', function (err) {
    res.statusCode = 500
    res.end('Internal Server Error')
  })
})

server.listen(3000)
