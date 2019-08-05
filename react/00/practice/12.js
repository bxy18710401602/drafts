/*
*  状态提升
*/
function BoilingVerdict (props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }
  handleCelsiusChange (temperature) {
    this.setState({scale: 'c', temperature});
  }
  handleFahrenheitChange () {
    this.setState({scale: 'f', temperature});
  }
  render () {
    const scale= this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? 
      tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? 
      tryConvert(temperature, toFahrenheit) : temperature;
    return (
      // 状态提升后使用的代码
      <div>
        <TemperatureInput 
          scale="c"
          temperature={celsius}
          onTemeratureChange={this.handleCelsiusChange}/>
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemeratureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </div>
      // <fieldset>
      //   <legend>Enter temperature in Celsius:</legend>
      //   <input 
      //     value={temperature}
      //     onChange={this.handleChange}
      //   />
      //   <BoilingVerdict
      //     celsius={parseFloat(temperature)}
      //   />
      // </fieldset>
    );
  }
}

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    // this.state = { temperature: '' };
  }
  handleChange (e) {
    // this.setState({temperature: e.target.value});
    // 状态提升 2. 现在TemperatureInput组件想要更新温度，只能调用props上的方法
    this.props.onTemeratureChange(e.target.value);
  }

  render () {
    // const temperature = this.state.temperature;
    // 状态提升，1. 将state改为props，因为props是只读的，所以TemperatureInput组件失去了对它的控制权
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature} onChange={this.handleChange}/>
      </fieldset>
    );
  }
}

class Calculator1 extends React.Component  {
  render () {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}

// 编写两个在摄氏度和华氏度之间转换的函数
function toCelsius (fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit (celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert (temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
// 希望两个输入框中的数值能够同步

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
