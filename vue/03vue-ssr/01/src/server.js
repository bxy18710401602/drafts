const Vue = require('vue')
const server = require('express')()
const fs = require('fs')
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./src/pages/template.html', 'utf-8')
})
const createApp = require('./app.js')

server.get('*', (req, res) => {
  const context = {
    url: req.url
  }
  const app = createApp(context)
  
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Interval Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8000)