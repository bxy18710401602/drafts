'use strict';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

const e = React.createElement;
class LikeButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = { liked: false };
  }

  render () {
    if (this.state.liked) {
      return 'You liked this.'
    }
    // return e(
    //   'button',
    //   { onClick: () => this.setState({ liked: true }) },
    //   'Like'
    // );

    // 也可以使用JSX
    return (
      <button onClick={ () => this.setState({ liked: true }) }>
        Like
      </button>
    );
  }
}

const domContainer = document.getElementById('like_button_container');
ReactDOM.render(e(LikeButton), domContainer);