const server = require('express')()
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')

const renderer = require('vue-server-renderer').createRenderer({
  runInNewContext: false, // 设置为false后，bundle代码将与服务器进程在同一个global上下文中进行
  template: fs.readFileSync('./index.html', 'utf-8')
})

const { app } = require('../src/app.js')

server.get('*', (req, res) => {

  renderer.renderToString(app, (err, html) => {
    if (err) {
      if ( err.code === 404 ) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Interval Server Error')
      }
    } else {
      res.end(html)
    }
  })
})

server.listen(8000)