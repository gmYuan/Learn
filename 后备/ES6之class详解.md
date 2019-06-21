# ES6之 clas详解

## 一 前言

最近学习了Class相关知识，所以对其做一个小结。

## 二 ES5 中的仿类结构

1 ES5中实现类的方法:
S1 创建一个构造器,在内定义私有变量;
  
S2 将公有方法指派到该构造器的原型上


2 实例如下:
```js
function Person(name){
  this.name = name;
}

Person.prototype.sayName = function(){
  console.log(this.name)
}

let person = new Person('klay');   //创建对象 + 指定this值且执行函数体 + 指定原型指向
person.sayName()   // 'klay'

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true
```

## 三 ES6 类的声明

1 这次用ES6的Class语法，来实现上文实例:
```js
class Person {
  // 等价于 Person构造函数
  constructor(name) {
    this.name = name;       //name是一个自有属性，它在实例而非原型上
  }

  // 等价于 Person.prototype.sayName
  sayName() {
    console.log(this.name);
  }
}

let person = new Person("klay");
person.sayName(); // 输出 "klay"

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true

console.log(typeof Person);           // "function"，说明了class关键字实质是一个语法糖
console.log(typeof Person.prototype.sayName); // "function"
```

2 class和自定义构造函数的区别
S1 class类声明不会被提升。类的行为与let相似，因此在程序执行到 声明处前，类都会位于暂时性死区内;
S2 类声明中的代码 会自动运行在严格模式下;

S3 在类的方法内部 重写类名，会抛出错误(在外部是可以重写类名的)
S4 调用类构造器时 不使用new, 会抛出错误;

S5 类的所有方法 内部都没有[[Construct]], 因此用new调用它们 会抛出错误;
S6 类的所有方法 都是不可枚举的;

用代码表示如下:
```js
// 直接等价于 PersonClass

let Person2 = (function() {                       //S1 
  "use strict";                                   //S2 

  const Person2 = function(name) {                //S3
    // 确认函数被调用时使用了 new
    if (typeof new.target === "undefined") {      //S4
      throw new Error("Constructor must be called with new.");
    }
    this.name = name;
  }

  Object.defineProperty(Person2.prototype, "sayName", {
    value: function() {

      // 确认函数被调用时没有使用 new
      if (typeof new.target !== "undefined") {      //S5
        throw new Error("Method cannot be called with new.");
      }
      console.log(this.name);
    },
    enumerable: false,                               //S6
    writable: true,
    configurable: true
  });

  return Person2;

}());
```


## 四 类表达式

1 基本的类表达式: `let PersonClass = class {...}`

2 具名类表达式: `let PersonClass = class PersonClass2 {...}`
S1 注意，PersonClass2标识符只在类定义内部 存在


3 类也是一等公民，所以它 可以被当作函数传入参数/函数返回值/变量值
作为变量值，可以实现类的单例模式:

```js
let person = new class{
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }

}('klay');

person.sayName(); // "klay"
```


## 五 访问器属性

1 通过类，可以在原型上定义访问器属性
```js
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {        //直接定义的方法是在原型上的 + get的简写方法，定义了html访问器属性可读
    return this.element.innerHTML;
  }

  set html(value) {    //set的简写方法，定义了html访问器属性可写
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, "html");
console.log("get" in descriptor);     // true
console.log("set" in descriptor);     // true
console.log(descriptor.enumerable);   // false
```
以上代码API，可参考[阮一峰—— 属性描述对象](https://javascript.ruanyifeng.com/stdlib/attributes.html#toc8)

2 用ES5表示为:
```js
let CustomHTMLElement = (function() {
  "use strict";

  const CustomHTMLElement = function(element) {
    // 确认函数被调用时使用了 new
    if (typeof new.target === "undefined") {
      throw new Error("Constructor must be called with new.");
    }
    this.element = element;
  }

  Object.defineProperty(CustomHTMLElement.prototype, "html", {
    enumerable: false,
    configurable: true,
    get: function() {
      return this.element.innerHTML;
    },
    set: function(value) {
      this.element.innerHTML = value;
    }
  });

  return CustomHTMLElement;

}());
```


## 六 可计算的属性名

1 类中也可以使用 可计算名称的语法:
```js
let methodName = "sayName";

class PersonClass {
  constructor(name) {
    this.name = name;
  }

  [methodName]() {
    console.log(this.name);
  }
}


let me = new PersonClass("Nicholas");
me.sayName(); // "Nicholas"
```


## 七 生成器方法


## 八 静态成员

1 ES5中的构造静态成员，是直接在构造器上 添加额外方法来模拟
```js
function PersonType(name) {
  this.name = name;
}

// 静态方法: 只能在构造器函数本身上调用
PersonType.create = function(name) {
  return new PersonType(name);
};

// 实例方法: 在实例中均能调用的方法
PersonType.prototype.sayName = function() {
  console.log(this.name);
};


var person = PersonType.create("Nicholas");
```

2 ES6中，简化了静态成员的创建:
```js
class PersonClass {

  // 等价于 PersonType 构造器
  constructor(name) {
    this.name = name;
  }

  // 等价于 PersonType.prototype.sayName
  sayName() {
    console.log(this.name);
  }

  // 等价于 PersonType.create
  static create(name) {           //static关键字, 不能用于 constructor方法
    return new PersonClass(name);
  }

}

let person = PersonClass.create("Nicholas");
```


## 九 使用派生类进行继承

1 ES5中创建继承的方法:
```js
function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}

Rectangle.prototype.getArea = function() {
  return this.length * this.width;
};


function Square(length) {
  Rectangle.call(this, length, length);    //调用时，this指向square实例对象
}

Square.prototype = Object.create(Rectangle.prototype, {
  constructor: {
    value:Square,
    enumerable: true,
    writable: true,
    configurable: true
  }
});


var square = new Square(3);
console.log(square.getArea());              // 9， 调用时，在原型查找 this指向square实例对象
console.log(square instanceof Square);     // true
console.log(square instanceof Rectangle);  // true
```

S2 用ES6实现，则为:
```js
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }

  getArea() {
    return this.length * this.width;
  }
}


class Square extends Rectangle {   // S1 继承了其他类的类被称为派生类
  constructor(length) {
    super(length, length);   //S2 super+extends时，与 Rectangle.call(this, length, length)相同
  }
}


var square = new Square(3);
console.log(square.getArea());             // 9
console.log(square instanceof Square);     // true
console.log(square instanceof Rectangle);  // true
```

S3 定义派生类时，若不使用构造器，super()方法会被自动调用，且自动传入参数
```js
class Square extends Rectangle {
  // 没有构造器
}

// 等价于：
class Square extends Rectangle {
  constructor(...args) {
    super(...args);
  }
}
```

2 屏蔽类方法
S1 派生类中的方法总是会屏蔽 基类的同名方法

```js
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }

  // 重写并屏蔽 Rectangle.prototype.getArea()
  getArea() {
    return this.length * this.length;
  }
}
```

S2 方法2：
```js
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }

  // 重写、屏蔽并调用了 Rectangle.prototype.getArea()
  getArea() {
    return super.getArea();
  }
}
```


3 继承静态成员
S1 如果基类包含静态成员，那么派生类也会默认 继承其静态成员
```js
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }

  getArea() {
    return this.length * this.width;
  }

  static create(length, width) {
    return new Rectangle(length, width);
  }
}

class Square extends Rectangle {
  constructor(length) {
    // 与 Rectangle.call(this, length, length) 相同
    super(length, length);
  }
}


var rect = Square.create(3, 4);
console.log(rect instanceof Rectangle); // true
console.log(rect.getArea());            // 12
console.log(rect instanceof Square);    // false
```


4 从表达式中派生类
S1 表达式能返回 一个具有[[Construct]]属性+原型 的函数，就可以对其使用extends
```js
function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}

Rectangle.prototype.getArea = function() {
  return this.length * this.width;
};


class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}


var x = new Square(3);
console.log(x.getArea());               // 9
console.log(x instanceof Rectangle);    // true
```

S2 可以有效地创建混入
这部分未懂



## 十 在类构造器中使用 new.target 

1 用new.target可以 创建一个抽象基类
```js
// 静态的基类
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error("This class cannot be instantiated directly.")
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    this.length = length;
    this.width = width;
  }
}


var x = new Shape();             // 抛出错误
var y = new Rectangle(3, 4);     // 没有错误
console.log(y instanceof Shape); // true
```



## 参考文档

[01 深入理解ES6 第9章](https://book.douban.com/subject/27072230/)