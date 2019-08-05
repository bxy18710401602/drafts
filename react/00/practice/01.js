'use strict';

function formatName (user) {
  if (user) {
    return `${user.firstName} ${user.lastName}`;
  } else {
    return `Hello, Stranger.`
  }
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez',
  avatorUrl: 'https://www.baidu.com'
};

const test = 'test';
const element1 = <div tabIndex="0">第一条</div>;
const element2 = <img src={user.avatorUrl}></img>; // 对于同一属性，不能同时使用"" 和 {}
const element3 = <h1>{test}, {formatName(user)}</h1>; // JSX，变量的引用，函数的引用

// 可以使用括号在标签中包含很多子元素，但是在括号里面整体只能包含一个元素（待了解详情）
const element = ( 
  <div>
    <div tabIndex="0">第一条</div>
    <img src={user.avatorUrl}></img> // 对于同一属性，不能同时使用"" 和 {}
    <h1>{test}, {formatName(user)}</h1> // JSX，变量的引用，函数的引用
  </div>
);


const element4 = (
  <h1 className="greeting">
    Hello World!
  </h1>
);

const element5 = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello World!'
);
// Babel会把JSX转换为一个React.createElement()函数调用，所以element4和element5是等效的

// 想要将一个React元素传入到根DOM节点中，需要将它们传入ReactDOM.render
ReactDOM.render(
  element, // React元素
  document.getElementById('root') // 根DOM节点
);

// React 元素是不可变的，更新UI的唯一方式是创建一个全新的元素，并将其传入ReactDOM.render
// React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新来使DOM达到预期状态



