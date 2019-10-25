const http = require('http');
const fs = require('fs'); 
const url = require('url');
const path = require('path');
const os = require('os');
// const querystring = require('querystring');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const server = http.createServer();

let mongoDb = null; // 声明一个变量，代表数据库
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'practice';
const dbClient = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

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
  connectToMongoDB();
  console.log(`server is running at http://127.0.0.1:8080`)
});
// GET请求的处理方式
function handleGetRequest (url, req, res) {
  // 以下这段代码简单地将前端GET请求的参数返回回去
  res.writeHead(200, {'Content-Type': `text/plain;charset=utf-8`});
  let query = decodeURIComponent(url.query);
  let parsedData = {};
  if (query) {
    let items = query.split('&');
    for (let item of items) {
      let arr = item.split('=');
      let key = arr[0];
      let value = JSON.parse(arr[1]);
      parsedData[key] = value;
    }
  }
  // reqData = querystring.parse(body); // querystring.parse只能解析简单的字符串，对于复杂的嵌套参数无法解析正确
  res.end(JSON.stringify(parsedData));
}
// POST请求的处理方式
function handlePostRequest (url, req, res) {
  const { headers } = req;
  let contentType = headers['content-type'];
  let range = headers['range'];
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
        let resultObject = {}; // 用于存放从用户传参中整理出来的数据
        result.forEach((item, index) => {
          let firstIndex = item.indexOf('\r\n') + 2; // 第一个\r\n
          let lastIndex = item.lastIndexOf('\r\n'); // 最后一个\r\n
          let content = item.slice(firstIndex, lastIndex);
          let centerWrapIndex = content.indexOf('\r\n\r\n');
          let descriptionStr = content.slice(0, centerWrapIndex).toString();
          let value = content.slice(centerWrapIndex + 4);
          let description = formatDescription(descriptionStr); // 将拿到的description整理成对象
          const { name, filename } = description;
          if (filename) {
            resultObject[name] = value; // 如果是传输的是文件，直接存放二进制数据
          } if (name === 'blockContent') {
            resultObject[name] = value; // 如果传输的是分块，直接存放二进制数据
          } else { // 否则存放字符串类型的数据
            value = value.toString(); // 非文件类型的二进制数据转换为字符串格式
            if (value && value !== 'null' && value !== 'undefined') {
              resultObject[name] = value;
            }
          }
        });
        if (range) {
          //  如果range存在，那么
          let [, startByte, endByte] = range.match(/(\d*)-(\d*)/);
          /**
           * 整理后的数据如下：
           * {
           *  fileId: '123test', // 文件的唯一标志符
           *  blockIndex: 1, // 文件分块的索引
           *  fileSize: 1200, // 总的文件大小，单位是byte
           *  blockLength: 12, // 文件分成了几块
           *  blockContent: <Buffer ...>, // 文件分块的内容是一个Buffer数据
           *  fileName: 'catordog' // 文件名，前端传了文件名，后端就可以直接用了
           * }
           */
          // 将传过来的数据存入数据库
          console.log(resultObject, 'resultObject===');
          console.log(resultObject.blockContent.toString(), 'resultObject.blockContent.toString()===');
          insertDocuments(req, res, resultObject, ({fileName, fileContent}) => {
            storageFile(req, res, {fileName, fileContent});
          });
        } else {
          /**
           * 不分片上传的时候整理出的数据如下：
           * {
           *  fileName: '123', // 文件名称
           *  fileContent: <Buffer ...>, // 文件的内容是一个Buffer数据
           * }
           */
          const { fileName, fileContent } = resultObject;
          storageFile(req, res, {fileName, fileContent});
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

// 连接mongodb数据库
function connectToMongoDB (data) {
  dbClient.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    mongoDb = dbClient.db(dbName);
  });
}
/**
 * 往数据库中插入内容
 * @param {Object} req request对象
 * @param {Object} res response对象
 * @param {Object} data 从请求体中整理出来的请求数据
 * @param {Object} callback 当处理成功的时候调用的回调函数，这里的回调函数是storageFile，作用是将文件存储到服务器的某个路径下
 */
function insertDocuments (req, res, data = {}, callback) {
  const { fileId, blockIndex, blockLength, blockContent, fileName  } = data;
  const collection = mongoDb.collection('documents');
  let storageData = { //整理好后存放在数据库中的内容
    fileId, // 文件的唯一标志符
    fileName // 文件名 
  };
  collection.findOne({ fileId }, (err, result) => {
    if (err) {
      throw new Error('MongoDB Error');
    } else {
      if (result) {
        // 如果该文件已经上传过，就更新数据中fileContent部分的内容
        // 存在数据库中的fileContent是数组格式，存放的是一个个分片，为什么不直接拼接呢，因为是并行发起请求的，可能index为1的片段会在index为2的片段之后请求完成
        let fileContent = result.fileContent;
        fileContent[blockIndex] = blockContent;
        // 数组的每个索引都存在值的时候，算是这个文件上传完毕了
        let fileUploadCompleted = fileContent.length === parseInt(blockLength) && fileContent.every((item) => item);
        if (fileUploadCompleted) {
          console.log('文件上传完毕')
          // 当文件的额所有块上传完毕的时候，将所有块的内容整合起来并保存，
          // TODO 同时将数据库中的fileContent参数变为fileUrl
          const totalContent = Buffer.concat(fileContent);
          let params = {
            fileName,
            fileContent: totalContent
          }
          callback(params);
        } else {
          console.log('文件没有上传完毕')
          // 如果文件的块没有上传完成，则将新的块存储到数据库中
          let uploadedIndexs = result.uploadedIndexs;
          uploadedIndexs.push(blockIndex);
          collection.updateOne({
            fileId
          },{
            $set: {
              fileContent
            }
          }, (err) => {
            if (err) {
              throw new Error('MongoDB Error');
            }
            res.setHeader('Accept-Ranges', 'bytes');
            res.writeHead(206, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
            let returnData = {
              fileId,
              uploadedIndexs
            };
            res.end(JSON.stringify(returnData));
          });
        }
      } else { // 如果该文件还没有上传过，就往数据库中插入一条数据
        // 要插入多条数据使用collection.insertMany([ {a : 1}, {a : 2}, {a : 3}], 回调函数)
        let fileContent = []; // 已经上传的文件内容
        let uploadedIndexs = []; // 已经上传成功了的索引值
        fileContent[blockIndex] = blockContent;
        uploadedIndexs.push(blockIndex);
        storageData.fileContent = fileContent;
        storageData.uploadedIndexs = uploadedIndexs;
        collection.insertOne(storageData, (err, result) => { // insertOne方法往数据库中插入一条数据
          assert.equal(err, null); // 校验err的值是否为null，不为null会抛出错误
          // callback(req, res, result);
          res.setHeader('Accept-Ranges', 'bytes');
          res.writeHead(206, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
          // let returnData = {
          //   fileId,
          //   uploadedIndexs
          // };
          let returnData = {
            status: '首次数据上传'
          };
          res.end(JSON.stringify(returnData));
        });
      }
    }
  })
}

/**
 * 将文件存储到服务器上，并返回一个文件路径
 * @param {Object} param0 
 */
function storageFile (req, res, {fileName, fileContent}) {
  const { headers } = req;
  const range = headers['range'];
  let fileUrls = [];
  fs.writeFile(`./upload/${fileName}`, fileContent, (err) => {
    if (err) {
      res.writeHead(500, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
      res.end(`上传失败，失败原因：${err}`);
    } else {
      let network = os.networkInterfaces(); // 通过os系统拿到网络信息
      const address = network.lo0[0].address; // 拿到当前服务器的ip地址
      fileUrls.push(`http://${address}:8080/upload/${fileName}`); // 将文件上传后的地址返回
      let fileUrlsObject = {
        fileUrls
      };
      let returnData = fileUrlsObject;
      if (range) {
        res.setHeader('Accept-Ranges', 'bytes');
        res.writeHead(206, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
        returnData.fileUploadCompleted = true;
        res.end(JSON.stringify(returnData));
      } else {
        res.writeHead(200, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
        // 这里将发送的参数以及文件上传后存放的路径返回
        res.end(JSON.stringify(returnData));
      }
    }
  });
}