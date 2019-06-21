# ES6之 new.target详解

## 一 前言

最近学习了new.target相关知识，所以对其做一个小结。

## 二 函数的双重用途

1 在ES5前，函数根据是否用new调用 而有双重用途:
```js
function Person(name) {
  this.name = name;
}

var person = new Person("Nicholas");
var notAPerson = Person("Nicholas");

console.log(person); // "[Object object]",返回一个新对象
console.log(notAPerson); // "undefined"，未指定时默认返回undefined + this指向window
```

2 ES6中，在函数内部新增了[[Call]]和[[Construct]]内部方法，用以区分函数调用方式
S1 当不使用new调用时: 函数内部调用[[Call]]方法，运行函数体;

S2 当使用new调用时: 函数调用[[Construct]]方法，创建新对象+this指向新对象+执行函数体
   有  [[Construct]]方法的函数 称为构造器;

S3 并非所有函数都有[[Construct]]方法(如箭头函数)，因此不是所有函数都可以用new去调用


## 三 ES5中判断 函数如何被调用

1 在ES5中，一般是使用instanceof来判断 函数是否使用new来调用:
```js
function Person(name) {
  if (this instanceof Person) {
    this.name = name; // 使用 new
  } else {
    throw new Error("You must use new with Person.")
  }
}

var person = new Person("Nicholas");
var notAPerson = Person("Nicholas");   // 抛出错误
```

2 以上方法的缺点是: 当使用call/bind方法执行this的指向时，该方法无法正确区分是否使用new调用
```js
function Person(name) {
  if (this instanceof Person) {
    this.name = name; // 使用 new
  } else {
    throw new Error("You must use new with Person.")
  }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael"); // 指定this值为person
```


## 四 new.target元属性

1 ES6引入了new.target元属性，用以区分函数是否使用new来调用;

2 当函数的[[Construct]]方法被调用时，new.target的值是this指向实例的构造器;
  而当 [[Call]]被执行，new.target的值是 undefined

```js
function Person(name) {
  if (typeof new.target !== "undefined") {
    this.name = name; // 使用 new
  } else {
    throw new Error("You must use new with Person.")
  }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael");   //出错
```

3 可以用new.target来判断 函数调用是否使用了 特定构造器
```js
function Person(name) {
  if (new.target === Person) {
    this.name = name; // 使用 new
  } else {
    throw new Error("You must use new with Person.")
  }
}

function AnotherPerson(name) {
  Person.call(this, name);      //调用Person时并未使用new.target，因此值为undefined
}


var person = new Person("Nicholas");
var anotherPerson = new AnotherPerson("Nicholas"); // 出错！
```



## 参考文档

[01 深入理解ES6 P59-61](https://book.douban.com/subject/27072230/)