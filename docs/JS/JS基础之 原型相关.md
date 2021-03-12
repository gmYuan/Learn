## JS基础之 原型相关

##  一  原型与原型链

1 Q: 什么是原型
A:
S1 原型可以近似理解为 是一个对象的 "父对象"
S2 实例对象c 可以读取原型对象A上 实现的属性和方法

用代码表示为:
```js
function Person() {         // 构造函数: Person
  ......
}

let person = new Person()     // 实例对象: person

console.log(person.__proto__ === Person.prototype)                 // true
console.log(Person.prototype.constructor === Person)               // true

// Object.getPrototypeOf方法,可以获得实例对象的 原型对象
console.log(Object.getPrototypeOf(person) === Person.prototype)   // true
```
关系图见下表示
![原型 关系图](https://user-gold-cdn.xitu.io/2019/2/18/16900719b16c78f7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


2 Q: 什么是原型链
A: 
S1.1 `一层一层的链表结构的 原型对象`
S1.2 原型链的顶层对象是Object.prototype, 即: `Object.prototype.__proto__ 为 null`
S1.3 通过原型链，可以实现属性的共享和继承

S2 原型链的属性查找机制: 会依次在 实例对象-> 原型对象A-> A.__proto_/ Object.prototype 中查找属性

S3 原型链的属性修改机制: 只会在实例对象上 进行修改，如果属性不存在，则新建它

```js
function Parent(age) {
  this.age = age
}
var p = new Parent(50)

p	                                                     // Parent {age: 50}
p.__proto__ === Parent.prototype        //  true
p.__proto__.__proto__ === Object.prototype     // true
p.__proto__.__proto__.__proto__ === null         // true
```
一张经典图理解为:
![PSHSEj.jpg](https://s1.ax1x.com/2018/06/21/PSHSEj.jpg)


3 Q: 如何实现 instanceof

```js
//原理:  递归更新 src.__proto__
function mockInstanceof(left, right) {
  let src = left.__proto__
  let target = right.prototype
  while(true) {
    if (src == null) return false;
    if (src === target) return true;
    src = src.__proto__
  }
}
```


4 Q: JS中有哪些方法可以 实现继承
A: 
S1 方法1: 原型链继承: `child.pty = new Parent()`
```js
function Parent() {
  this.prices = [20, 40]
}
Parent.prototype.showPrice = function() {
  console.log(this.prices)
}

function Child() {}
Child.prototype = new Parent()

let ex1 = new Child()   // ex1.__ptoto__ ==> Child.pty / parent实例 obj: {prices} ==> Parent.pty
let ex2 = new Child()

ex1.prices.push(60)
ex2.showPrice()  // [20, 40, 60]

// 缺点:  child原型上的内容 被Parent构造函数污染, Parent内引用类型的属性 会被所有Child实例共享
```

S2 方法2:  借用构造函数/经典继承: `child构造函数内 parent.call(xxx)`
```js
function Parent () {
  this.ages = [1, 2]
}

function Child () {
  Parent.call(this)
}

var child1 = new Child()
child1.names.push(3)
console.log(child1.ages)    // [1, 2, 3]

var child2 = new Child()
console.log(child2.ages)   // [1, 2]

// 缺点:  只能继承父类的实例属性和方法，不能继承原型属性/方法 +  每次创建实例都会 执行一次Parent的构造函数
```

S3 方法3: 组合继承: `child.pro = new Parent +  Parent.call(this)`
```js
function Parent(name) {
  this.name = name
  this.prices = [1,3]
}
Parent.prototype.getName = function() {
  console.log(this.name)
}

function Child(name) {
  Parent.call(this, name)
}
Child.prototype = new Parent()    // Child.pty === {name, ages},  Child.pty.__proto__ ===  Parent.prototype
Child.prototype.constructor = Child;

let ex1 = new Child('name1')
let ex2 = new Child('name2')
ex1.prices.push(5)

console.log(ex1)    // {prices: [1, 3, 5],  name: "name1"}
console.log(ex2)    // {prices: [1, 3],  name: "name2"}
ex1.getName()       // name1

// 缺点: 子类实例 和 子类原型对象上 都会调用一次父类方法,  实例和原型对象上存在同名属性
```

S4 方法4: 原型式继承: `object.create的模拟实现`
```js
function createObj(parentObj) {
  function child() {}
  child.prototype = parentObj
  return new child()
}

let p1 = {name: 'test', prices: [2,4]}
let ex1 = createObj(p1)
let ex2 = createObj(p1)

ex1.prices.push(6)
console.log(ex1.prices)   // [2,4,6]
console.log(ex2.prices)  // [2,4,6]

// 缺点: 同原型链继承，引用类型值会被 实例共享
```

S5 方法5: 寄生式继承: 
```js
function createObj (parentObj) {
  var clone = Object.create(parentObj)
  clone.sayName = function () {
    console.log('hi')
  }
  return clone
}

// 缺点：同原型链继承，引用类型值会被 实例共享
```

S6 方法6: 寄生组合式继承: `Parent.call(this) + 原型对象上的 原型式继承`
```js
function Parent(name) {
  this.name = name
  this.ages = [2,3]
}
Parent.prototype.getName = function() {
  console.log(this.name)
}

function Child(name) {
  Parent.call(this, name)
}
let temp = function(){}
temp.prototype = Parent.prototype
Child.prototype = new temp()       // 不会再次执行Parent一次

let ex1 = new Child('name1')  
let ex2 = new Child('name2')
ex1.ages.push(4)

console.log(ex1)    // { ages: [2, 3, 4],  name: "name1" }
console.log(ex2)   // { ages: [2, 3],  name: "name2" }
ex1.getName()      // name1
```

ES6 Class的写法见下
```js
class Parent{
  constructor(name){
    this.name = name
  }
  getName() {
    console.log(this.name)  
  }
}

class Child extends Parent{
  constructor(name){
    super(name)               // super关键字作用: 调用继承 父类的实例属性/方法
    this.age = 20
  }
  playgame(){
    console.log('Men like playing games')
  }
}
```

ES5继承 和 ES6继承的区别: 
S1 ES5的继承 是先创建子类的实例对象，然后再把父类的方法添加到this上（Parent.call(this);
    ES6的继承 是先创建父类的实例对象this，然后再用子类的构造函数 修改this
    因为子类没有自己的this对象，所以必须先调用父类的super()方法，否则新建实例 会报错

S2 ES6有静态方法，可以被子类继承；而ES5则没有静态方法被继承;
S3 ES6中父类原型上的属性和方法不会被for...in遍历到，而ES5的继承可以被遍历到


##  二  this相关

1 Q: 什么是this
A:
S1 this是函数执行上下文中 的一个指针对象
S2 this指向的对象，只有在 函数执行时才能确定 (箭头函数除外)

2 Q: this的指向规则是什么
A:

S1 默认绑定: this执行 window/undefined (严格模式下)
```js
// 例1- call/apply中传入null时  ==> 相当于传入window/ undefined (严格模式下)
var foo = {
  name: 'name1'
}
var name = 'windowName' 
function bar() {
  console.log(this.name) 
}
bar.call(null) //windowName

// 例2- 严格模式下，函数直接执行时 this指向undefined
"use strict";
var a = 10;
function foo () {
  console.log('this1', this)
  console.log(window.a)
  console.log(this.a)
}
console.log('this2', this)   // 'this2'  Window{...}
foo()   // 'this1' undefined  +  10  +  Uncaught TypeError: Cannot read property 'a' of undefined

// 例3- 严格模式只是对所属的函数作用域 有限制
function foo() {
  console.log( this.a );
}
var a = 2;
(function(){
  "use strict";
  foo();
})();

// 结果为2
```


S2 隐式绑定: this指向最后调用函数的 对象
```js
// 例1 对象嵌套
function naming(){
  console.log(this.name)
}
var obj1 = {
  name:'klay',
  getName: naming,
  obj2:{
    name:'inner',
    getName: naming
  }
}
obj1.obj2.getName()    //inner

// 例2 数组是特殊的对象
function fn1(){
  console.log(this)
}
var fn2,fn3
var arr = [fn1,fn2,fn3]
arr[0]()                 //arr

// 隐式绑定丢失例1- 对象方法被 变了赋值:    本质上是重新进行了函数赋值操作，导致直接调用了函数 ==> 默认绑定规则
var name = 'outer'
var obj1 = {
  name:'klay',
  getName(){
    console.log(this.name)
  }
}
var outer = obj1.getName
outer()                   //outer

// 隐式绑定丢失例2- 对象方法作为回调函数: 函数传参本质上还是赋值 fn = obj.foo
var a = 'global'
var obj1 = {
  a:2,
  foo(){
    console.log(this.a)
  }
}
function doFoo(fn){
  fn()
}
doFoo(obj1.foo)    // "global"

// 隐式绑定丢失例3- 定时器相关:  本质上还是赋值 setTimeout(fn ,delay) +  fn = obj.foo
function sayHi(){
  console.log('Hello,', this.name);
}
var person1 = {
  name: 'name1',
  sayHi(){
    setTimeout(function(){
      console.log('Hello,',this.name);
    })
  }
}
var person2 = {
  name: 'name2',
  sayHi: sayHi
}

var name='windowName'
person1.sayHi()                           // Hello windowName
setTimeout(person2.sayHi,100)     // Hello windowName
setTimeout(function(){                 // Hello name2
    person2.sayHi();
},200)
```


S3 显式绑定: this指向 call/apply/bind传入的 上下文对象
```js

// 例1- 显式绑定对象 内部回调函数 this丢失:  本质上是2个函数执行是互相独立的
function sayHi(){
  console.log('Hello,', this.name);
}
var person = {
  name: 'name1',
  sayHi: sayHi
}
var name = 'windowName';
var Hi = function(fn) {
  console.log(this)           // person{name:xx, ...}
  fn()
}
Hi.call(person, person.sayHi)   //  Hello, windowName
```


S4 new绑定:  this指向 新创建的对象实例
```js
function Person (name) {
  this.name = name
}
var name = 'window'
var person1 = new Person('name1')
console.log(person1.name)  // name1
```

S5 使用箭头函数，其this 就是  父函数调用后的 this指向对象
箭头函数没有this, 箭头函数的this值 `遵循词法作用域的查找规则（就像是一个普通变量）`

```js
function foo(){
  return ()=>{
    console.log(this.a)   
  }
}
var obj1 = {a:1};
var obj2 = {a:2};
var bar = foo.call(obj1)
bar.call(obj2)           //1,不是2!, 因为 箭头函数的this 继承自外层函数foo 调用时的this指向对象，即 obj1
```


综合题目练习
```js
// 题目1
var number = 5;
var obj = {
  number: 3,
  fn: (function () {
    var number;
    this.number *= 2;
    number = number * 2;
    number = 3;
    return function () {
      var num = this.number;
      this.number *= 2;
      console.log(num);
      number *= 3;
      console.log(number);
    }
  })()
}

var myFun = obj.fn
myFun.call(null)
obj.fn()
console.log(window.number)

// 结果为 10, 9,  3, 27,  20

//S1  obj.fn为自执行函数，执行后结果为 ==>
//     window: { number: 5->10 }  +  obj: { number: 3, fn: { number: undefined -> NaN -> 3,  匿名函数体}

// S2 myFun.call(null)  执行后结果为 ==> 
//     window: { number: 10->20 }  +  obj: { number: 3, fn: { number: 3->9,  匿名函数体: {num: 10}    }

// S3 obj.fn()  执行后结果为 ==> 
//     window: { number: 20 }  +  obj: { number: 3->6 , fn: { number: 9-> 27,  匿名函数体: {num: 3}    }


// 题目2
var name = 'window'
function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()()                       // window 
person1.obj.foo1.call(person2)()      // window
person1.obj.foo1().call(person2)      // person2

person2.obj.foo2()()               // obj, person1.obj.foo2()执行时内部obj指向obj，所以执行内部 箭头函数时，this为obj
person2.obj.foo2.call(person2)()      // person2
person2.obj.foo2().call(person2)     //  obj
```


##  三  call/apply/bind相关

1 Q: 如何实现call
A:
S1 fn.call(A) == A.fn(), 即 执行函数 + 执行时让函数内部的this指向对象A
S2 所以，模拟call的思路是:  
```js
A.temp = fn      // A对象增加 fn方法
A.temp(...args)        // 执行fn()
delete A.temp   // 删除fn,避免影响到A原有状态
```

具体实现如下
```js
// ES6实现
Function.prototype.call2 = function(ctx, ...args){  //S0 取到剩余的传入参数
  ctx = Object(ctx) || window  // S1 兼容传入的第一个值不是引用类型 + this为null时, 默认指向window
  ctx.fn = this     // S2 fn调用原型链上方法时，此时原型链方法内部的 this就指向fn
  const result = ctx.fn(...args)  // S3 fn可能会有返回值

  delete ctx.fn
  return result
}

// ES3实现，了解即可
Function.prototype.call2 = function(context) {
  let ctx = Object(context) || window
  ctx.fn = this

  let args = []
  for (let i=1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  let result = eval('ctx.fn(' + args + ')')

  delete ctx.fn
  return result
}
```

2 Q: 如何实现apply
A: 基本和call一致，只是第二个参数是可选的 数组/类数组对象
```js
Function.prototype.apply = function (context, args) {
  let ctx = Object(context) || window
  ctx.fn = this

  // S1 apply的第二个传入参数 是可选的 数组/类数组对象
  const result = args ? ctx.fn(...args) : ctx.fn(args)

  delete ctx.fn
  return result
}
```

Q3: call 和 apply 哪个性能更好
A:
call的性能更好，因为 apply的第二个参数可以是类数组对象，所以多了很多参数判断的逻辑

Q4: 如何实现bind
A:
```js
let bound = fn.bind(A, v1)   // S1 bind返回的是(即bound) 一个this指向A的 fn的副本
// S2 使用方法1:
bound(v2, v3 ...)   // S2 bind可以分次传入参数, 再执行函数
// S3 使用方法2:
let obj1 = new bound(v2, v3)   // S3可以用new调用，此时bound内部的this指向的 obj1, 而非A 


//具体实现
// S1 只能是函数才能调用 bind
// S2 bind第一次调用，返回的值是一个闭包函数，该函数接收2次调用分别传入的参数
// S3 当用new bound()调用时， bound内部的this 指向一个新对象a,且 a.__proto__ === bound.pty  (即 this instanceof bound)

Function.prototype.bind2= function(ctx, ...args) {
  if (typeof this !== 'function') {
    throw new Error('必须是函数才能调用bind2')
  }
  
  // 外层的this指向的是调用函数 (原型链上的this指向)
  const fn = this
  let bound = function (...args2) {
    let allArgs = [...args, ...args2]
    // 内层的this看bound如何被调用
    return fn.apply(this instanceof bound ? this : ctx, allArgs)
  }

  // 继承关系为 obj1.__proto__ = bound.pty  +  bound.pty 约等于 fn.pty
  bound.prototype = Object.create(fn.prototype)
  return bound    
}
```

Q5: new的实现原理
A: 
```js
let ex1 = new Fn()
// S1: 创建一个新对象obj, obj可以访问Fn.prototype的属性/方法  (即obj.__proto__ = Fn.prototype)
// S2: 执行Fn(),其内部this指向 obj
// S3: 判断Fn有无返回值:  有返回值(引用类型且不为null)则返回 Fn的返回值;  无返回值则返回 obj

function mockNew(fn, ...args) {
  if (typeof fn !== 'function' ) {
    throw new Error('error')
  }
  const obj = Object.create(fn.prototype)   // 相当于  var obj = {} + obj.__proto__ = fn.prototype;
  const result = fn.apply(obj, args)

  retrun (typeof result === "object" ? result||obj : obj)
}

// 典型题目
function Page() {
  return this.hosts
}
Page.hosts = ['h1']
Page.prototype.hosts = ['h2']

const p1 = new Page()   // Page.apply({Object.create(Page.pty) ..args) => return ['h2'] 是一个对象
const p2 = Page()        // 寻找window.hosts，返回值是 undefined

console.log(p1.hosts)     // ['h2'].hosts = undefined
console.log(p2.hosts)    // 报错
```


##  参考文档

01 [JS深入之 从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)
02 [JS深入之 继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)
03 [es5 类和es6中class的区别](https://juejin.cn/post/6891634002563629063)

04 [嗨，你真的懂this吗](https://juejin.cn/post/6844903805587619854)

05 [JS深入之 call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)
06 [为什么 call 比 apply 快](https://juejin.im/post/59c0e13b5188257e7a428a83)
07 [JS深入之 bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)

08 [JS深入之 new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)




