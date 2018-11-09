let http = require('http')
let server = http.createServer (function (req, res) {
  let url = 'https://www.baidu.com/'
  let body = `<p>Redirecting to <a href="${url}">${url}</a></p>`
  res.setHeader('Location', url)
  res.setHeader('Content-Length', body.length)
  res.setHeader('Content-Type', 'text/html')
  res.statusCode = 302
  res.end(body)
})

server.listen(3000)