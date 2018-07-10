window.onload = main;

function main () {
  let data = getData();
  let tree = document.querySelector('.tree');
  createTree(tree, data);
  parentItemChecked();
  clickTexts();
}

// 创建下拉选项树
function createTree (parent, data) {
  let ul = document.createElement('ul');
  parent.appendChild(ul);
  let i = 0, len = data.length;
  for (i; i < len; i++) {
    let item = data[i];
    let label = item.label;
    let val = item.value;
    let li = document.createElement('li');
    let input = document.createElement('input');
    let text = document.createElement('span');
    text.textContent = label;
    input.type = 'checkbox';
    input.value = val;
    li.appendChild(input);
    li.appendChild(text);
    if (item.children && item.children.length > 0) {
      let childrenItems = item.children;
      createTree(li, childrenItems);
    }
    ul.appendChild(li);
  }
}

// 父级节点被选中时
function parentItemChecked () {
  let parentItems = document.querySelectorAll('li input:first-child');
  if (parentItems) {
    let i = 0, len = parentItems.length; 
    for (i; i < len; i++) {
      let  parentItem = parentItems[i];
      parentItem.addEventListener('click', selecteChildrenInputs, false);
    }
  }
}
// 选中下级多选框
function selecteChildrenInputs (event) {
  let item = event.target;
  if (item.checked) {
    check(item, true);
  } else {
    check(item, false);
  }
  let checkedNodes = selectedNodes();
  console.log(checkedNodes, '选中节点的值');
}

// 父级选项点击时
function check (item, value) {
  let nextNode = item.nextElementSibling.nextElementSibling;
  let childrenInputs = nextNode && nextNode.querySelectorAll('input[type=checkbox]');
  if (childrenInputs) {
    let j = 0, length = childrenInputs.length;
    for (j; j < length; j++) {
      childrenInputs[j].checked = value;
    }
  }
  // 当多选框被选中时显示子选项
  if (value) {
    if (nextNode.className.indexOf('hidden') > -1) {
      nextNode.className = nextNode.className.slice(0, -7);
    }
  }
}

// 文本被点击时
function clickTexts () {
  let spans = document.querySelectorAll('.tree span');
  if (spans) {
    let i = 0, len = spans.length;
    for (i; i < len; i++) {
      let span = spans[i];
      span.addEventListener('click', clickText, false);
    }
  }
}

function clickText (event) {
  let node = event.target;
  let sibling = node.nextElementSibling;
  if (sibling && sibling.nodeName == 'UL') {
    let hasHidden = sibling.className.indexOf('hidden');
    if (hasHidden == -1) {
      sibling.className += ' hidden';
    } else {
      sibling.className = sibling.className.slice(0, -7);
    }
  }
}

// 子级节点被选中时
function childItemChecked () {

}

// 整理选中的数据
function selectedNodes () {
  let checkboxs = document.querySelectorAll('input[type=checkbox]');
  if (checkboxs) {
    var selectedItems = Array.prototype.map.call(checkboxs, function (item, index) {
      if (item.checked) {
        return item.value;
      } 
    })
  }
  let selectedData = selectedItems.filter((item) => {
    return item;
  });
  return selectedData;
}

// 下拉选项框的数据
function getData () {
  let arr = [], i = 1;
  for (i; i < 6; i++) {
    let data =   {
      label: `一级选项${i}`,
      value: `${i}`,
      children: [{
        label: `二级选项${i}.${i}`,
        value:`${i}.${i}`,
        children: [{
          label: `三级选项${i}.${i}.${i}`,
          value: `${i}.${i}.${i}`,
          children: [{
            label: `四级选项${i}.${i}.${i}.${i}`,
            value: `${i}.${i}.${i}.${i}`,
            children: [{
              label: `五级选项${i}.${i}.${i}.${i}.${i}`,
              value: `${i}.${i}.${i}.${i}.${i}`,
              children: [{
                label: `六级选项${i}.${i}.${i}.${i}.${i}.${i}`,
                value: `${i}.${i}.${i}.${i}.${i}.${i}`
              }]
            }]
          }]
        }]
      },
      {
        label: `二级选项${i}.${i+1}`,
        value: `${i}.${i+1}`
      },
      {
        label: `二级选项${i}.${i+2}`,
        value: `${i}.${i+2}`
      }
      ]
    };
    arr.push(data)
  }
  return arr;
};