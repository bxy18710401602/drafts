class OuterClickExample extends React.Component {
  constructor (props) {
    super(props);

    this.state = { isOpen: false };
    // this.toggleContainer = React.createRef();
    this.timeOutId = null; // 可以添加任意属性

    this.onClickHandler = this.onClickHandler.bind(this);
    // 通过在window对象中附上一个click事件关闭弹窗，但是这样无法使用tab切换到下一个元素
    // 这样会导致用户无法使用应用中的一些内容，导致不完整的用户体验。
    // this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
    // 可以使用blur和focus来触发事件。
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);

  }

  // componentDidMount () {
  //   window.addEventListener('click', this.onClickOutsideHandler);
  // }
  // componentWillUnmount () {
  //   window.removeEventListener('click', this.onClickOutsideHandler);
  // }

  onClickHandler () {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }
  // 我们在下一个时间点使用setTimeout关闭弹窗。
  // 这是必要的，因为失去焦点事件会在新的焦点事件前被触发，我们需要通过这个步骤确认这个元素的一个子节点是否得到了焦点
  onBlurHandler () {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }
  
  // 如果一个子节点获得了焦点，不要关闭弹窗
  onFocusHandler () {
    clearTimeout(this.timeOutId);
  }

  onClickOutsideHandler (event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({isOpen: false});
    }
  }
  
  render () {
    return (
      <div onBlur={this.onBlurHandler}
          onFocus={this.onFocusHandler} >
        <button onClick={this.onClickHandler}
            aria-haspopup="true"
            aria-expanded={this.state.isOpen}
          >
          Select an option
        </button>
        { this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
  // render () {
  //   return (
  //     <div ref={this.toggleContainer}>
  //       <button onClick={this.onClickHandler}>
  //         Select an option.
  //       </button>
  //       {this.state.isOpen && (
  //         <ul>
  //           <li>Option 1</li>
  //           <li>Option 2</li>
  //           <li>Option 3</li>
  //         </ul>
  //       )}
  //     </div>
  //   );
  // }
}

ReactDOM.render(
  <OuterClickExample />,
  document.getElementById('root')
);
