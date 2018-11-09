const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
  if (req.url === '/') {
    fs.readFile('./titles.json', function (err, data) {
      // 这里得到的data是Buffer数据，需要转换一下
      console.log(JSON.parse(data.toString()))
      if (err) {
        res.end('Server Error')
      } else {
        let titles = JSON.parse(data.toString()).titles

        fs.readFile('./template.html', function (err, data) {
          if (err) {
            res.end('Server Error')
          } else {
            let tmpl = data.toString()
            let html = tmpl.replace('%', titles.join('</li><li>'))
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(html)
          }
        })
      }
    })
  }
}).listen(3000)

// 可以将处理错误的代码整理成一个函数，将处理模版的代码整理成一个函数，这样看起来简洁一点
// 现在根据ECMASCRIPT2015标准，可以使用Promise来使代码更加简洁
// 在发生错误的时候就直接返回，避免执行后续的异步请求