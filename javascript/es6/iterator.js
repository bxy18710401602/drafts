/* // 创建迭代器
var it = makeIterator(['a', 'b'])

console.log(it.next())
console.log(it.next())
console.log(it.next())

function makeIterator (array) {
  let nextIndex = 0
  return {
    next: function () {
      return nextIndex < array.length ? { value: array[nextIndex++], done: false } :
      { value: undefined, done: true}
    }
  }
}
*/
/* // 一个数据结构，只要具有Symbol.iterator属性，就认为是可遍历的
const obj = {
  [Symbol.iterator]: function () {
    return {
      next: function () {
        return {
          value: 1, 
          done: true
        }
      }
    }
  }
}
*/

/*// Array，Map，Set，String，TypedArray，arguments对象，NodeList对象自带Iterator接口（Symbol.iterator）
let arr = ['a', 'b', 'c']
let iterator = arr[Symbol.iterator]()

console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
*/

// for of 
const arr = [1, 2, 3]
for (let num of arr) {
  console.log(num)
}

for (let item of arr.entries()) {
  console.log(item, 'entries方法')
}

for (let item of arr.keys()) {
  console.log(item, 'keys方法')
}

// 这里报错arr.values(...) is not a function or its return value is not iterable
/* for (let item of arr.values()) {
  console.log(item, 'values方法')
}
*/