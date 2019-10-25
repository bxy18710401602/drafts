// 这个服务器只包含大文件分片上传的情况，默认就是使用分片上传，所以没有对各个请求情况做区分
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const os = require('os');
let serverPort = 8080;

let mongoDB = null; // 声明一个变量，代表数据库
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'practice';
const dbClient = new MongoClient(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const server = http.createServer();

server.on('request', (req, res) => {
  const { url: requestUrl, method } = req;
  let parsedUrl = url.parse(requestUrl);
  let pathName = parsedUrl.pathname;
  let interfacePattern = /^\/api/;
  if (interfacePattern.test(pathName)) { // 以api打头的是接口请求
    handlePostRequest(parsedUrl, req, res);
  } else { // 否则是资源请求
    requestResource(parsedUrl, req, res);
  }
});

server.listen(serverPort, () => {
  console.log(`server is running at http://127.0.0.1:8080`);
  // 连接mongoDB数据库
  dbClient.connect((err) => {
    assert.equal(null, err);
    mongoDB = dbClient.db(dbName);
    console.log('mongodb connected successed');
  });
});

// POST请求的处理方式，这部分代码中只包含文件分片上传的处理
function handlePostRequest (parsedUrl, req, res) {
  req.on('error', (err) => {
    let returnObj = {
      msg: '请求失败'
    };
    res.end(JSON.stringify(returnObj));
  });

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  });
  req.on('end', () => {
    body = Buffer.concat(body);
    let formattedData = formatData(body);
    storageFile(formattedData, res);
  });
}

// 将Content-Type为multipart/form-data情况下的数据整理成一个对象
function formatData (buffer) {
  let firstWrapIndex = buffer.indexOf('\r\n');
  let signifier = buffer.slice(0, firstWrapIndex);
  let signifierIndex = buffer.indexOf(signifier);
  let formattedData = {}; // 存放整理出来的对象
  while (signifierIndex !== -1) {
    let blockItem = buffer.slice(0, signifierIndex);
    if (Boolean(blockItem[0])) { // 这里判断blockItem是否包含内容，如果没包含内容的话，buffer索引位置为0的地方就是假值，这样就避免了将整个blockItem块都转换为字符串之后进行判断
      let { name, value } = formatBuffer(blockItem);
      formattedData[name] = value;
    }
    buffer = buffer.slice(signifierIndex + signifier.length);
    signifierIndex = buffer.indexOf(signifier);
  }
  return formattedData;
}
// 整理请求体中的每一段二进制数据
function formatBuffer (bufferItem) {
  let firstIndex = bufferItem.indexOf('\r\n') + 2;
  let lastIndex = bufferItem.lastIndexOf('\r\n');
  let content = bufferItem.slice(firstIndex, lastIndex); // 去掉首部和尾部的\r\n
  let centerWrapIndex = content.indexOf('\r\n\r\n');
  let description = content.slice(0, centerWrapIndex).toString(); // 请求头的描述部分的buffer
  let value = content.slice(centerWrapIndex + 4);
  let { name } = formatDescription(description);
  if (name !== 'blockContent') { // 当请求的参数名称不为blockContent的时候表示不是分片，将请求内容转换为字符串
    value = value.toString();
  }
  return {
    name,
    value
  };
}
// 将拿到的description整理成对象
function formatDescription (description) {
  let arr = description.split('\r\n');
  let obj = {};
  arr.forEach((item) => {
    if (item) {
      let arr = item.split(': '); // 请求头的名称和请求头的内容以：分隔
      let propertyValue = arr[1];
      let valueArr = propertyValue.split('; ');
      valueArr.forEach((item) => {
        let equalIndex = item.indexOf('=');
        if (equalIndex !== -1) {
          let arr = item.split('=');
          let key = arr[0];
          let value = arr[1].slice(1, -1); // 去掉首尾的"
          obj[key] = value;
        }
      });
    }
  });
  return obj;
}
// 将文件写入文件目录下，并返回一个地址
function storageFile (formattedData, res) {
  const collection = mongoDB.collection('documents');
  let { fileId, fileName, blockContent, blockIndex,  blockLength } = formattedData;
  let storageData = {
    fileId,
    fileName,
    blockLength,
    blockIndex
  };
  if (parseInt(blockLength) === 1) { // 文件只有一片的情况的处理
    fs.writeFile(`./upload/${fileName}`, blockContent, (err) => {
      if (err) {
        res.writeHead(200, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
        res.end(`上传失败，失败原因：${err}`);
      } else {
        let network = os.networkInterfaces(); // 通过os系统拿到网络信息
        const address = network.lo0[0].address; // 拿到当前服务器的ip地址
        let fileUrl = `http://${address}:8080/upload/${fileName}`;// 将文件上传后的地址返回
        storageData.fileUrl = fileUrl;
        let returnObj = {
          fileUrl,
          msg: '文件分片只有一片，已上传完成'
        };
        insertData(collection, storageData, res);
        res.setHeader('Accept-Ranges', 'bytes');
        res.writeHead(200, {'Content-Type': `multipart/form-data;charset=utf-8`}); // 设置响应头
        // 这里将发送的参数以及文件上传后存放的路径返回
        res.end(JSON.stringify(returnObj));
      }
    });
  } else {
    fs.writeFile(`./upload/${fileName}.${blockIndex}`, blockContent, (err) => {
      if (err) {
        let returnObj = {
          msg: '上传失败'
        };
        res.end(JSON.stringify(returnObj));
      } else {
        let fileUrl = `./upload/${fileName}.${blockIndex}`;
        storageData.blockFileUrl = fileUrl;
        storageUploadInfo(storageData, res);
      }
    });
  }
}
// 请求资源
function requestResource (parsedUrl, req, res) {
  let pathname = parsedUrl.pathname;
  let filePath = pathname.substr(1); // 去掉路径前的/
  filePath = filePath === '' ? 'index.html' : filePath;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 可以看看这里返回的错误的格式是什么
      console.log(`在读取文件的的时候报错了，${err}`);
    } else {
      const suffix = path.extname(filePath).substr(1); // 拿到文件的后缀名
      let stream = fs.createReadStream(filePath);
      let responseData = []; // 存储文件流
      if (stream) {
        stream.on('data', (chunk) => {
          responseData.push(chunk);
        });
        stream.on('end', () => {
          let total = Buffer.concat(responseData);
          res.writeHead(200, {'Content-Type': `text/${suffix}`});
          res.write(total);
          res.end();
        });
      }
    }
  });
}

// 将上传的文件信息存入数据库
function storageUploadInfo (data, res) {
  /* 存入数据库的内容大致是这样的
  {
    fileId: '1231414aa', // 通过加密生成的代表文件的唯一hash字符串
    fileName: 'test.jpg', // 文件的名称
    uploadedIndexs: {}, // 已经上传的文件的分片的索引
    uploadedFilesUrls: [], // 已经上传的分片存放的地址
    blockLength: 5, // 块的总长度
    fileUrl: 'http://127.0.0.1:8080/upload/test.jpg' // 所有分片上传完成后将文件整合后会得到这个url地址
  }
  */
  const { fileId, fileName, blockIndex, blockFileUrl, blockLength} = data;
  const collection = mongoDB.collection('documents');
  let storageData = {
    fileId,
    fileName,
    blockLength,
    fileUrl: ''
  };
  collection.findOne({ fileId }, (err, result) => {
    if (err) {
      throw new Error('MongoDB Error');
    } else {
      if (result) { // 如果文件已经上传过分片了，就更改内容
        let { uploadedFilesUrls, uploadedIndexs, fileUrl } = result;
        if (fileUrl) { // 如果文件整个都上传完毕了，就返回
          let returnObj = {
            msg: '此文件已经上传过了',
            fileUrl
          }
          res.end(JSON.stringify(returnObj));
          return;
        }
        uploadedFilesUrls[blockIndex] = blockFileUrl;
        uploadedIndexs[blockIndex] = true;
        storageData.uploadedFilesUrls = uploadedFilesUrls;
        storageData.uploadedIndexs = uploadedIndexs;
        let fileUploadCompleted = Object.keys(uploadedIndexs).length === parseInt(blockLength);
        if (fileUploadCompleted) { // 文件分片全部上传完毕了
          console.log('执行到这里了吗?');
          // 将所有文件分片整合成一个打的文件，并设置这条数据的fileUrl
          let blockFileUrls = uploadedFilesUrls.slice(0); // 将文件的分片路径存储起来
          let writeStream = fs.createWriteStream(`./upload/${fileName}`);
          let readStream;
          writeFile();
          function writeFile () {
            console.log(uploadedFilesUrls.length, !uploadedFilesUrls.length, '看看值uploadedFilesUrls.length');
            if (!uploadedFilesUrls.length) {
              console.log('文件上传完成的处理');
              writeStream.end();
              let network = os.networkInterfaces(); // 通过os系统拿到的网络信息
              const address = network.lo0[0].address; // 拿到当前服务器的ip地址
              const fileUrl = `http://${address}:${serverPort}/upload/${fileName}`; // 文件上传之后存放的地址
              storageData.fileUrl = fileUrl;
              updateData(collection, storageData, res);
              blockFileUrls.forEach((item) => {
                fs.unlink(item, (err) => {
                  if (err) throw err;
                  console.log('删除分片文件');
                });
              });
              let returnObject = {
                msg: '文件上传完成',
                fileUrl
              };
              console.log('删除分片文件的处理');
              res.end(JSON.stringify(returnObject));
              return;
            }
            let currentFileUrl = uploadedFilesUrls.shift();
            readStream = fs.createReadStream(currentFileUrl);
            readStream.pipe(writeStream, { end: false });
            readStream.on('end', () => {
              writeFile();
            });
          }
        } else { // 文件分片没有上传完毕的时候只是存储
          updateData(collection, storageData, res);
        }
      } else { // 如果文件没有上传过，就插入一条数据
        let uploadedFilesUrls = [];
        let uploadedIndexs = {};
        uploadedFilesUrls[blockIndex] = blockFileUrl;
        uploadedIndexs[blockIndex] = true;
        storageData.uploadedFilesUrls = uploadedFilesUrls;
        storageData.uploadedIndexs = uploadedIndexs;
        insertData(collection, storageData, res);
      }
    }
  });
}

// 往数据库中插入数据
function insertData (collection, storageData, res) {
  collection.insertOne(storageData, (err, result) => {
    assert.equal(err, null); // 校验err的值是否为null，不为null会抛出错误
    let returnData = {
      msg: '首次数据上传'
    };
    res.end(JSON.stringify(returnData));
  });
}

// 更新数据库中的数据
function updateData (collection, storageData, res) {
  const { fileId } = storageData;
  collection.updateOne({ fileId }, { $set: storageData }, (err) => {
    if (err) {
      throw new Error('MongoDB Error');
    }
    let returnData = {
      fileId,
      msg: '保存分片的内容'
    };
    res.end(JSON.stringify(returnData));
  });
}

// 将分片合并成文件
function combineBlocksIntoFile () {

}