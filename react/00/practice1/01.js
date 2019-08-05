const element = (
  <div>
    <label htmlFor="namedInput">
      Name:
    </label>
    <input id="namedInput" type="text" name="name" />
  </div>
);

// 可以使用DOM元素的Refs在React中设置焦点
class CustomTextInput extends React.Component {
  constructor (props) {
    super(props);
    this.textInput = React.createRef();
  }
  focus () {
    // 使用原始的DOM API显式地聚焦在text input上
    // 注意：我们通过访问"current"来获得DOM 节点
    this.textInput.current.focus();
  }
  render () {
    return (
      <input 
        type="text"
        ref={this.textInput} />
    );
  }
}

function CustomTextInput (props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor (props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render () {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// 可以根据需要设置焦点
this.inputElement.current.focus();