'use strict';

// state与props类似，但是state是私有的，并且完全受控于当前组件。
function Clock1 (props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}</h2>
    </div>
  );
}

class Clock2 extends React.Component {
  render () {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString}</h2>
      </div>
    );
  }
}
// 将date从props移动到state中
class Clock extends React.Component {
  constructor (props) {
    super(props); // 将props传递到父类的构造函数中
    this.state = {
      date: new Date()
    }
  }
  // 生命周期
  componentDidMount () { // 挂载，在组件已经被渲染到DOM中后运行
    this.timerID = setInterval(() => this.tick(), 1000);
    // 可以向class中随意添加不参与数据流的额外字段

  }
  componentWillUnmount () { // 卸载，
    clearInterval(this.timerID);
  }
  tick () {
    this.setState({ // 使用setState来时刻更新组件state，直接修改state不会重新渲染组件 this.state.comment = 'Hello';
      date: new Date()
    });
  }
  render () {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

/** 代码片段 */

// 因为this.props和this.state可能会异步更新，所以不要依赖它们的值来更新下一个状态

this.setState({
  counter: this.state.counter + this.props.increment
});

// 要解决这个问题，可以让setState接收一个函数，而不是一个对象。
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));

// 当调用setState()的时候，React会把你提供的对象合并到当前的state。

// 单向数据流
// 数据是向下流动的，组件可以选择把它的state作为props向下传递到他的子组件中
// <FormattedDate date={this.state.date} />
// 你可以在有状态的组件中使用无状态的组件，反之亦然