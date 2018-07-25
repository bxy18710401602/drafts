// 即使平行线程完成工作了，通知JS主线程执行回调函数了，回调函数也要等到JS主线程空闲时才能开始执行
let t = new Date()

function heavyCompute (n, callback) {
  console.log('aaa')
  let count = 0, i, j
  for (i = n; i > 0; --i) {
    for (j = n; j > 0; --j) {
      count +=1
    }
  }
  setTimeout(function () {
    console.log(new Date() - t)
  }, 1000)
}

heavyCompute(6000, function (count) {
  console.log(count)
})

console.log('hello')