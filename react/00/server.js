const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (req, res) {
  console.log(req.url, '请求的地址');
  let pathname = url.parse(req.url).pathname;
  console.log(pathname);
  fs.readFile(pathname.substr(1), function(err, data){
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data.toString());
    }
    res.end();
  });
}).listen(8080);

