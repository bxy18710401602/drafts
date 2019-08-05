// 在JSX中使用内联条件渲染
// 通过花括号包裹代码，可以在JSX中嵌入任何表达式
'use strict';

function Mailbox (props) {
  const { unreadMessage, isLoggedIn } = props;
  return (
    <div>
      <h1>Hello !</h1>
      <div>The user is <b>{isLoggedIn ? 'currently': 'not'}</b> logged in.</div>
      { unreadMessage.length > 0 &&
        <h2>
          You have {unreadMessage.length} unread message.
        </h2>
      }
    </div>
  );
}

let messages = ['React', 'Re:React', 'Re:Re:React'];
// messages = [];
ReactDOM.render(
  <Mailbox unreadMessage={messages} isLoggedIn={false}/>,
  document.getElementById('root')
);
// 通过return null 来阻止组件渲染，例如：
function WarningBanner (props) {
  if (!props.warn) {
    return null;
  }
  return (
    <div>
      Warning!
    </div>
  );
}