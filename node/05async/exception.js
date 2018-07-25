function async (fn, callback) {
  // return fn()
  setTimeout(function () {
    try {
      callback(null, fn())
    } catch (err) {
      callback(err)
    }
  }, 0) // 异步函数执行过程中没有遇到try语句，异常直接抛出
}
async(null, function (err, data) {
  if (err) {
    console.log('错误：', err.message)
  } else {
  }
}) 
// try {
//   sync(null, function (data) {

//   })
// } catch (err) {
//   console.log('错误：', err.message)
// }