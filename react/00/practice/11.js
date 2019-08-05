class Reservation extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    console.log(name, value);

    this.setState({
      [name]: value // 计算属性名称
    });
  }
  render () {
    return (
      <form>
        <lable>
          参与：
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </lable>
        <br />
        <label>
          来宾人数：
          <input 
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange}
          />
        </label>
      </form>
    );
  }
}

// ReactDOM.render(
//   <Reservation />,
//   document.getElementById('root')
// );

// 以下两段代码并没有像文档中说的那样，设置了input的value值就能够防止用户更改输入
ReactDOM.render(
  <input value='hi' />,
  document.getElementById('root')
);
setTimeout(() => {
  ReactDOM.render(
    <input value={null} />,
    document.getElementById('root')
  );
}, 1000);
