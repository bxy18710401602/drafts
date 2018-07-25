var fs = require('fs')

function copy(src, dst) {
  // fs.writeFileSync(dst, fs.readFileSync(src)) // 小文件拷贝
  fs.createReadStream(src).pipe(fs.createWriteStream(dst))
}

function main (argv) {
  copy(argv[0], argv[1])
}
console.log(process.argv, 'aaa')
let src = process.argv[1]
let dst = '/Users/yubai/Desktop/practice/drafts/node/02file/test.js'
main([src, dst])