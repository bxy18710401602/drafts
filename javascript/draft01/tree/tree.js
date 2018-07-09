window.onload = main;

function main () {
  let data = getData();
  parentItemChecked();
  let checkedNodes = selectedNodes();
}

// 创建下拉选项树
function createTree (data) {
  
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
}

// 父级选项点击时
function check (item, value) {
  let nextNode = item.nextElementSibling;
  let childrenInputs = nextNode && nextNode.querySelectorAll('input[type=checkbox]');
  if (childrenInputs) {
    let j = 0, length = childrenInputs.length;
    for (j; j < length; j++) {
      childrenInputs[j].checked = value;
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
    let selectedItem = Array.prototype.map.call(checkboxs, function (item, index) {
      if (item.checked) {
        return item.value;
      } 
    })
  }
}

// 下拉选项框的数据
function getData () {
  let arr = [], i = 1;
  for (i; i < 11; i++) {
    let data =   {
      label: `一级选项${i}`,
      value: '1',
      children: [{
        label: `二级选项${i}`,
        value:'1.1',
        children: [{
          label: `三级选项${i}`,
          value: '1.1.1',
          children: [{
            label: `四级选项${i}`,
            value: '1.1.1.1',
            children: [{
              label: `五级选项${i}`,
              value: '1.1.1.1.1',
              children: [{
                label: `六级选项${i}`,
                value: '1.1.1.1.1.1'
              }]
            }]
          }]
        }]
      }]
    };
    arr.push(data)
  }
  return arr;
};