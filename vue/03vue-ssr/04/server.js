const Vue = require('vue')
const fs = require('fs')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.template.html', 'utf-8')
})

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的URL是：{{url}}</div>`
  })
  
  const context = {
    title: 'hello',
    meta: `
      <meta name="keywords" content="aaa"> 
    `
  }

  renderer.renderToString(app, context).then(html => {
    res.send(html)
    console.log(html)
  }).catch(err => {
    console.log(err)
  })
})

server.listen(8080)
