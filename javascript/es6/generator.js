/*function *helloWorld () {
  // yield表达式能返回紧跟在语句后面的那个表达式的值
  // 每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行
  yield 1 + 2  // yield表达式如果放在另一个表达式中，必须在圆括号里面
  yield 'world'
  return 'ending'
}

let hw = helloWorld()

console.log(hw.next()) // 只有调用next时，helloWorld才会执行
console.log(hw.next())
console.log(hw.next())*/

function *gen(x) {
  let y = yield x + 2  // yield可以交出函数的执行权
  return y
}
let g = gen(1)
console.log(g.next())
console.log(g.next(2)) // 这个2是作为上一阶段异步任务的返回结果
console.log(g.next())

