// 1
// setTimeout(function () {
//   console.log('a')
//   setTimeout(function () {
//     console.log('b')
//     setTimeout(function () {
//       console.log('c')
//     }, 100)
//   }, 500)
// }, 1000)

// 2 用nimble进行串行化控制
let flow = require('nimble')

flow.series([
  function (callback) {
    setTimeout (function () {
      console.log('a')
      callback()
    }, 1000) 
  },
  function (callback) {
    setTimeout(function () {
      console.log('b')
      callback()
    }, 500)
  },
  function (callback) {
    setTimeout(function () {
      console.log('c')
      callback()
    }, 100)
  }
])