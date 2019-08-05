'use strict';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

const e = React.createElement;
class LikeButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = { liked: false };
  }

  render () {
    if (this.state.liked) {
      return 'You liked this.'
    }
    // return e(
    //   'button',
    //   { onClick: () => this.setState({ liked: true }) },
    //   'Like'
    // );

    // 也可以使用JSX
    return (
      <button onClick={ () => this.setState({ liked: true }) }>
        Like
      </button>
    );
  }
}

const domContainer = document.getElementById('like_button_container');
// ReactDOM.render(e(LikeButton), domContainer);

let test = () => 1;
let divStyle = { // 注意这里不是直接写的style样式，而是一个样式对象，样式属性采用的是驼峰的命名方式
  backgroundColor: '#cfefe7',
  fontSize: '15px',
  textDecoration: 'underline'
};
let element = (
  <div> {/* ()里面只能有一个元素 */}
    <h1>JSX</h1>
    <div style={divStyle} > {/* 这是内联样式的添加方法 */}
      <p>这就是一个使用JSX语法创建的一个“元素”，它既不是HTML也不是字符串。</p>
      <p>可以通过{}包含任何JS表达式。比如：{test() + 1}。并且JSX本身也是表达式。</p>
      { 
        test() > 0 && <p>当test的值大于0的时候会展示这部分的内容</p>
      }
      <p>里面不光能使用原生元素比如div等，还能包含在React中的自定义组件。</p>
      <p className="nothing">JSX语法中元素的属性采用驼峰的命名方式。</p>
    </div>
  </div>
);

ReactDOM.render(element, domContainer);
