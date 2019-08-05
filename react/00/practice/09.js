// 列表和key
/*
const numbers = [1, 2, 3, 4, 5, 6];
const listItems = numbers.map((item) => {
  return <li>{item}</li>
});

ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
*/

// 这里说没加key值会给出警告，实际上并没有给出警告
// key帮助react识别哪些元素改变了，比如被添加或删除
// 元素没有id的时候，万不得已可以使用index作为key值

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number)=> {
    // key只需要在其兄弟节点之间是独一无二的，并不需要是全局唯一的
    return <li key={number.toString()}>{number}</li>
  });
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5, 6];

ReactDOM.render(
  <NumberList numbers={numbers}/>,
  document.getElementById('root')
);

// JSX允许在大扩号中嵌入任何表达式
/*
function NumberList (props) {
  const numbers = props.numbers;
  return (
    // 当一个map嵌套了太多层级，那可能就需要提取组件
    <ul>
      {
        numbers.map((number) => 
        <ListItem key={number.toString()} value={number} />
        )
      }
    </ul>
  );
}
*/