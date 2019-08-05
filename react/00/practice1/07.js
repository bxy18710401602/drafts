// Fragments 允许你将子列表分组，而无需向DOM添加额外节点
class Columns extends React.Component {
  render () {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}

// 短语法，可以使用一种新的，且更简短的语法来声明Fragments，它看起像空标签
class Columns extends React.Component {
  render () {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}

// 带key的Fragments
function Glossary(props) {
  return (
    <dl>
      { props.items.map(item => (
        // 没有`key`，React会发出一个关键警告
        // key是唯一可以传递给Fragment的属性
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dt>{item.description}</dt>
        </React.Fragment>
      ))}
    </dl>
  );
}