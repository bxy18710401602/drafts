/**
 * Hook是React16.8的新增特性，它可以让你在不编写class的情况下使用state以及其他的React特性
 */
// 显示一个计数器，当你点击按钮，计数器的值就会增加
import React, { useState } from 'react';

function Example() {
  // 声明一个叫"count"的state变量，在这里useState就是一个hook
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
