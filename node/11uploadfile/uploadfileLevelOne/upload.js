let host = 'http://127.0.0.1:8080';
let selectedFile = null;
let fileElement = null;
window.onload = function () {
  fileElement = document.getElementById('uploadFile');
  fileElement.onchange = function changeSelectedFile (val) {
    selectedFile = fileElement.files[0];
  }
};
function uploadFile (val) {
  // if (!selectedFile) {
  //   alert('请选择文件');
  //   return;
  // }
  // let formData = new FormData();
  // formData.set('upload_file', selectedFile);
  // formData.set('test', '测试测试');
  let formData = {
    test: '测试测试'
  };
  let formDataStr = 'test=测试测试';
  // 请求配置
  let config = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
  let requestObj = {
    config,
    method: 'POST',
    url: `${host}/api/uploadfile`,
    // data: encodeURIComponent(formDataStr),
    data: formDataStr,
    success: (data) => {
      console.log('请求成功的函数执行了')
      console.log(data); 
    },
    fail: (data) => {
      console.log('请求失败的函数执行了')
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
    let paramsStrArray = [];
    for (let key in data) {
      let item = `${key}=${data[key]}`;
      paramsStrArray.push(item);
    }
    let paramsStr = paramsStrArray.join('&');
    url = url.indexOf('?') > -1 ? `${url}${paramsStr}` : `${url}?${paramsStr}`;
    if (config) {
      setHeader(xhr, config);
    }
    xhr.open(method, url, true); // 当readyState变化的时候会执行
    xhr.onreadystatechange = () => { // 当readyState变化的时候会执行
      if (xhr.readyState === XMLHttpRequest.DONE) { // 下载状态为DONE表示请求已完成
        if (xhr.status === 200) {
          success(xhr.responseText); // responseText 返回请求的响应
        } else {
          fail(xhr.responseText);
        }
      }
    };
    xhr.send();
  }
  if (method === 'POST') { // POST请求，数据在body请求体中
    xhr.open(method, url, true); // 初始化一个请求，open方法的第三个参数为true，表示异步执行
    if (config) {
      setHeader(xhr, config);
    }
    xhr.onreadystatechange = () => { // 当readyState变化的时候会执行
      if (xhr.readyState === XMLHttpRequest.DONE) { // 下载状态为DONE表示请求已完成
        if (xhr.status === 200) {
          success(xhr.responseText); // responseText 返回请求的响应
        } else {
          fail(xhr.responseText);
        }
      }
    };
    xhr.send(data); // POST方法的数据通过send方法传送
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
