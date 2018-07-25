 const express = require('express')
const chalk = require('chalk')
const mongoose = require('mongoose')
var birds = require('./routes/birds')

const app = express()

mongoose.connect('mongodb://localhost/test') // 打开对test数据库的连接
var db = mongoose.connection
db.on('error', console.error.bind(console, 'conection error:'))
db.once('open', function () {
  console.log('数据库连接成功')
})

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.render('index', { title: 'Hey', message: 'Hello there !' })
})

app.use('/birds', birds)

// 开始一个服务并监听3000端口
app.listen( 3000, () => {
  console.log('view at ' + chalk.green('http://127.0.0.1:3000'))
})

// 为了渲染模版文件，需要设置一些应用属性
// 1. views 设置模版文件放置的路径，例如：app.set('views', './views')，默认为程序根目录
// 2. view engine 需要使用的模版引擎，例如设置Pug模版引擎，app.set('view engine', 'pug')
app.set('views', './views')
app.set('view engine', 'pug')



