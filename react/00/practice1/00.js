// JSX支持所有aria-*的HTML属性
// 网络无障碍辅助功能 Accessibility，也被称为a11y

// 在JSX中使用<div>元素来实现React代码功能的时候，或者在使用列表或者
// table时，语义化的HTML会被破坏，我们应该使用ReactFragments。

import React, { Fragment } from 'react';

function ListItem ({ item }) {
  return (
    // <Fragment>
    //   <dt>{item.term}</dt>
    //   <dd>{item.description}</dd>
    // </Fragment>    
    // 当你不需要在fragment标签中添加任何prop且你的工具支持的时候，可以使用短语法
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}

function Glossary (props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
