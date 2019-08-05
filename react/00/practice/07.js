// 元素变量
'use strict';

class LoginControl extends React.Component {
  constructor (props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = { isLoggedIn: false };
  }
  handleLoginClick () {
    this.setState({
      isLoggedIn: true
    });
  }
  handleLogoutClick () {
    this.setState({
      isLoggedIn: false
    });
  }
  render () {
    const isLoggedIn = this.state.isLoggedIn;
    
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick}/>;
    } else {
      button = <LoginButton onClick={this.handleLoginClick}/>;
    }
    console.log(button, '看看当前的button的值');
    // 为何这样在页面中渲染不出来呢
    // 之前命名组件的时候是以logoutButton、loginButton命名的，这样命名就无法渲染，名称的首字母必须大写
    return (
      // JSX也可以赋值给变量
      <div>
        {button}  
      </div>
    );
  }
}

function LoginButton (props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton (props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);