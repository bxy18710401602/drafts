class TodoItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      complete: false
    };
    // 组件中定义的方法必须手动绑定this
    this.changeTodoState = this.changeTodoState.bind(this);
  }
  componentDidMount() { // 生命周期方法 ------组件第一次渲染到DOM中会触发
    this.timer = null; // 为了展示任务选中的效果，设置一个timer
  }
  componentDidUpdate () { // 生命周期方法 ------组件更新的时候会触发
    console.log('组件更新了');
  }
  componentWillUnmount() { // 生命周期方法 ------组件从DOM中删除的时候会触发
    console.log('组件卸载了')
    clearTimeout(this.timer);
  }
  // 如果在输入框的点击事件中既要传入参数，又要使用event，那么把event放在参数的最后一个位置即可
  changeTodoState (content, event) {
    let value = event.target.value;
    this.timer = setTimeout(() => {
      if (value) {
        // 通过setState改变状态的值
        this.setState({
          complete: true
        });
        // setCompleteItems是从父组件传过来的方法，调用这个方法能将子组件中的内容传入父组件中
        // 也就是待办清单的某一项完成后，将该清单的content传入父组件中
        this.props.setCompleteItems(content);
      }
    }, 200);
  }
  render () {
    let complete = this.state.complete;
    let content = this.props.content;
    // 当complete完成的时候，返回的内容就是false，而不是组件的内容，所以清单的某一项就会隐藏
    return (
      (!complete) && 
      <li class="todo-item" key={content.toString()}>
        {/* 如果不需要绑定参数，在{}中直接写this.changeTodoState就行，如果要传入参数，则需要使用bind方法 */}
        <input type="checkbox" onChange={this.changeTodoState.bind(this, content)}/>
        <span>{content}</span>
      </li>
    );
  }
}
class TodoList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      completeItems: []
    };
    this.setCompleteItems = this.setCompleteItems.bind(this);
  }
  // 这个方法是为了将子组件中的内容传到父组件中，item就是从子组件传过来的内容
  setCompleteItems (item) {
    let completeItems = this.state.completeItems;
    completeItems.push(item);
    this.setState({
      completeItems
    });
  }
  render () {
    let list = this.props.list;
    let todoList = list.map((item) => <TodoItem content={item} setCompleteItems={this.setCompleteItems}/>);
    return (
      <div>
        <ul class="todo-list">
          {todoList}
        </ul>
        <p>已完成: {this.state.completeItems.join('，')}</p>
      </div>
    )
  }
}
let list = ['洗衣服', '买水果', '追剧'];
const todoList = <TodoList  list={list} />;
ReactDOM.render(
  todoList,
  document.getElementById('root')
);