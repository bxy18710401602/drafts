let host = 'http://127.0.0.1:8080';
let selectedFile = null;
let appElement = null;
let fileElement = null;
window.onload = function () {
  appElement = document.getElementById('app');
  fileElement = document.getElementById('uploadFile');
  fileElement.onchange = function changeSelectedFile (val) {
    selectedFile = fileElement.files[0];
  }
};
let testFormData = {
  a: '测试测试',
  b: {
    b1: '测测测',
    b2: '测试测试',
    b3: {
      b3_1: 123
    }
  },
  c: 'ccc'
};
function getRequest () {
  let formData = testFormData;
  // 请求配置
  let config = {
    'Content-Type': 'text/plain;charset=utf-8'
  }
  let requestObj = {
    config, // 请求头的自定义配置
    method: 'GET', // 请求的方法
    url: `${host}/api/uploadfile`, // 请求的路径
    data: formData, // 传送的数据
    success: (data) => { // 请求成功的回调函数
      console.log(data); 
    },
    fail: (data) => { // 请求失败的回调函数
      console.log(data);
    }
  };
  ajax(requestObj);
}

function postRequest () {
  let formData = testFormData;
  // 请求配置
  let config = {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    'Content-Type': 'application/json;charset=utf-8' // 这里我选择使用application/json的媒体类型发起post请求，这样在浏览器的formdata部分能够比较直观地展示请求的数据，并且对数据的处理也较为简单
  }
  let requestObj = {
    config,
    method: 'POST',
    url: `${host}/api/uploadfile`,
    data: formData,
    success: (data) => {
      console.log(data); 
    },
    fail: (data) => {
      console.log(data); 
    }
  };
  ajax(requestObj);
}
function uploadFile (val) {
  if (!selectedFile) {
    alert('请选择文件');
    return;
  }
  let formData = new FormData();
  formData.set('upload_file', selectedFile);
  formData.set('test01', '测试测试1');
  formData.set('test02', '测试测试测试2');
  // 请求配置
  let config = {
    'Content-Type': 'multipart/form-data'
  }
  let requestObj = {
    config,
    method: 'POST',
    url: `${host}/api/uploadfile`,
    data: formData,
    success: (data) => {
      console.log(typeof data, '看看返回值的类型是什么');
      console.log(data.fileUrls, '看看拿到的值')
      if (data.fileUrls) {
        console.log('看看')
        data.fileUrls.forEach((item) => {
          let image = document.createElement('img');
          image.src = item;
          appElement.appendChild(image);
        });
      }
    },
    fail: (data) => {
      console.log(data); 
    }
  };
  ajax(requestObj);
}
/**
 * 封装的异步请求方法
 * @param {Object} requestObj 请求对象 
 * 其中包含config、url、method、data、success、fail表示请求配置，请求地址，请求方法，和请求的参数，请求成功的回调参数以及请求失败的回调参数
 */
function ajax(requestObj) {
  let { url, method, data, success, fail, config } = requestObj;
  const xhr = new XMLHttpRequest(); // 创建一个XMLHttpRequest实例
  if (method === 'GET') { // GET请求，参数在url上
    let paramsStr = formatData(data, method);
    url = url.indexOf('?') > -1 ? `${url}${paramsStr}` : `${url}?${paramsStr}`;
    xhr.open(method, url, true); // 当readyState变化的时候会执行
    if (config) {
      setHeader(xhr, config);
    }
    xhr.onreadystatechange = () => { // 当readyState变化的时候会执行
      if (xhr.readyState === XMLHttpRequest.DONE) { // 下载状态为DONE表示请求已完成
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText)); // responseText 返回请求的响应
        } else {
          fail(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.send();
  }
  if (method === 'POST') { // POST请求，数据在body请求体中
    let paramsStr = formatData(data, method, config);
    xhr.open(method, url, true); // 初始化一个请求，open方法的第三个参数为true，表示异步执行
    if (config) {
      setHeader(xhr, config);
    }
    xhr.onreadystatechange = () => { // 当readyState变化的时候会执行
      if (xhr.readyState === XMLHttpRequest.DONE) { // 下载状态为DONE表示请求已完成
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText)); // responseText 返回请求的响应
        } else {
          fail(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.send(paramsStr); // POST方法的数据通过send方法传送
  }
}
/**
 * 封装的trim方法，用于去掉字符串首尾的空格
 */
function trim (str) {
  return str.replace(/(^\s)|(\s$)/, '')
}
/**
 * 设置请求头的方法
 * @param {Object} xhr XMLHttpRequest对象的实例
 * @param {Object} config
 */
function setHeader (xhr, config) {
  for (let key in config) {
    xhr.setRequestHeader(key, config[key]); // 设置请求头    
  }
}
/**
 * 将传递的参数转换为字符串
 * @param {Object} data 要传递的数据
 */
function formatData (data, method, config) {
  switch (method) {
    case 'GET':
      let dataArray = [];
      for (let key in data) {
        let value = JSON.stringify(data[key]);
        let item = `${encodeURIComponent(`${key}=${value}`)}`;
        dataArray.push(item);
      }
      return dataArray.join('&');
    case 'POST':
      let contentType = config['Content-Type'];
      if (contentType && contentType === 'multipart/form-data') {
        return data;
      }
      return JSON.stringify(data);
  }
}
// 测试async await
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  var result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: 'resolved'
}

asyncCall();

