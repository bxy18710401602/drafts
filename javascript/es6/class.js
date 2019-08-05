
// let container = new Container(100); // 类的声明不会提升，在此处使用Person会报错ReferenceError

// 类的声明
class Container {
  // 构造函数constructor用于创建和初始化Container的实例对象
  constructor ( totalCapacity ) {
    this.totalCapacity = totalCapacity;

    this.usedCapacity = 0;
    this.contained = [];

    // class中的方法不会自动绑定到实例对象，所以需要我们手动绑定
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.printContained = this.printContained.bind(this);
  }
  // 静态方法，调用方式Container.containerInfo()，静态方法会被子类继承
  static containerInfo () {
    console.log('这个是静态方法呀\n');
  }
  // add、remove、printContained是定义在Container的prototype上的，可以被子类继承
  add (something, volume) { // 将某物加入容器
    const containedItem = {
      name: something,
      volume
    };
    let used = this.usedCapacity + volume;
    if (used > this.totalCapacity) {
      console.log(`此容器不能放下体积为${volume}的物品`);
      return;
    }
    this.contained.push(containedItem);
    this.usedCapacity = used;
  }
  remove (something, volume) { // 将某物移出容器
    let containedLen = this.contained.length;
    if (containedLen === 0) return;
    const index = this.contained.findIndex((item) => item.name === something);
    if (index < 0) return;
    const item = this.contained[index];
    const diff = item.volume - volume;
    switch (true) {
      case diff === 0:
        this.contained.splice(index, 1);
        break;
      case diff > 0:
        this.contained[index] = {
          name: item.name,
          volume: diff
        };
        break;
      case diff < 0:
        console.log(`容器中的${something}体积不足${volume}\n`);
        break;
    }
  }
  printContained () {
    this.contained.forEach((item) => {
      const { name, volume } = item;
      console.log(`${name} ${volume}`);
    })
  }
}

let container = new Container(100); // 使用class定义的类必须用new调用，直接执行Container()会报TypeError

container.add('苹果', 20);
container.printContained();
container.remove('苹果', 10);
container.printContained();

// 如果没有在constructor中手动给printContained绑定this，那么执行以下两行代码就会报错
// 因为printContained执行时的this是undefined，不是container（Container的实例）
// const { printContained } = container;
// printContained();

// 静态方法的调用方式
// Container.containerInfo();

// 类的继承
class Box extends Container { // Box会继承Container原型链上的方法
  constructor (totalCapacity, material) {
    // super方法调用父类的构造函数，将父类属性添加到子类上。相当于Container.constructor.call(this, 参数1, 参数2...);
    super(totalCapacity);
    this.material = material; // Box类的属性
    this.printContained = this.printContained.bind(this);
  }
  printContained () {
    console.log(`箱子是${this.material}制的`);
    console.log('箱子中包含：');
    super.printContained(); // 可以使用super对象使用父类的方法，函数执行的过程中this是指向Box实例的
  }
}

let box = new Box(100, '木头');
box.add('芒果', 20);
box.add('西瓜', 10);
box.add('荔枝', 30);
box.printContained();
box.remove('芒果', 10);
box.printContained();
