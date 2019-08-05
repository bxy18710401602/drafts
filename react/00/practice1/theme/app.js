// 因为babel会把import转为require，而浏览器中不支持require
import { ThemeContext, themes } from './theme-context.js';
import ThemedButton from './theme-button.js';

// 一个使用ThemedButton的中间组件
function Toolbar (props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      theme: themes.light
    };

    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark
                  ? themes.light
                  : themes.dark,
      }));
    };
  }

  render() {
    // 在ThemeProvider 内部的ThemedButton 按钮组件使用state中的theme值
    // 而外部的组件使用默认的theme值
    return (
      <Page>
        <ThemeContext.Provider value={this.state.name}>
          <Toolbar changeTheme={this.toggleTheme}/>
        </ThemeContext.Provider>
        <Section>
          <ThemedButton />
        </Section>
      </Page>
    );
  }
}

ReactDOM.render(<App />, document.root);
