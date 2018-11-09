let http = require('http')
let formidable = require('formidable')

let server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'GET':
      show(req, res)
      break
    case 'POST':
      upload(req, res)
      break
  }
})

server.listen(3000)

function show (req, res) {
  let html = `
    <form method="post" action="/" enctype="multipart/form-data">
      <p><input type="text" name="name" /></p>
      <p><input type="file" name="file" /></p>
      <p><input type="submit" name="Upload" /></p>
    </form>
  `
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function upload (req, res) {
  if (!isFormData(req)) {
    res.statusCode = 400
    res.end('Bad Request: expecting multipart/form-data')
    return
  }

  let form = new formidable.IncomingForm()

  // form.on('field', function (field, value) {
  //   console.log('field', field)
  //   console.log('value', value)
  // })
  // form.on('file', function (name, file) {
  //   console.log('name', name)
  //   console.log('file', file)
  // })
  // form.on('end', function () {
  //   res.end('upload complete')
  // })
  // form.parse(req)

  // 简化版
  form.parse(req, function (err, fileds, files) {
    // console.log(fileds)
    // console.log(files)
    res.end('upload complete!')
  })
  form.on('progress', function (byteRecieived, bytesExpected) {
    let percent = Math.floor(byteRecieived / bytesExpected * 100)
    console.log(percent, 'aaa')
  })
}

function isFormData (req) {
  console.log(req, 'req')
  let type = req.headers['content-type'] || ''
  return 0 == type.indexOf('multipart/form-data')
}