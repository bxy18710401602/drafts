const express = require('express')
const chalk = require('chalk')
var birds = require('./routes/birds')
var mw = require('./routes/my-middleware')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/birds', birds)

/*****中间件（middleware）*****/

// 中间件函数是可以在请求响应过程中使用request对象，response对象，和next函数的函数
// 如果中间件函数没有结束请求响应周期，那么他必须调用next函数来将控制权交给另一个中间件函数，否则请求会被挂起
// 中间件能执行以下任务1. 执行任何代码，2. 改变请求和响应对象，3. 结束请求响应周期， 4. 在栈中调用next中间件

var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

// 加载中间件函数需要使用app.use(), 中间件的执行顺序是先加载的先执行
app.use(myLogger)

app.get('/test', function (req, res) {
  res.send('Hello World !')
})

var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}
app.use(requestTime)

app.get('/test01', function (req, res) {
  var responseText = 'Hello World! <br/>'
  responseText += '<small> Requested at: ' + req.requestTime + '</small>'
  res.send(responseText)
})

app.use(mw({ option1: 1, option2: 2}))

// 开始一个服务并监听3000端口
app.listen( 3000, () => {
  console.log('view at ' + chalk.green('http://127.0.0.1:3000'))
})
// 一个Express中间件可以使用以下类型的中间件
// 应用层中间件，路由层中间件，错误处理型中间件，内置中间件，第三方中间件

// 应用层中间件使用app.use()或者app.METHOD()(METHOD代表get，post，put等请求方式)

// 没有使用路径，只要有请求发生就执行
app.use(function (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// 函数在对路径'/user/:id'的任何请求发生的时候，都会执行
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type: ', req.method)
  next()
})
// 处理get请求
app.get('/user/:id', function (req, res, next) {
  res.send('USER')
})

app.use('/user01/:id', function (req, res, next) {
  console.log('Request URL: ', request.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type: ', req.method)
  next()
})
// 路由处理程序允许为同一个路径定义多个路由
app.get('/test02/:id', function (req, res, next) {
  console.log('ID: ', req.params.id)
  next()
}, function (req, res, next) {
  res.send('User Info')
})

app.get('/test02/:id', function (req, res, next) {
  res.end(req.params.id)
})

// next('route')用来跳转到下一个路由，但是仅对使用app.METHOD()或者router.METHOD()函数加载的路由有效
app.get('/test03/:id', function (req, res, next) {
  if (req.params.id === '0') {
    next('route')
  } else {
    next()
  }
}, function (req, res, next) {
  res.send('regular')
})

app.get('/test03/:id', function (req, res, next) {
  res.send('special')
})

// 路由层的中间件
// 路由曾的中间件和应用层的中间件工作方式一样，只不过它绑定到了express.Router()的一个实例上

var router = express.Router()

// 没有指定路径，每个请求都会执行代码
router.use(function (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// 为/test04/:id路径的所有HTTP请求执行操作
router.use('test04/:id', function (req, res, next) {
  console.log('Request URL: ', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type: ', req.method)
  next()
})

// 为/test04/:id路径的所有GET请求执行操作
router.get('test04/:id', function (req, res, next) {
  if (req.params.id === '0') {
    next('route') 
  } else {
    next()
  }
}, function (req, res, next) {
  res.render('regular')
})
router.get('test04/:id', function (req, res, next) {
  console.log(req.params.id)
  res.render('special')
})

// 将路径添加到app中
app.use('/', router)

// 使用next('router')跳过router剩余的中间件
router.use(function (req, res, next) {
  if (!req.headers['x-auth']) {
    return next('router')
  } else {
    next()
  }
})

router.get('/test05', function (){
  res.send('hello, user!')
})

app.use('/admin', router, function (req, res) {
  res.sendStatus(401)
})

// 错误处理中间件，错误处理中间件的四个参数必须都写好，即使需要
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Somrthinf broke !')
})

/*****内置的中间件******/

// express.static 服务端的静态文件比如HTML，图片等
// express.json 使用JSON解析请求
// express.urlencoded 用URL编码的方式解析请求

/****第三方中间件*****/
// 先使用npm  install cookie-parser 安装好
var cookieParser = require('cookie-parser')
app.use(cookieParser())



