class ShowText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {content: '学习中', description: '点击一下这段文本就会消失' };
    this.hideText = this.hideText.bind(this);
  }
  componentDidMount() { // 生命周期方法 ------组件第一次渲染到DOM中会触发
    this.timer = setTimeout(() => {
      this.setState({
        content: '1秒钟过去了'
      });
      // setState中的参数还可以为一个函数，函数的第一个参数是state，第二个参数是props
      // this.setState((state, props) => ({
      //   content: `${props.content} ${state.content} 1秒钟过去了 `
      // }))
    }, 1000);
  }
  componentDidUpdate () {
    console.log('组件更新被执行了')
  }
  componentWillUnmount() { // 生命周期方法 ------组件从DOM中删除的时候会触发
    clearTimeout(this.timer);
  }
  hideText () {
    this.setState({
      description: ''
    });
  }
  render () {
    
    return (
      <div>
        <p onClick={this.hideText}>{this.state.description}</p>
        {/* 如果要传入参数， 可以像以下代码那样，bind函数的第二个参数就是要传入的参数 */}
        {/* <p onClick={this.hideText.bind(this, '测试测试')}>{this.state.description}</p> */}
        <p>{this.state.content}</p>
        <p style={this.props.style}>{this.props.content}</p>
      </div>
    );
  }
}
const element = <ShowText content="React学习" style={ {color: 'green', fontSize: '30px'} }/>;
ReactDOM.render(
  element,
  document.getElementById('root')
);