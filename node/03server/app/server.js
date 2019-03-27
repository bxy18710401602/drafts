const http = require('http');
const page = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>网页</title>
    <style type="text/css">
     body {
       font-size: 15px;
     }
    </style>
  </head>
  <body>
    <h1>测试测试</h1>
  </body>
</html>
`

http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html');
  res.end(page)
})
.listen(3000, () => {
  console.log('server running at 3000')
})