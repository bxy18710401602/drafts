import React, { useState, useEffect } from 'react';

function Example () {
  const [count, setCount] = useState(0);

  // 相当于componentDidMount和componentDidUpdate
  // React会在每次渲染后调用“副作用”函数
  useEffect(() => {
    // 使用浏览器的API更新页面标题
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}