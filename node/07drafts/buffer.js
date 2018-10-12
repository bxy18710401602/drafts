/*
var str = "深入浅出node.js"
// var buf = new Buffer(str, 'utf-8') // new Buffer已经不推荐使用了
var buf = Buffer.from(str)
console.log(buf)
var buf1 = Buffer.alloc(100)
console.log(buf1.length)
buf1[10] = 3.55
console.log(buf1[10])
console.log(Buffer.isEncoding('gbk'))
*/
/*
var fs = require('fs')

// var rs = fs.createReadStream('test.md')
var rs = fs.createReadStream('test.md', {highWaterMark: 11})
rs.setEncoding('utf8')
var data = ''
rs.on('data', function (chunk) {
  data += chunk
})
rs.on('end', function () {
  console.log(data)
})
*/

/* 正确的拼接Buffer的方法 
var fs = require('fs')
var iconv = require('iconv-lite')
var rs = fs.createReadStream('test.md', {highWaterMark: 11})
var chunks = []
var size = 0
rs.on('data', function (chunk) {
  chunks.push(chunk)
  size += chunk.length
})
rs.on('end', function () {
  var buf = Buffer.concat(chunks, size)
  var str = iconv.decode(buf, 'utf8')
  console.log(str)
})
*/

var http = require('http')
var helloworld = ''
for (var i = 0; i < 1024 * 10; i++) {
  helloworld += 'a'
}

helloworld = new Buffer(helloworld)

http.createServer(function (req, res) {
  res.writeHead(200)
  res.end(helloworld)
}).listen(8001)