/* 数组的交并差集
let arr1 = [1, 2];
let arr2 = [2, 2, 6];

let unionSet = new Set([...arr1, ...arr2]);
let unionArray = Array.from(unionSet);
console.log(unionArray);

let intersectionSet = new Set([...arr1].filter(x => arr2.indexOf(x) > -1));
let intersectionArray = Array.from(intersectionSet);
console.log(intersectionArray);

let differenceSet = unionArray.filter(item => intersectionArray.indexOf(item) === -1);
console.log(differenceSet);
*/
/* find方法
let arr = [
  {
    name: '测试',
    id: 1
  },
  {
    name: '测试1',
    id: 2
  },
  {
    name: '测试2',
    id: 3
  }
];

let test = arr.find(item => {
  return item.id > 1;
});
console.log(test);
 */

var arr2 = [
  { name: "A", num: "1" },
  { name: "B", num: "11" },
  { name: "B", num: "12" },
  { name: "C", num: "13" },
  { name: "D", num: "1" },
  { name: "D", num: "12" }
]
function arrayUnique2(arr, name) {
  var hash = {};
  return arr.reduce(function (item, next) {
    // hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
    hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
    return item;
  }, []);
};
console.log(arrayUnique2(arr2, "name"));
console.log(arrayUnique2(arr2, "num"));