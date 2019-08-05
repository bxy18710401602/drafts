/**
 * 消费多个Context
 */

const ThemeContext = React.createContext('light');

// 用户登录context
const UserContext = React.createContext({
  name: 'Guest'
});

class App extends React.Component {
  render () {
    const { signedInUser, theme } = this.props;

    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout () {
  return (
    <ThemeContext.Consumer>
      { theme => (
        <UserContext.Consumer>
          { user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      ) }
    </ThemeContext.Consumer>
  );
}
