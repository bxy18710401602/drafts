/**
 * 深入JSX
 * 实际上，JSX仅仅是React.createElement(component, props, ...children)函数的语法糖
 */

 <MyButton color="blue" shadowSize={2}>
   Click Me
 </MyButton>

// 会编译为
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
);

// 如果没有子节点，还可以使用自闭合的标签形式
<div className="sidebar"/>
// 会编译为
React.createElement(
  'div',
  {className: 'sidebar'},
  null
);
// 当在一个模块中到处许多React组件的时候，使用点语法非常方便
const MyComponents = {
  DatePicker: function DatePicker (props) {
    return <div>Imagine a {props.color} datepicker here.</div>
  }
}

function BlueDatePicker () {
  return <MyComponents.DatePicker color="blue" />;
}

// 用户定义的组件必须以大写字母开头
// 以小写字母开头的元素代表一个HTML的内置组件，大写字母开头的元素则对应在JavaScript引入或者自定义的组件

// 以下代码无法按照预期运行
import React from 'react';

// 错误，组件应该以大写字母开头
function hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld () {
  // React会认为<hello />是一个HTML标签，因为它没有以大写字母开头
  return <hello toWhat="World" />
}
// 要解决这个问题，只需要把hello改成Hello就可以了

// 在运行时选择类型
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 错误！JSX类型不能是一个表达式
  // return <components[props.storyType] story={props.story} />;
}

// 要解决这个问题，首先将类型赋值给一个大写字母开头的变量
function Story (props) {
  // 正确！JSX类型可以是大写字母开头的变量
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story}/>;
}

// 在JSX中指定props
<MyComponent foo={1 + 2 + 3} />
// 在MyComponent中。props.foo的值等于6
// if和for循环不是JS表达式，不能在JSX中直接使用，但是可以在JSX之外的地方使用

function NumberDescriber (props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}


<div>
  {/* 以下两个表达式是等价的 */}
  <MyComponent message="hello world" />
  <MyComponent message={'hello world'} />

  {/* 以下两个表达式是等价的 */}
  <MyComponent message="&lt;3" />
  <MyComponent message={'<3'} />

  {/* prop值默认为true */}
  {/* 不建议这样使用，因为它可能与ES6对象简写混淆 */}
  <MyTextBox autocomplete />
  <MyTextBox autocomplete={true} />
</div>

// 属性展开， 如果你已经有了一个props对象，可以使用...在JSX中传递整个props对象
// 以下两个组件是等价的
function App1 () {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2 () {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}

// 还可以选择只保留当前组件需要接收的props
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};

// JSX中的子元素
<MyComponent>Hello world!</MyComponent>
// MyComponent中的props.children是一个未转义的字符串“Hello world！”
{/* <div>This is valid HTML &amp; JSX at the same time.</div> */}

// JSX会移除行首尾的空格以及空行。所以以下几种方式都是等价的。
{/*
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
*/}

// JSX子元素，子元素允许由多个JSX元素组成
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>

// 可以将不同类型的子元素混合在一起，可以将字符串字面量与JSX子元素一起使用。
{/* <div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div> */}

// React 组件也能够返回存储在数组中的一组元素
// render () {
//   return [
//     // 不要忘记设置key
//     <li key="A">First item.</li>
//     <li key="B">Second item.</li>
//     <li key="C">Third item.</li>
//   ];
// }

// JavaScript可以被包裹在{}中作为子元素，以下表达式是等价的
{/* <MyComponent>foo</MyComponent>
<MyComponent>{'foo'}</MyComponent> */}

function Item (props) {
  return <li>{props.message}</li>
}

function TodoList () {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message}/>)}
    </ul>
  );
}

// JS表达式可以和其他类型的子元素组合
function Hello (props) {
  return <div>Hello {props.addressee}!</div>
}

// 通常JSX中的JavaScript表达式会被计算为字符串，React元素或者是列表
// 不过 props.children和其他的prop一样，可以传递任意类型的数据
function Repeat (props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings () {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list.</div>}
    </Repeat>
  );
}

// 布尔类型，null以及undefined是合法的子元素，但它们并不会被渲染
// 以下JSX表达式的渲染结果相同
{/* <div />
<div></div>
<div>{false}</div>
<div>{null}</div>
<div>{undefined}</div>
<div>{true}</div> */}

// 这有助于依据特定条件来渲染其他的React元素，例如：
<div>
  {showHeader && <Header />}
  <Content />
</div>

// 想要渲染这些值的时候需要将它们转换为字符串
