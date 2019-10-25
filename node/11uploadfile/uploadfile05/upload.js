let host = `http://127.0.0.1:8080`;
let selectedFile = null; // 选中的文件
let fileElement = null; // 文件元素

window.onload = () => {
  fileElement = document.getElementById('uploadFile');
  fileElement.onchange = function changeSelectedFile () {
    selectedFile = fileElement.files[0];
  }
};

// 上传文件
function uploadFile () {
  if (!selectedFile) {
    alert('请选择文件');
  }
  const { name: fileName, size: fileSize } = selectedFile;
  let tenMillionBytes = 10 * 1024 * 1024;
  let fiveHundredMillionBytes = 500 * 1024 * 1024;
  let blockSize = fiveHundredMillionBytes; // 设置分片大小
  let blockLength = Math.ceil(fileSize / blockSize);
  // 使用SHA-512算法生成一个标志文件的唯一hash字符串
  let shaObj = new jsSHA('SHA-512', 'BYTES');
  shaObj.update(selectedFile);
  let hash = shaObj.getHash('HEX');
  console.log(selectedFile, '选中的文件');
  console.log(hash, '看看hash的值');
  let formData = new FormData();
  formData.set('fileId', hash); // 文件的唯一标志符
  formData.set('fileName', fileName); // 文件名称
  formData.set('blockLength', blockLength); // 文件分成了几块

  // 将问片分片进行上传
  for (let i = 0; i < blockLength; i++) {
    let startSize = i * blockSize;
    let endSize = i === blockLength - 1 ? fileSize : (i + 1) * blockSize;
    let blockContent = selectedFile.slice(startSize, endSize);
    formData.set('blockIndex', i); // 文件分块的索引
    formData.set('blockContent', blockContent); // 文件分块的内容是一个blob数据
    // 请求配置
    let config = {
      'Content-Type': 'multipart/form-data',
      'Range': `bytes=${startSize}-${endSize}`
    };
    let requestObj = {
      config,
      method: 'POST',
      url: `${host}/api/uploadfile`,
      data: formData,
      success: (data) => {
        console.log(data)
      },
      fail: (err) => {
        console.log(err)
      }
    };
    postRequest(requestObj);
  }
}

/**
 * Content-Type为'multipart/form-data'的post请求的处理
 * @param {*} requestObj 
 */
function postRequest (requestObj) {
  const xhr = new XMLHttpRequest();
  const { config, url, method, data, success, fail } = requestObj;
  xhr.open(method, url, true);
  if (config) {
    setHeader(xhr, config);
  }
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status < 300) {
        success(JSON.parse(xhr.responseText));
      } else {
        fail(JSON.parse(xhr.responseText));
      }
    }
  };
  xhr.send(data);
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
