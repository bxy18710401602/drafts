// const obj = {};
// Object.defineProperty(obj, 'propertyname', {
//     value: '测试',
//     wraitable: false
// });
// obj.propertyname = 1;
// console.log(obj.propertyname);
const obj = {};
Object.defineProperties(obj, {
    propertyname1: {
        value: 1,
        enumerable: true
    },
    propertyname2: {
        get () {
        	return this.propertyname1 + 1;
        }
    }
});
console.log(obj.propertyname2);