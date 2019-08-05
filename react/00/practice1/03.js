// 创建一个Context对象，当React选它一个订阅了这个Context对象的组件，这个组件会从组件树中离资深最近的那个匹配的Provider中读取到当前的context值。
const MyContext = React.createContext(defaultValue);

<MyContext.Provider value={/**某个值 */} />

class MyClass extends React.Component {
  componentDidMount () {
    let value = this.context;
    // 在组件挂载完成后，使用MyContext 组件的值来执行一些有富足用的操作
  }
  componentDidUpdate () {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount () {
    let value = this.context;
    /* ... */
  }
  render () {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}

// 挂载在class上的contextType属性会被重赋值为一个由React.createContext()创建的Context对象，这能让你使用this.context来消费最近Context上的那个值
// 你可以在任何生命周期中访问到它，包括在render函数中
MyClass.contextType = MyContext;

// 如果在使用实验性的public class fields 语法，可以使用static这个类属性来初始化contextType。
class MyClass extends React.Component {
  static contextType = MyContext;
  render () {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}

// 在函数式组件中完成订阅context

// <MyContext.Consumer>
//   { value => /* 基于context值进行渲染 */ }
// </MyContext.Consumer>

