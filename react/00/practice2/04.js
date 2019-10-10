// 在项目中可以使用 import { useState } from 'react'; 引入useState
// 因为在浏览器中会将import转换为require，于是会报错require is not defined，所以使用下面这个句子引入useState
let useState = React.useState; 
let useEffect = React.useEffect; 

function Example() {
  // 声明一个叫 “count” 的 state 变量，可以通过setCount改变变量的值，且变量的初始值是0
  const [count, setCount] = useState(0);
  let timer = null;
  timer = setTimeout(() => {},  500)
  useEffect(() => {
    // 更新文档的title
    document.title = '123';
    // 在useEffect中返回一个函数，这个函数会在组件清除的时候执行
    return () => {
      document.title = `测试测试测试`;
      clearTimeout(timer)
      console.log(timer)
    }
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      {/* 使用hook可以直接使用count和setCount来获取和设置count变量的值，而不用像在类里那样使用this.state.count和this.setState */}
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
ReactDOM.render(
  <Example />,
  document.getElementById('root')
);
