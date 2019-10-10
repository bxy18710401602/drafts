// 此文件中的内容于00.js中的内容等价，只是没有使用hook
let container = document.getElementById('root');
class Example extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      count: 0
    }
  }
  render () {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    )
  }
}

ReactDOM.render(<Example />, container)
