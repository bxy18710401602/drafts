const http = require('http');
const fs = require('fs'); 
const url = require('url');
const path = require('path');
const os = require('os');
// const querystring = require('querystring');
const server = http.createServer();
// 监听请求，当有http请求到达服务器的时候，回调函数就会被自动执行
server.on('request', (req, res) => {
  const { url: requestUrl, method } = req; // 从request对象中拿到请求url以及请求头的信息
  let parsedUrl = url.parse(requestUrl); // 通过url.parse将请求地址解析成一个对象
  let pathname = parsedUrl.pathname;
  let requestInterface = /^\/api/;
  if (requestInterface.test(pathname)) { // 请求接口
    switch (method) {
      case 'GET':
        handleGetRequest(parsedUrl, req, res);
        break;
      case 'POST':
        handlePostRequest(parsedUrl, req, res);
        break;
    }
  } else { // 请求资源
    requestResource(parsedUrl, req, res);
  }
});
server.listen(8080, function () {
  console.log(`server is running at http://127.0.0.1:8080`)
});
// GET请求的处理方式
function handleGetRequest (url, req, res) {
  // 以下这段代码简单地将前端GET请求的参数返回回去
  res.writeHead(200, {'Content-Type': `text/plain;charset=utf-8`});
  let query = decodeURIComponent(url.query);
  let items = query.split('&');
  let parsedData = {};
  for (let item of items) {
    let arr = item.split('=');
    let key = arr[0];
    let value = JSON.parse(arr[1]);
    parsedData[key] = value;
  }
  // reqData = querystring.parse(body); // querystring.parse只能解析简单的字符串，对于复杂的嵌套参数无法解析正确
  res.end(JSON.stringify(parsedData));
}
// POST请求的处理方式
function handlePostRequest (url, req, res) {
  const { headers } = req;
  let contentType = headers['content-type'];
  let contentTypeArray = contentType.split(';');
  let mimeType = contentTypeArray[0];
  req.on('error', (err) => {
    res.end(`请求失败：${err}`);
  });
  /**
   * 每次在 'data' 事件中触发抓获的数据块是一个 Buffer。如果你已知是一个字符串对象，那么 最好的方案就是把这些数据收集到一个数组中，然后在 'end' 事件中拼接并且把它转化为字符串。
   */
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  });
// 使用application/x-www-form-urlencoded的时候
// 数据被编码成以 '&' 分隔的键-值对, 同时以 '=' 分隔键和值.
// 非字母或数字的字符会被 percent-encoding: 这也就是为什么这种类型不支持二进制数据(应使用 multipart/form-data 代替).
  req.on('end', () => {
    switch (mimeType) {
      case 'application/json':
        reqData = JSON.parse(body); // 解析数据
        res.writeHead(200, {'Content-Type': `application/json;charset=utf-8`}); // 设置响应头
        res.end(JSON.stringify(reqData)); // 将数据返回
        break;
      case 'multipart/form-data':
        body = Buffer.concat(body);
        // 以下开始整理拿到的Buffer数据
        let firstWrapIndex = body.indexOf('\r\n');
        let signifier = body.slice(0, firstWrapIndex); // 拿到标志符
        let buffer = body;
        let index = buffer.indexOf(signifier);
        let result = [];
        while (index !== -1) {
          let item = buffer.slice(0, index);
          buffer = buffer.slice(index + signifier.length);
          index = buffer.indexOf(signifier);
          result.push(item);
        }
        // 将数组整理成对象
        result.shift();
        let resultObject = {}; // 传递的总的参数
        let commonObject = {}; // 用于存放非文件数据
        let fileObject = {}; // 用于存放文件数据
        result.forEach((item, index) => {
          let firstIndex = item.indexOf('\r\n') + 2; // 第一个\r\n
          let lastIndex = item.lastIndexOf('\r\n'); // 最后一个\r\n
          let content = item.slice(firstIndex, lastIndex);
          let centerWrapIndex = content.indexOf('\r\n\r\n');
          let description = content.slice(0, centerWrapIndex).toString();
          let value = content.slice(centerWrapIndex + 4);
          let obj = formatDescription(description); // 将拿到的description整理成对象
          const { name, filename } = obj;
          let contentObject = {
            filename,
            value
          };
          resultObject[name] = contentObject;
          if (filename) {
            fileObject[name] = contentObject;
          } else {
            let value = contentObject.value.toString();
            if (value && value !== 'null' && value !== 'undefined') {
              commonObject[name] = value;
            }       
          }
        });
        let fileUrls = [];
        for (let key in fileObject) {
          let content = resultObject[key];
          const { filename, value } = content;
          fs.writeFile(`./upload/${filename}`, value, (err) => {
            if (err) {
              res.writeHead(200, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
              res.end(`上传失败，失败原因：${err}`);
            } else {
              console.log('图片保存成功')
              let network = os.networkInterfaces(); // 通过os系统拿到网络信息
              const address = network.lo0[0].address;
              fileUrls.push(`http://${address}:8080/upload/${filename}`); // 将文件上传后的地址返回
              let fileUrlsObject = {
                fileUrls
              };
              let returnData = Object.assign(commonObject, fileUrlsObject);
              res.writeHead(200, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
              // 这里将发送的参数以及文件上传后存放的路径返回
              res.end(JSON.stringify(returnData));
            }
          });
        }
        break;
    }
  });
}

// 请求资源的处理方式
function requestResource (url, req, res) {
  let pathname = url.pathname;
  let filePath = pathname.substr(1);
  filePath = filePath === '' ? 'index.html' : filePath;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.write(err.toString());
    } else {
      const suffix = path.extname(filePath).substr(1); // 通过path.extname获取请求文件的后缀名
      if (suffix === 'jpg') {
        let imageStream = fs.createReadStream(filePath);
        let responseData = []; // 存储文件流
        if (imageStream) {
          imageStream.on('data', function (chunk) {
            responseData.push(chunk);
          });
          imageStream.on('end', function () {
            let total = Buffer.concat(responseData);
            res.write(total);
            res.end();
          });
        }
      } else {
        res.writeHead(200, {'Content-Type': `text/${suffix}`});
        res.write(data.toString());
        res.end();
      }
    }
  });
}
// 将拿到的description整理成对象
function formatDescription (description) {
  let arr = description.split('\r\n');
  let obj = {};
  arr.forEach((item) => {
    let arr = item.split(': ');
    let property = arr[0];
    let wholeValue = arr[1];
    let wholeValueArr = wholeValue.split('; ');
    wholeValueArr.forEach((item) => {
      let equalIndex = item.indexOf('=');
      if (equalIndex !== -1) {
        let arr = item.split('=');
        let key = arr[0];
        let value = arr[1].slice(1, -1); // 去掉首尾的"
        obj[key] = value;
      }
    });
  });
  return obj;
}