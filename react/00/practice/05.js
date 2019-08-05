// 事件处理
'use strict';

/*
// 传统的HTML
<button onclick="activateLasers()">
  Activate Lasers
</button>

// 在React中：
<button onClick={activateLasers}>
  Activate Lasers
</button>
*/

// 在React中不能通过返回false来阻止默认行为，必须显示地使用preventDefault。

function ActionLink () {
  function handleClick (e) { // 这里的e是一个合成事件
    e.preventDefault();
    console.log('The link was clicked.');
  }
  return (
    <a href="#" onClick={handleClick}>Click me</a>
  );
}
// 当使用ES6 class语法定义一个组件的时候，通常的做法是将事件处理函数声明为class中的方法

class Toggle extends React.Component {
  constructor (props) {
    super(props);
    this.state = { isToggleOn: true };

    // 为了在回调中使用this,这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }
  render () {
    return (
      <button onClick={this.handleClick}>
        { this.state.isToggleOn ? 'ON' : 'OFF' }
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);

// 向事件处理程序传递参数
/*
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
*/
