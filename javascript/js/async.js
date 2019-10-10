/*function getSomething () {
  return "something";
}

async function testAsync () {
  return Promise.resolve('hello async');
}

async function test() {
  const v1 = await getSomething()
  const v2 = await testAsync()
  console.log(v1, v2)
}

test();*/


async function async1() {
  console.log( 'async1 start' )
  await async2()
  console.log( 'async1 end' )
}

async function async2() {
  console.log( 'async2' )
}

console.log( 'script start' )

setTimeout( function () {
  console.log( 'setTimeout' )
}, 0 )

async1();

new Promise( function ( resolve ) {
  console.log( 'promise1' )
  resolve();
} ).then( function () {
  console.log( 'promise2' )
} )

console.log( 'script end' )