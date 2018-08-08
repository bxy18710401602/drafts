let obj = {
  name: 'Unano'
};
console.log(obj.hasOwnProperty('name'));
console.log(obj.hasOwnProperty('toString'));
console.log('toString' in obj);