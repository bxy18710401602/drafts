// 表单，在HTML中。输入框中的内容根据用户的输入自己进行更新，但是在React中，可变状态通常保存在组件的state属性zhong ，只能通过setState()来更新
// 可以将表单写为受控组件

// input框
class NameForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange (event) {
    this.setState( {value: event.target.value });
  }
  handleSubmit (event) {
    alert('提交的名字：' + this.state.value);
    event.preventDefault();
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字：
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" vlaue="提交" />
      </form>
    )
  }
}

// textarea框
class EssayForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '请撰写一篇你喜欢的DOM元素的文章.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange (event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit (event) {
    alert('提交的文章：' + this.state.value);
    event.preventDefault();
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          文章：
          <textarea value={this.state.value} onChange={this.handleChange}></textarea>
        </label>
        <input type="submit" value="提交"/>
      </form>
    );
  }
}

// select框
class FlavorForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange (event) {
    this.setState({value: event.target.value});
  }
  handleSubmit (event) {
    alert('你喜欢的风味是：' + this.state.value);
    event.preventDefault();
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <lable>
          选择你喜欢的风味：
          {/*
          <select multiple={true} value={['B', 'C']}> 在select标签中选择多个选项
          */}
          <select value={this.state.value} onChange={this.handleChange}> 
            <option value="grapefruit">葡萄柚</option>
            <option value="lime">酸橙</option>
            <option value="coconut">椰子</option>
            <option value="mango">芒果</option>
          </select>
        </lable>
        <input type="submit" value="提交" />
      </form>
    );
  }
}

// file类型的input是非受控型组件

const element = ( // 在这里的小括号中只能放一个元素
  <div>
    <NameForm />
    <EssayForm />
    <FlavorForm />
  </div>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
