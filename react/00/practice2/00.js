/**
 * Hook是React16.8的新增特性，它可以让你在不编写class的情况下使用state以及其他的React特性
 */
// 显示一个计数器，当你点击按钮，计数器的值就会增加
// import React, { useState } from 'react';
// 因为在浏览器中会将import转换为require，于是会报错require is not defined，所以使用下面这个句子引入useState
console.log(React, '看看React值')
let useState = React.useState; 
let useEffect = React.useEffect; 
let container = document.getElementById('root');

// Example是一个函数组件
function Example() {
  // 声明一个叫"count"的state变量，在这里useState就是一个hook
  // useState与this.state的功能是一样的，useState里的唯一参数是初始state
  // useState的返回值为当前state以及更新state的函数
  // 定义了一个变量count，count的初始值为0
  // 如果想要使用多个state变量，它允许我们给不同的state变量取不同的名称
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState('banana')
  const [todos, setTodos] = useState([{ text: '学习Hook' }])

  // 调用useEffect就是在告诉React在完成对DOM的更改后运行你的副作用函数
  // 默认情况下，React会在每次渲染之后调用副作用函数，包括第一次渲染
  // useEffect 是一个Effect Hook，给组件增加了操作副作用的能力
  // 它和class中的componentDidMount、componentDidUpdate和componentWillUnmount具有相同的用途，只不过合并成了一个API
  // React保证每次运行effect的同时,DOM都已经更新完毕
  // 就像可以使用多个state的hook一样，也可以使用多个effect
  useEffect(() => {
    // 使用浏览器的API更新页面标题
    document.title = `You clicked ${count} times`;
    // 每个effect都可以返回一个清除函数，React会在组件卸载的时候执行清除操作
    // 如果effect返回一个函数，React会在执行清除操作时调用它
    // 副作用函数还可以通过返回一个函数来指定如何“清除”副作用
    // 一些effect需要清除，其他不需要清除，就不需要返回函数
    return () => {
      // 比如清除定时器
    }
  });
  useEffect(() => {
    // 和上一个effect要实现的功能不同的effect
  });
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // 仅在count更改时更新
  // 对于清除操作的effect页同样适用
  useEffect(() => {
    function handleStatusChange (status) {
      setInsOnline (status.isOnline)
    }
    doSomthing ()
    return () => {
      clearSomething()
    }
  }, [props.friend.id]); // 仅在props.friend.id变化的时候重新订阅

  /*
  使用 Hook 其中一个目的就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。
  */
 
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

ReactDOM.render(<Example />, container);
