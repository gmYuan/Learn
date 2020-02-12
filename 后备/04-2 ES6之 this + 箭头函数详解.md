# ES6之 this + 箭头函数详解

目录:

1 [预读文档](#1)

2 [什么是this](#2) 

3 [为什么要有this](#3)

4 [this指向规则](#4)

5 [箭头函数其他特点](#5)
 

## <span id="1"> 1 预读文档 </span>

1 [阮一峰— this关键字](http://javascript.ruanyifeng.com/oop/this.html)

2 [MDN— this关键词](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

3 [掘金— this、apply、call、bind](https://juejin.im/post/59bfe84351882531b730bac2)

阅读原因: 全面介绍了this的相关知识和易错点


4 [冴羽—— ES6系列之 箭头函数](https://github.com/mqyqingfeng/Blog/issues/85)

5 [什么时候不能使用箭头函数](https://juejin.im/post/58fda157570c350058e6afb8)

阅读原因: 箭头函数相关知识点介绍


## <span id="2"> 2 什么是this </span>

1 Q: 什么是this

A: S1 this是函数执行上下文中指向的 一个对象

S2 不同的函数调用方法，this指向的对象也不同


## <span id="3"> 3 为什么要有this </span>

1 Q: 为什么要有this

A: S1 为了实现函数方法的复用, 举例:

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


## <span id="4"> 4 this指向规则 </span>

1 Q: this指向对象 有哪些常见情况

A: S1 全局环境 + 非严格模式: this指向 window对象;  全局环境 + 严格模式: this指向 undefined

这种情况，可以理解成 `test.call(undefined)`

```js
this.b = 'test'
console.log(this.b === window.b)    //ture

function test(){
  console.log(this)
}
test()   //window
```

S2 函数作为对象方法调用: this指向 该对象

这种情况，可以理解成 `obj.getName.call(obj)`

```js
var obj = {
  name: 'klay',
  getName: function(){
    console.log(this.name)
  }
}
obj.getName()    //klay

```

特殊情况1: 函数作为嵌套对象 内部的方法调用: this指向 内部对象,  可以理解成 `obj1.obj2.getName.call(obj2)`

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

特殊情况2: 函数作为数组成员调用: this指向 该数组对象 (因为数组是特殊的对象)
```js
function fn1(){
  console.log(this)
}
var fn2,fn3

var arr = [fn1,fn2,fn3]
arr[0]()                 //arr
```

特殊情况3: 对象方法赋值给一个函数A，调用函数A时，this指向window
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

特殊情况4: 对象方法和运算符（布尔/算数/赋值等）一起使用，this对象指向全局对象
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

特殊情况5: 对象里的函数A含有函数B，函数B执行时，B内部的this 指向window对象
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

特殊情况6: 回调函数A中 传入的函数B内部使用this, this会被修改成 window对象/DOM元素等

类似的还有内置函数的回调，如`setTimeout()、foreach()、事件监听回调函数`等

```js
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

doFoo(obj1.foo)    //"global"
```

特殊情况7: 原型链和 getter/setter中的 this，都指向调用方法的对象（具体见MDN）


S3 函数调用时显式绑定指向对象(call/apply/bind): 此时this指向 传入的对象

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
bar.call(window)   //2  因为bar函数内部 已经手动固定指向了obj1对象, 不会再改变
```


S4 使用new创建对象实例时，this指向新创建的对象实例

```js
function Foo(a){
  this.a = a
}

var bar = new Foo(2)
console.log(bar.a)     //2
```

以上4种情况的优先级是: `new构造函数 > 显式调用 > 默认对象调用 > 全局（函数）调用`


S5 使用箭头函数，其this 就是  外层函数调用时的this指向对象

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
bar.call(obj2)           //1,不是2!, 因为 箭头函数的this 继承自foo()第一次调用时的this指向对象
```


## <span id="5"> 5 箭头函数其他特点 </span>

1 Q: 箭头函数和 ES5函数有哪些不同点

A:
S1 箭头函数 没有this / super / arguments, 也没有new.target绑定, 所以这些值的查找规则 遵循词法作用域

S2 箭头函数不能使用new调用: 箭头函数没有 [[Construct]]方法，因此不能被用为构造函数, 使用new  调用箭头函数会报错

S3 箭头函数没有原型: 也就是没有prototype属性

S4 箭头函数不能更改this, 因此虽然可以使用call/apply/bind方法，但this值不会发生改变

S5 箭头函数 不允许重复的具名参数: 传统函数只有在严格模式下才禁止这种重复