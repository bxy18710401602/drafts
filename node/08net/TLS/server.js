const tls = require('tls')
const fs = require('fs')

// 建立TLS服务先要准备好所需的证书(在创建server.csr的时候失败了)
const option = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt'),
  requestCert: true,
  ca: [fs.readFileSync('./keys/ca.crt')]
}

const server = tls.createServer(options, function (stream) {
  console.log('server connected', stream.authorized ? 'authorized' : 'unauthorized')
  stream.write('welcome!\n')
  stream.setEncoding('utf8')
  stream.pipe(stream)
})

server.listen(8000, function () {
  console.log('server bound')
})