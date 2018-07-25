var fs = require('fs')

function copy(src, dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst))
}

function main (argv) {
  copy(argv[0], argv[1])
}
console.log(process.argv)
let src = process.argv[1]
let dst = '/Users/yubai/Desktop/practice/drafts/node/02file/test.js'
// main([src, dst])
let rs = fs.createReadStream(src)
var ws = fs.createWriteStream(dst)

rs.on('data', function (chunk) {
  // 根据write方法的返回值来判断数据是写入目标了还是临时放缓存了
  if (ws.write(chunk) === false){
    rs.pause()
  } 
})
rs.on('end', function () {
  ws.end()
})
// 根据drain事件判断止血数据流已经将缓存中的数据写入目标，可以传入下一个待写数据
ws.on('drain', function () {
  rs.resume()
})
/*
// 为数据来源创建一个只读数据流
rs.on('data', function (chunk) {
  // 在处理数据前暂停数据读取
  rs.pause()
  doSomething(chunk, function () {
    // 处理数据后继续读取数据
    rs.resume()
  })
})

rs.on('end', function () {
  cleanUp()
})
*/


function doSomething (data) {
  console.log(data)
}
function cleanUp () {
  console.log('end')
}
