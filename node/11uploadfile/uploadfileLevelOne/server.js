const http = require('http');
const fs = require('fs'); 
const url = require('url');
const querystring = require('querystring');
const path = require('path');
// 当有http请求到达服务器的时候，createServer中传入的函数就会被自动执行
const server = http.createServer(function (req, res) {
  console.log('bbb')

});
server.on('request', (req, res) => {
  const { url: requestUrl, headers } = req; // 从request对象中拿到请求url以及请求头的信息
  let urlParse = url.parse(requestUrl);
  let pathname = urlParse.pathname; // 通过url.parse将请求地址解析成一个对象
  let requestInterface = /^\/api/;
  console.log('aaa', requestUrl )
  if (requestInterface.test(pathname)) {
    if (pathname === '/api/uploadfile') { // 上传文件的api
      /**
       * 每次在 'data' 事件中触发抓获的数据块是一个 Buffer。如果你已知是一个字符串对象，那么 最好的方案就是把这些数据收集到一个数组中，然后在 'end' 事件中拼接并且把它转化为字符串。
       */
      let body = [];
      // req.setEncoding('binary'); // 设置编码格式为二进制
      // req.setEncoding('utf8'); // 设置编码格式为utf8
      // 监听请求到数据的这个res是在http的request事件中的，所以在这里res.on('data'和res.on('end'中的回调函数都是无法执行的
      req.on('data', (chunk) => {
        // reqData += chunk;
        body.push(chunk);
      });
      req.on('end', () => {
        body = Buffer.concat(body).toString();
        reqData = querystring.parse(body); // 解析获取到的数据
        // res.writeHead(200, {'Content-Type': `multipart/form-data;charset=utf-8`});
        // 使用application/x-www-form-urlencoded的时候
        // 数据被编码成以 '&' 分隔的键-值对, 同时以 '=' 分隔键和值.
        // 非字母或数字的字符会被 percent-encoding: 这也就是为什么这种类型不支持二进制数据(应使用 multipart/form-data 代替).
        // 这时候前端需要使用encodeURIComponent将数据编码后再传送
        res.writeHead(200, {'Content-Type': `application/x-www-form-urlencoded;charset=utf-8`});
        res.end(`请求结束`);
        console.log(reqData.test, '获取到的数据')
        // for (let key in reqData) {
        //   console.log(key, '关键字')
        // }
        // res.end();
        // fs.writeFile('./upload/message.jpeg', reqData, (err) => {
        //   if (err) {
        //     res.end('上传失败');
        //   } else {
        //     res.end('上传成功');
        //   }
        //   console.log('The file has been saved!');
        // });
      });
    }
    // 以下这段代码简单地将前端GET请求的参数返回回去
    // res.writeHead(200, {'Content-Type': `text/plain;charset=utf-8`});
    // let queryObject = querystring.parse(urlParse.query); // 将参数的字符串转换为对象
    // res.end(JSON.stringify(queryObject));
  } else {
    let filePath = pathname.substr(1);
    filePath = filePath === '' ? 'index.html' : filePath;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.write(err.toString());
      } else {
        const suffix = path.extname(filePath).substr(1); // 通过path.extname获取请求文件的后缀名
        res.writeHead(200, {'Content-Type': `text/${suffix}`});
        res.write(data.toString());
      }
      res.end();
    });
  }
});
server.listen(8080, function () {
  console.log(`server is running at http://127.0.0.1:8080`)
});
