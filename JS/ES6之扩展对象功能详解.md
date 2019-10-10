# ES6之 扩展的对象功能

## 一 前言

最近学习了《深入理解ES6》第4章的相关知识，所以对其做一个小结。


## 二 对象类别

1 普通对象: 有JS规定的对象 所有的默认行为的 对象;
2 奇异对象: 某些行为有异于普通对象;
3 标准对象: ES6中规定的对象，可能是普通的，也可能是奇异的;
4 内置对象: 在JS运行环境中运行时就可用的对象，所有标准对象 都是内置对象


## 三 对象字面量 语法的扩展

1 简化对象key和value形参 名称一致时的 写法(省略 冒号和value形参)：
```
// ES5的写法:
function createPerson(name, age) {
  return {
    name: name,
    age: age
  };
}

// ES6的简化写法
function createPerson(name, age) {
  return {
    name,
    age
  };
}
```

2 方法简写语法(省略 冒号和function):
```js
// ES5的写法:
var person = {
  name: "Nicholas",
  sayName: function() {
    console.log(this.name);
  }
};

// ES6的简化写法
var person = {
  name: "Nicholas",
  sayName() {         //方法简写能使用super，而 非简写的方法则不能
    console.log(this.name);
  }
}
```

3 可计算属性名
S1 ES5中，对象实例能使用“可计算的属性名”，即用方括号表示法来代替小数点表示法
   方括号允许指定变量或字符串字面量为属性名(在字符串中允许使用 不能用于标识符的特殊字符)
```js
var person = {},
    lastName = "last name";

person["first name"] = "klay";   
person[lastName] = "yoyo";
                     //属性名包含了空格，无法用小数点表示，而方括号表示法 允许将任意字符串用作属性名

console.log(person["first name"]); // "klay"
console.log(person[lastName]); // "yoyo"
```

S2 ES6中，可计算属性名是对象字面量语法的一部分，它用的也是方括号表示法，与对象实例上的用法一致
```js
var lastName = "last name";
var person = {
  "first name": "Nicholas",
  [lastName]: "Zakas"         //对象字面量内的方括号表明 该属性名需要计算，其结果是一个字符串
};

console.log(person["first name"]); // "Nicholas"
console.log(person[lastName]); // "Zakas"



//例2
var suffix = " name";
var person = {
  ["first" + suffix]: "Nicholas",
  ["last" + suffix]: "Zakas"
};

console.log(person["first name"]); // "Nicholas"
console.log(person["last name"]); // "Zakas"
```


## 四 新的对象方法

1 Object.is()方法: 与`===`大致一致，有区别的是:它会认为 +0与-0不相等，而且NaN等于NaN 

2 Object.assign()方法


## 五 重复的对象字面量属性

1 严格模式下，在ES5中，重复的对象字面量属性会报错，而ES6则会覆盖，见下:
```js
//ES5情况
"use strict";
var person = {
  name: "Nicholas",
  name: "Greg" // 在 ES5 严格模式中是语法错误
};

//ES6情况
"use strict";
var person = {
  name: "Nicholas",
  name: "Greg" // 在 ES6 严格模式中不会出错
};

console.log(person.name);   // "Greg"
```


## 六 自有属性的枚举顺序

1 ES6 严格定义了 对象自有属性在被枚举时的返回顺序：
S1 所有的数字类型键，按升序排列;
S2 所有的字符串类型键，按被添加到对象的顺序排列
S3 所有的符号类型键，也按添加顺序排列

```js
var obj = {
  a: 1,
  0: 1,
  c: 1,
  2: 1,
  b: 1,
  1: 1
};

obj.d = 1;
console.log(Object.getOwnPropertyNames(obj).join(""));   // "012acbd"
```


## 七 更强大的原型

1 修改对象的原型
S1 ES6 新增 `Object.setPrototypeOf() 方法`, 此方法允许修改任意指定对象的原型
   它接受两个参数：需要被修改原型 的对象，以及 将会成为前者原型 的对象

```js
let person = {
  getGreeting() {
    return "Hello";
  }
};

let dog = {
  getGreeting() {
    return "Woof";
  }
};

// 原型为 person
let friend = Object.create(person);
console.log(friend.getGreeting());                     // "Hello"
console.log(Object.getPrototypeOf(friend) === person); // true

// 原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); // "Woof"
console.log(Object.getPrototypeOf(friend) === dog); // true
```

2 使用super引用的 简单原型访问

S1 ES6引入了super，它是指向 当前对象的原型 的一个指针，它等于 `Object.getPrototypeOf(this)的值`
```js
let person = {
  getGreeting() {
    return "Hello";
  }
};

let dog = {
  getGreeting() {
    return "Woof";
  }
};

let friend = {
  getGreeting() {  //调用friend.getGreeting()方法，第一个this指向friend，第二个this指向friend的原型
    return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
  }
};

// 将原型设置为 person
Object.setPrototypeOf(friend, person);
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(Object.getPrototypeOf(friend) === person); // true

// 将原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); // "Woof, hi!"
console.log(Object.getPrototypeOf(friend) === dog); // true
```
用ES6表示为:
```js
let friend = {
  getGreeting() {
    // 这相当于上个例子中的：Object.getPrototypeOf(this).getGreeting.call(this)
    return super.getGreeting() + ", hi!";
  }
};
```

S2 可以用super 来调用 对象原型上的任何方法，但super 一定要是位于 简写的方法之内
```js
let friend = {
  getGreeting: function() {
    // 语法错误,因为未简写方法 
    return super.getGreeting() + ", hi!";
  }
};
```

S3 super可适用于多级继承
```js
let person = {
  getGreeting() {
    return "Hello";
  }
};

// 原型为 person
let friend = {
  getGreeting() {
    return super.getGreeting() + ", hi!";     //super指定的必然为person
  }
};
Object.setPrototypeOf(friend, person);


// 原型为 friend
let relative = Object.create(friend);


console.log(person.getGreeting()); // "Hello"
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(relative.getGreeting()); // "Hello, hi!"
```


## 八 正式的“方法”定义

1 ES6正式将方法定义为：一个拥有[[HomeObject]]内部属性的函数，此内部属性 指向该方法所属的对象
```js
let person = {
  // 方法
  getGreeting() {       //其[[HomeObject]] = person对象
    return "Hello";
  }
};

// 并非方法, 因为它不在一个对象的内部 + 因此也不存在[[HomeObject]]属性
function shareGreeting() {
  return "Hi!";
}
```

2 super引用的处理步骤:
S1 在[[HomeObject]]上调用Object.getPrototypeOf(), 来获取对原型的引用

S2 在该原型上 查找同名函数

S3 创建this绑定并调用该方法


```js
let person = {
  getGreeting() {
    return "Hello";
  }
};


let friend = {
  getGreeting() {                         //S1 [[HomeObject]]=friend, 而friend对象的原型是 person
    return super.getGreeting() + ", hi!"; //S2+S3, 就相当于 person.getGreeting.call(this)
  }
};

Object.setPrototypeOf(friend, person);   // 原型为 person


console.log(friend.getGreeting()); // "Hello, hi!"
```





## 参考文档

[01 深入理解ES6 第4章](https://book.douban.com/subject/27072230/)