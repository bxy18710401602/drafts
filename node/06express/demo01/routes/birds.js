var express = require('express')
var router = express.Router()

// 路由的中间件
router.use(function timeLog (req, res, next) {
  console.log('时间：', Date.now())
  next()
})

router.get('/', function (req, res) {
  res.send('Birds home page')
})

router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router