'use strict';

class Parent {
  // 构造函数
  constructor (num1, num2) {
    this.num1 = num1;
    this.num2 = num2;
    this.sum = num1 + num2
  }
  // 实例方法
  sayAns () {
    console.log(this.sum)
  }
}
let parent = new Parent(2, 3);
parent.sayAns();

class Child extends Parent {
  constructor (num1, num2) {
    // 在使用this前必须使用super
    super(num1, num2);
    this.product = this.num1 * this.num2;
  }
  sayAns () {
    console.log(this.product)
  }
}
let child = new Child(2, 3)
child.sayAns()