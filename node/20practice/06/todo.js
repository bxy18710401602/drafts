let http = require('http')
let url = require('url')
let items = []

let server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST': 
      let item = ''
      req.setEncoding('utf8')
      req.on('data', function (chunk) {
        item += chunk
      })
      req.on('end', function () {
        items.push(item)
        res.end('OK\n')
      })
      break;
    case 'GET':
      // items.forEach(function (item, i) {
      //   res.write(`${i}) ${item}\n`)
      // })
      // res.end()

      // 优化后的GET处理
      let body = items.map(function (item, i) {
        return `${i} ) ${item}`
      }).join('\n')
      res.setHeader('Content-Type', Buffer.byteLength(body))
      res.setHeader('Content-Type', 'text/plain', charset="utf-8")
      res.end(body)
      break;
    case 'DELETE': 
      let path = url.parse(req.url).pathname
      let i = parseInt(path.slice(1), 10)

      if (isNaN(i)) {
        res.statusCode = 404
        res.end('Item not found')
      } else {
        items.splice(i, 1)
        res.end('OK\n')
      }
      break
    case 'PUT':
      let data = ''
      req.setEncoding('utf8')
      req.on('data', function (chunk) {
        data += chunk
      })     
      req.on('end', function () {
        let num = parseInt(data)
        items[num] = 'aaa'
        res.end(items.join('\n'))
      })
  }
})

server.listen(3000)
