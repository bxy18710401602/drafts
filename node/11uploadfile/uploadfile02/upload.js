let host = 'http://127.0.0.1:8080';
let selectedFile = null;
let appElement = null;
let fileElement = null;
let progressElement = null;
let percentContentElement = null;
let imagePreviewElement = null;
window.onload = function () {
  appElement = document.getElementById('app');
  fileElement = document.getElementById('uploadFile');
  progressElement = document.getElementById('uploadProgress');
  percentContentElement = document.getElementById('percentContent');
  imagePreviewElement = document.getElementById('imagePreview');
  fileElement.onchange = function changeSelectedFile (val) {
    selectedFile = fileElement.files[0];
    const { type } = selectedFile;
    switch (type) {
      case 'image/jpeg':  // 选中文件时候的图片预览
        let imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        let src = URL.createObjectURL(selectedFile);
        imgContainer.style = `background-image: url(${src})`;
        imagePreviewElement.appendChild(imgContainer);
        break;
    }
  }
};
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
    'Content-Type': 'multipart/form-data',
    'Range': 'bytes=0-1000', // 表示可以使用部分请求，bytes是请求的内容的单位，0-2000是请求内容的范围
  }
  let requestObj = {
    config,
    method: 'POST',
    url: `${host}/api/uploadfile`,
    data: formData,
    success: (data) => {
      if (data.fileUrls) {
        data.fileUrls.forEach((item) => {
          let imageContainer = document.createElement('div');
          imageContainer.className = 'img-container uploaded-image';
          imageContainer.style = `background-image: url(${item})`;
          appElement.appendChild(imageContainer);
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
    if (config) {
      setHeader(xhr, config);
    }
    xhr.open(method, url, true); // 当readyState变化的时候会执行
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
    // xhr.addEventListener('progress', onProgress, false);
    xhr.upload.addEventListener('progress', onProgress, false);
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
/**
 * 处理上传过程中遇到的问题
 * @param {Object} progressEvent 
 */
function onProgress (progressEvent) {
  const { lengthComputable, loaded, total } = progressEvent; // 以上三个属性分别表示进度是否可测，loaded表示已完成的部分，total表示总的工作量
  if (lengthComputable) {
    const percent = (loaded / total).toFixed(2); // 四舍五入保留小数点后两位
    const loadedContent = percent * 100;
    progressElement.value = loadedContent;
    percentContentElement.textContent = `${loadedContent}%`;
  }
}