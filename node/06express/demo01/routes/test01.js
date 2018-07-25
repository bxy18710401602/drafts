const express = require('express')
const chalk = require('chalk')
const app = express()

// 开始一个服务并监听3000端口
app.listen( 3000, () => {
  console.log('view at ' + chalk.green('http://127.0.0.1:3000'))
})
// 当post请求发生时触发
app.post('/', (req, res) => {
  res.send('POST request to the homepage')
})
// 任何请求发生时都触发回调函数
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...')
  next() // 交由下个处理程序处理
})

// 基础路由的结构是 app.METHOD(PATH, HANDLER)
// 当get请求发生时触发
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/about', (req, res) => {
  res.send('about')
})
app.get('/random.text', (req, res) => {
  res.send('random.text')
})
// express使用了path-to-regexp，因此ab?cd是按照正则表达式来处理路径的
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd包含0个或者1个b')
})
// app.get(/a/, (req, res) => {
//   res.send('匹配任何包含a字符的路径')
// })
app.get(/.*fly$/, (req, res) => {
  res.send('匹配以fly结尾的路径')
})

/************路由参数************/

app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
  // 路径http://127.0.0.1:3000/users/12/books/22
  // 参数
  // {
  // userId: "12",
  // bookId: "22"
  // }
})
// 利用-和.
app.get('/test/:from-:to', (req, res) => {
  res.send(req.params)
})
app.get('/test/:type.:name', (req, res) => {
  res.send(req.params)
})

// 不知为何，这个添加了正则的请求报404错误
app.get('/test01/:userId(\d+)', (req, res) => {
  res.send(req.params)
})

/************路由处理程序************/

// 可以提供一个或多个回调函数来处理请求，当有多个回调函数的时候，一定要有next
app.get('/example/a', function (req, res) {
  res.send('Hello from A!')
})

app.get('/example/b', function (req, res, next) {
  console.log('响应会由下一个（next）回调函数发出')
  next()
}, function (req, res) {
  res.send('Hello from B !')
})
// 一个数组的回调函数也能用来处理响应
var cb0 = function (req, res, next) {
  console.log('奇变')
  next()
}

var cb1 = function (req, res, next) {
  console.log('偶不变')
  next()
}

var cb2 = function (req, res) {
  res.send('符号看象限！')
}

app.get('/example/c', [cb0, cb1, cb2])

// 独立的一些函数和数组函数组合起来也能处理路由
app.get('/example/d', function (req, res, next) {
  console.log('响应将由下一个函数返回')
  next()
}, function (req, res) {
  res.send('Hello from D !')
})

/************响应的方法************/

// 如果以下的任何一个方法都没有被调用，那么请求将被挂起
/*
res.download() 下载一个文件
res.end() 结束响应进程
res.json() 发送一个JSON响应
res.jsonp() 发送一个有JSONP支持的响应
res.redirect() 重定向一个请求
res.render() 渲染一个视图模版
res.send() 发送各种格式的响应
res.sendFile() 按照八位字节流发送一个文件
res.sendStatus() 设置响应状态码并将其作为字符串放在响应主体中返回
*/

/************app.route()************/

// 使用app.route()能够创建链式路由处理
app.route('/book')
   .get(function (req, res) {
     res.send('Get a random book')
   })
   .post(function (req, res) {
     res.send('Add a book')
   })
   .put(function () {
     res.send('Update the book')
   })


/************express.Router()************/

// 使用express.Router()可以创建模块化，可安装的路由处理程序，一个Router实例就是一个完整的中间件和路由系统
