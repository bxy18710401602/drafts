class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    // 更新state使下一次渲染能够显示降级后的UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 可以将错误日志上报给服务器
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

ReactDOM.render(
  <ErrorBoundary>
    <h1>测试测试</h1>
  </ErrorBoundary>,
  document.getElementById('root')
);
