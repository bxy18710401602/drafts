function timeout (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function asyncPrint (value, ms) {
  await timeout(ms)
  console.log(value)
}

asyncPrint('hello world', 3000)

// 测试能否用async
async function test () {
  let data = await A();
  console.log(data, 'data');
}
test().catch(e => { console.log(e, 'error'); });
function A () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('aaa');
    }, 1000);
    setTimeout(() => {
      return reject('bbb');
    }, 500)
  });
}

async function test () {
  let arr = [1, 2, 3];
  for (let i = 0; i < 3; i++) {
    let aaa = await a();
    console.log(aaa);
  }
}
test();

function a () {
  return new Promise ((resolve, reject) => {
    setTimeout(() => {
      resolve('aaa');
    }, 1000);
  });
}