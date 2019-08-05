/**
 * 高阶组件(HOC) 是React中用于复用组件逻辑的一种高级技巧
 * 高阶组件是参数为组件，返回值为新组件的函数
 * 组件是将props转换为UI，而高阶组件是将组件转换为另一个组件
 */
/**
 * 不要在render方法中使用HOC
 */
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);

// 此函数接收一个组件...
function withSubscription(WrappedComponent, selectData) {
  // ...并返回另一个组件...
  return class extends React.Component {
    constructor (props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }
    componentDidMount () {
      // ...负责订阅相关的操作...
      DataSource.addChangeListener(this.handleChange);
    }
    componentWillUnmount () {
      DataSource.removeChangeListener(this.handleChange);
    }
    handleChange () {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }
    render() {
      // ...并使用新数据渲染被包装的组件，请注意，我们可能还会传递其他属性
      return <WrappedComponent data={this.state.data} {...this.props}/>;
    }
  }
}