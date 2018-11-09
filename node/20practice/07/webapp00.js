let https = require('https')
let fs = require('fs')

let options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem')
}

https.createServer(options, function (req, res) {
  res.writeHead(200)
  res.end('hello world\n')
}).listen(3000)