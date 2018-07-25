let  arr = [1, 2, 3],
     len = arr.length,
     i = 0

// 保证循环结束后所有数组成员都处理完毕
(function next(i, len, callback){
  if (i < len) {
    // 代表异步执行的函数
    async(arr[i], function (value) {
      arr[i] = value
      next(i+1, len, callback)
    })
  } else {
    callback(arr[i])
  }
}(0, arr.length, function (num) {
  console.log(num)
  // All array items have processed.
}))
