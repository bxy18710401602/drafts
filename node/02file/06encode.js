function readText (pathname) {
  var bin = fs.readFileSync(pathname)

  // 去除bom
  if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
    bin = bin.slice(3)
  }
  return bin.toString('utf-8')
}

// GBK转UTF8
var iconv = require('iconv-lite')

function readGBKText (pathname) {
  var bin = fs.readFileSync(pathname)
  return iconv.decode(bin, 'gbk')
}