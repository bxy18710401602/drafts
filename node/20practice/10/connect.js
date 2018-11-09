const connect = require('connect')
const app = connect()
app.use(logger)
   .use('/admin', restrict)
   .use('/admin', admin)
   .use(hello)
   .listen(3000)

function logger (req, res, next) {
  console.log('%s %s', req.method, req.url)
  next()
}

function hello (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world')
}
function restrict (req, res, next) {
  const authorization = req.headers.authorization
  if (!authorization) return next(new Error('Unauthorized'))

  const parts = authorization.split(' ')
  let scheme = parts[0]
  let buffer = Buffer.from(parts[1], 'base64')
  let auth = buffer.toString().aplit(':')
  const user = auth[0]
  const pass = auth[1]

  authenticateWithDatabase(user, pass, function (err) {
    if (err) return next(err)
    next()
  })
}

function admin (req, res, next) {
  switch (req.url) {
    case '/':
      res.end('try /users')
      break
    case '/users':
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(['tobi', 'loki', 'jane']))
      break
  }
}