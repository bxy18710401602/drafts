'use strict';

// 函数组件
function Welcome (props) {
  return <h1>Hello, {props.name}</h1>
}

function App () {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Jan" />
      <Welcome name="KangKang" />
    </div>
  );
}
// 使用ES6的class来定义组件

class Welcome01 extends React.Component {
  render () {
    return <h1>Hello, {this.props.name}</h1>
  }
}

// 当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）转换为单个对象传递给组件，这个对象被称之为 “props”

const element = <Welcome name="Sara" />;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
