let host = 'http://127.0.0.1:8080';
let selectedFile = null;
let appElement = null;
let fileElement = null;
let progressElement = null;
let percentContentElement = null;
let pauseButtonElement = null;
let isPaused = false; // 是否暂停
// let arrayBufferFile = null; // buffer格式的文件内容

window.onload = function () {
  appElement = document.getElementById('app');
  fileElement = document.getElementById('uploadFile');
  progressElement = document.getElementById('uploadProgress');
  percentContentElement = document.getElementById('percentContent');
  pauseButtonElement = document.getElementById('pauseButton');
  fileElement.onchange = function changeSelectedFile (val) {
    selectedFile = fileElement.files[0];
  }
};
function uploadFile (val) {
  // if (!selectedFile) {
  //   alert('请选择文件');
  //   return;
  // }
  console.log(selectedFile, '选中的文件');
  let fileName = selectedFile && selectedFile.name || '测试测试测试';
  let tenMillionBytes = 10 * 1024 * 1024; // 10M的数据量
  let fiftyMillionBytes = 50 * 1024 * 1024; // 50M的数据量
  let fiveHundredMillionBytes = 500 * 1024 * 1024; // 500M的数据量
  let blockSize = fiveHundredMillionBytes;
  let fileSize = selectedFile && selectedFile.size;
  if (fileSize < tenMillionBytes) { // 如果文件小于10M，就直接发送了，否则就使用分片上传
    let config = {
      'Content-Type': 'multipart/form-data'
    };
    let formData = new FormData();
    formData.set('fileName', fileName);
    formData.set('blockContent', selectedFile);
    let requestObj = {
      config,
      method: 'POST',
      url: `${host}/api/uploadfile`,
      data: formData,
      success: (data) => {
      },
      fail: (data) => {
        console.log(data); 
      }
    };
    ajax(requestObj);
  } else {
    let blockLength = Math.ceil(fileSize / blockSize);
      /**
     * 整理后的数据大致如下：
     * {
     *  fileId: '123test', // 文件的唯一标志符
     *  blockIndex: 1, // 文件分块的索引
     *  fileSize: 1200, // 总的文件大小，单位是byte
     *  blockLength: 12, // 文件分成了几块
     *  blockContent: <Buffer ...> // 文件分块的内容是一个Buffer数据
     * }
     */
    // 使用SHA-512算法生成一个标志文件的唯一hash字符串
    let shaObj = new jsSHA('SHA-512', 'TEXT');
    shaObj.update(selectedFile);
    let hash = shaObj.getHash('HEX');

    // 存放已上传的信息
    let uploadedFileInfo = {
      fileId: hash,
      uploadedIndexs: []
    };
    // 将文件分片进行上传
    for (let i = 0; i < blockLength; i++) {
      console.log(selectedFile, '选中的文件'); // 文件是Blob
      console.log(i * blockSize, (i + 1) * blockSize);
      let startSize = i * blockSize;
      let endSize = i === blockLength - 1 ? fileSize : (i + 1) * blockSize;
      let blockConent = selectedFile.slice(startSize, endSize);
      let blockIndex  = i;
      let formData = new FormData();
      formData.set('fileName', fileName);
      formData.set('fileId', hash);
      // formData.set('fileContent', selectedFile);
      formData.set('blockLength', blockLength);
      formData.set('blockIndex', blockIndex);
      formData.set('blockContent', blockConent);
      // 请求配置
      let config = {
        'Content-Type': 'multipart/form-data',
        'Range': `bytes=${startSize}-${endSize}`, // 表示可以使用部分请求，bytes是请求的内容的单位，0-blockSize是请求内容的范围
      }
      let requestObj = {
        config,
        method: 'POST',
        url: `${host}/api/uploadfile`,
        data: formData,
        success: (data) => {
          const { fileUploadCompleted, uploadedIndexs } = data;
          if (fileUploadCompleted) {
          } else {
            uploadedFileInfo.uploadedIndexs = uploadedIndexs;
          }
        },
        fail: (data) => {
          console.log(data); 
        }
      };
      ajax(requestObj);
    } 
  }
}
// 将分片文件伤处啊
function uploadBlock (start, end, formData) {

}
// 暂停上传和继续上传的切换
function togglePause () {
  let value = pauseButtonElement.value; // 这个值为1的时候表示是“暂停上传”按钮，为0的时候表示是“继续上传”按钮
  if (value === '1') {
    isPaused = true; // 将暂停状态置为true，表明目前是暂停状态
    pauseButtonElement.value = '0';
    pauseButtonElement.textContent = '继续上传';
  } else {
    isPaused = false;
    pauseButtonElement.value = '1';
    pauseButtonElement.textContent = '暂停上传';
    // TODO 在这里调起上传
  }
  // isPaused
  console.log(value, typeof value, '看看拿到的按钮的内容');
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
    xhr.open(method, url, true); 
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
      // console.log(data.get(''), '传递的数据参数');
      let contentType = config['Content-Type'];
      if (contentType && contentType === 'multipart/form-data') {
        console.log('看看发送的data是啥', data)
        return data;
      } else {
        return JSON.stringify(data);
      }
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
