
let date = +new Date();
async function b () {
  let arr = [1, 2, 3];
  arr.forEach(async (item) => {
    await a();
    date = +new Date();
    console.log(date, 'sss');
  });
}
b();
function a () {
  return new Promise((resolve, reject) => {
    setTimeout(()=> {
      resolve();
    }, 1000);
  })
}