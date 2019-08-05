'use strict';
function formatDate (date) {
  return date;
}

function Avator (props) {
  return (
    <img className="Avatar" src={props.user.avatarUrl} alt={props.user.name}/>
  );
}

function Comment (props) {
  return (
    // 一个评论组件里面包含头像，文本，日期等，如果直接写成一整个组件，不利于维护以及不能复用
    // 所以可以把它们拆分成各个小组件
    <div className="Comment"> 
      <div className="UserInfo">
        {/* <img className="Avatar" src={props.author.avatarUrl} alt={props.author.name} /> */}
        <Avator user={props.author} />
        <div class="UserInfo-name">{props.author.name}</div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div class="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
// 还可以组合一个UserInfo组件
// 所有React组件都必须像纯函数一样保护它们的props不被修改
