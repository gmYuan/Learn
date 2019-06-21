# 面向对象之 this 

目录:

1 [预读文档](#1)

2 [什么是this](#2) 

3 [为什么要有this](#3)

4 [this指向规则](#4)
 
  - [4.1 全局环境](#4.1)

  - [4.2 对象方法](#4.2)

  - [4.3 call/apply/bind显式绑定](#4.3)

  - [4.4 new实例对象](#4.4)

  - [4.5 箭头函数](#4.5)

  

## <span id="1"> 1 预读文档 </span>

1 [阮一峰— this关键字](http://javascript.ruanyifeng.com/oop/this.html)

阅读原因: 初步介绍了this的相关知识

2 [MDN— this关键词](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

阅读原因: 介绍了this的一些易错点

3 [JS深入系列之 从ECMAScript规范解读this](https://github.com/mqyqingfeng/Blog/issues/7)

阅读原因: 从规范角度解读了this的指向规则

4 [掘金— this、apply、call、bind](https://juejin.im/post/59bfe84351882531b730bac2)

阅读原因: 很全面的this情况介绍，比较易懂




## <span id="2">2 什么是this </span>

1 Q: 什么是this

A: S0 函数执行上下文中的 一个对象指针

S1 每个可执行代码(简略理解为 全局代码+函数)在调用时，都会创建一个 上下文对象

S2 每个执行上下文对象，都有3个属性对象: 活动对象、作用域链、this

S3 this指向一个对象，根据函数不同的调用方法，this指向的对象也不同


## <span id="3">3 为什么要有this </span>

1 Q: 为什么要有this

A: S0 便于实现函数复用

S1 因为this可以指向不同的对象，所以通过this，就可以实现函数的复用

S2 举个例子,见下:

```js
function eating(){            // 创建一个eating函数,内部使用了this
  console.log(this.name + ' is eating')
}

// S2.1 有一个人想执行eating()方法，他可以这样实现
let person1 = {
  name: 'klay',
  age: 20,
  eat: eating
}

person1.eat()   // 输出'klay is eating'


// S2.2 如果有另一个人也想执行eating()方法，那么他可以如下实现
let person2 = {
  name: 'teddy',
  age: 21,
  eat: eating
}

person2.eat()   // 输出'teddy is eating'
```


## <span id="4">4 this指向规则 </span>

1 Q: 因为this根据函数调用情况的不同，会指向不同的对象，那么它的具体指向规则都有哪些

A: S0 具体规则见下文


### <span id="4.1">4.1 全局环境 </span>

1.1 全局环境 + 非严格模式: this指向 window对象

1.2 全局环境 + 严格模式:   this指向 undefined

2 举例:

```js
this.b = 'test'
console.log(this.b === window.b)    //ture

function test(){
  console.log(this)
}
test()   //window
```

3 这种情况，可以理解成 `test.call(undefined)`


### <span id="4.2">4.2 对象方法 </span>

1 函数作为对象方法调用: this指向 该对象

2 举例: 

```js
var obj = {
  name: 'klay',
  getName: function(){
    console.log(this.name)
  }
}
obj.getName()    //klay

```

3 这种情况，可以理解成 `obj.getName.call(obj)`


4.1 特殊情况1: 函数作为嵌套对象 内部的方法调用: this指向 内部对象
```js
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
```

4.2 特殊情况2: 函数作为数组成员调用: this指向 该数组对象 (因为数组是特殊的对象)
```js
function fn1(){
  console.log(this)
}
var fn2,fn3

var arr = [fn1,fn2,fn3]
arr[0]()                 //arr
```

4.3 特殊情况3: 对象方法赋值给一个函数A，调用函数A时，this指向window
```js
var name = 'outer'
var obj1 = {
  name:'klay',
  getName: function(){
    console.log(this.name)
  }
}

var outer = obj1.getName
outer()                   //outer
```

4.4 特殊情况4: 对象方法和运算符（布尔/算数/赋值等）一起使用，this对象指向全局对象
```js
var obj = {
  foo: function(){
    console.log(this)
  }
}

(false || obj.foo)()    //window
(obj.foo, obj.foo)()    //window
(obj.foo = obj.foo)()   //window
```

4.5 特殊情况5: 对象里的函数A含有函数B，函数B执行时，B内部的this 指向window对象
```js
var obj1 = {
  f1: function(){
    console.log(this)
    var f2 = function(){
      console.log(this)
    }()
  }
}

obj1.f1()             //obj1   window
```

4.6 特殊情况6: 回调函数A中 传入的函数B内部使用this, this会被修改成 window对象/DOM元素等

类似的还有内置函数的回调，如`setTimeout()、foreach()、事件监听回调函数`等

```js
var a = 'global'
var obj1 = {
  a:2,
  foo: function(){
    console.log(this.a)
  }
}

function doFoo(fn){
  fn()
}

doFoo(obj1.foo)    //"global"
```

4.7 特殊情况7: 原型链和 getter/setter中的 this，都指向调用方法的对象（具体见MDN）


### <span id="4.3">4.3 call/apply/bind显式绑定 </span>

1 函数调用时显式绑定指向对象(call/apply/bind): 此时this指向 传入的对象

2 举例:

```js
function foo(){
  console.log(this.a)
}

var obj1 = {
  a:2
}

var bar = function(){
  foo.call(obj1)
}

bar()              //2
bar.call(window)   //2  因为bar函数内部 已经手动固定指向了obj1对象
```


### <span id="4.4">4.4 new实例对象 </span>

1 使用new创建对象实例时，this指向新创建的对象实例

2 举例:
```js
function Foo(a){
  this.a = a
}

var bar = new Foo(2)
console.log(bar.a)     //2
```

以上4种情况的优先级是: `new构造函数 > 显式调用 > 默认对象调用 > 全局（函数）调用`


### <span id="4.5"> 4.5 箭头函数 </span>

1 使用箭头函数，其this 就是  外层函数调用时的this指向对象

2 箭头函数没有this, 它只会从自己的 上一层作用域链中 继承this

换言之，箭头函数的this值 `遵循词法作用域的查找规则（就像是一个普通变量）`

3 箭头函数的绑定无法被修改，见下例：

```js
function foo(){
  return ()=>{
    console.log(this.a)   
  }
}

var obj1 = {a:1};
var obj2 = {a:2};

var bar = foo.call(obj1)
bar.call(obj2)           //1,不是2!, 因为 箭头函数的this 继承自foo()第一次调用时的this指向对象
```



