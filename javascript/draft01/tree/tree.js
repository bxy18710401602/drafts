window.onload = main;

function main () {
  let data = getData();
  let tree = new Tree('test', data); // 第一个参数为树形控件的类名
  tree.createTree();
  let tree01 = new Tree('test01', data);
  tree01.createTree();
}
function Tree (name, data) {
  this.name = name; // 名字
  this.node = document.querySelector('.' + name); // 节点
  this.data = data; // 数据
  this.mask = null; // 遮罩层
}
Tree.prototype = {
  constructor: Tree,
  createTree: function () {
    this.buildTree();
    this.addBtns();
  },
  // 创建下拉选项树
  buildTree: function (parent, data) { 
    if (!parent || !data) {
      parent = this.node;
      data = this.data;
    } 
    let ul = document.createElement('ul');
    parent.appendChild(ul);
    let i = 0, len = data.length;
    for (i; i < len; i++) {
      let item = data[i];
      let label = item.label;
      let val = item.value;
      let li = document.createElement('li');
      let icon = document.createElement('span');
      icon.className = 'triangle-icon';
      let input = document.createElement('input');
      let text = document.createElement('span');
      text.textContent = label;  
      input.type = 'checkbox';
      input.value = val;
      let addOption = document.createElement('span');
      let deleteOption = document.createElement('span');
      let operations = document.createElement('span');
      operations.appendChild(addOption);
      operations.appendChild(deleteOption);
      operations.className = 'operations';
      addOption.textContent = '添加';
      deleteOption.textContent = '删除';
      let container = document.createElement('div'); // 用来装每行内容的容器
      container.className = 'option-container';
      icon.addEventListener('click', this.toggle, false); // 三角图标被点击时
      text.addEventListener('click', this.toggle, false); // 文本节点被点击时
      input.addEventListener('change', this.clickCheckBox.bind(null, this), false); // 选择框被点击时
      addOption.addEventListener('click', this.addOption.bind(null, this), false); // 添加选项
      deleteOption.addEventListener('click', this.deleteOption, false); // 删除选项
      container.appendChild(icon);
      container.appendChild(input);
      container.appendChild(text);
      container.appendChild(operations);
      li.appendChild(container);
      if (item.children && item.children.length > 0) {
        let childrenItems = item.children;
        this.buildTree(li, childrenItems);
      } else {
        container.removeChild(icon);
      }
      ul.appendChild(li);
    }
  },

  // 选择框被点击时，thisObj是当前的tree实例，changedNode是通过事件间接改变了状态的input元素
  clickCheckBox: function (thisObj, changedNode) { 
    console.log(changedNode.target, '111')
    let that = thisObj;
    let item = null;
    if (changedNode.target) {
      item = changedNode.target;
    } else {
      item = changedNode;
    }
    if (item.checked) {
      that.check(item, true);
    } else {
      that.check(item, false);
    }
    let checkedNodes = that.selectedNodes();
    console.log(checkedNodes, '选中节点的值');
  },
  // item参数是被点击的选项，value是子选项需要设置的状态
  check: function (item, value) { 
    let parent = item.parentNode.parentNode;
    let nextNode = parent.querySelector('ul');
    let childrenInputs = nextNode && nextNode.querySelectorAll('input[type=checkbox]');
    if (childrenInputs) {
      let j = 0, length = childrenInputs.length;
      for (j; j < length; j++) {
        childrenInputs[j].checked = value;
      }
    }
    // 当多选框被选中时显示子选项
    if (value && nextNode) {
      if (nextNode.className.indexOf('hidden') > -1) {
        nextNode.className = nextNode.className.slice(0, -7);
      }
    }
    // 当不是一级选项时判断当前级别的选项是否全部选中
    let level1Option = this.node;
    let currentParentNode =  parent.parentNode.parentNode;
    if (!level1Option.isSameNode(currentParentNode)) {
      let parentCheckbox = currentParentNode.firstChild.querySelector('input[type=checkbox]');
      if (parentCheckbox) {
        let siblings =  parent.parentNode.children, len = siblings.length, i = 0;
        let inputs = [];
        for (i; i < len; i++) {
          let input = siblings[i].firstChild.querySelector('input');
          inputs.push(input);
        }
        let allChecked = this.allChecked(inputs);
        let allNotChecked = this.allNotChecked(inputs);
        if (allChecked) {
          parentCheckbox.checked = true;
          // 间接改变选项框的选中状态时，也要进行检查
          this.clickCheckBox(this, parentCheckbox);
        } 
        else if (allNotChecked) {
          parentCheckbox.checked = false;
          this.clickCheckBox(this, parentCheckbox);
        }
      } 
    }
  },
  allChecked: function (inputs) {
    let allChecked = Array.prototype.every.call(inputs, function (item) {
      return item.checked;
    });
    return allChecked;
  },
  allNotChecked: function (inputs) {
    let allNotChecked = Array.prototype.every.call(inputs, function (item) {
      return !item.checked;
    });
    return allNotChecked;
  },
  // 子选项卡的显示和隐藏
  toggle: function () {
    let node = event.target;
    let parent = node.parentNode.parentNode;
    let ulNode = parent.querySelector('ul');
    let icon = parent.querySelector('.triangle-icon');
    if (ulNode) {
      let hasHidden = ulNode.className.indexOf('hidden');
      if (hasHidden == -1) {
        ulNode.className += ' hidden';
        icon.className = icon.className.split(' ')[0];
        icon.className += ' spread-icon';
      } else {
        ulNode.className = ulNode.className.slice(0, -7);
        icon.className = icon.className.split(' ')[0];
        icon.className += ' take-up-icon';
      }
    }
  },
  // 整理选中的数据
  selectedNodes: function () { 
    let checkboxs = this.node.querySelectorAll('input[type=checkbox]');
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
  },
  // 添加底部按钮
  addBtns: function () {
    let btns = document.createElement('div');
    let saveBtn = document.createElement('span');
    let clearBtn = document.createElement('span');
    saveBtn.textContent = '保存';
    clearBtn.textContent = '清空';
    btns.className = 'footer';
    saveBtn.className = 'btn';
    clearBtn.className = 'btn';
    btns.appendChild(saveBtn);
    btns.appendChild(clearBtn); 
    this.node.appendChild(btns);
  },
  // 设置选项名称的遮罩层
  addOption: function (thisObj) {
    let that = thisObj;
    if (that.mask) {
      let mask = that.node.querySelector('.mask');
      mask.className = 'mask';
    } else {   
      let mask = document.createElement('div');
      mask.className = 'mask';
      let box = document.createElement('div');
      box.className = 'box';
      let input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '请输入添加的选项名称';
      input.className = 'input-name';
      let footer = document.createElement('div');
      footer.className = 'footer';
      let btn = document.createElement('span');
      btn.textContent = '确定';
      btn.className = 'btn ';
      let close = document.createElement('span');
      close.textContent = 'X';
      close.className = 'close-mask';
      close.addEventListener('click', that.closeBox.bind(null, that), false);
      footer.appendChild(btn);
      box.appendChild(close);
      box.appendChild(input);
      box.appendChild(footer);
      mask.appendChild(box);
      that.mask = mask;
      that.node.appendChild(mask);
    }
  },
  // 关闭设置名称的弹窗时触发
  closeBox: function (thisObj) {
    let that = thisObj;
    that.mask.className += ' mask-hidden';
  },
  // 删除选项
  deleteOption: function () {
    console.log('删除选项');
  }
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
                label: `六级选项${i}.${i}.${i}.${i}.${i}.${1}`,
                value: `${i}.${i}.${i}.${i}.${i}.${i}`
              },{
                label: `六级选项${i}.${i}.${i}.${i}.${i}.${2}`,
                value: `${i}.${i}.${i}.${i}.${i}.${2}`
              },{
                label: `六级选项${i}.${i}.${i}.${i}.${i}.${3}`,
                value: `${i}.${i}.${i}.${i}.${i}.${3}`
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