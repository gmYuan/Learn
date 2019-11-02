# 面向对象之 call+apply的模拟实现

目录:

1 [预读文档](#1)

2 [bind 作用介绍](#2)

3 [bind 模拟实现](#3)


## <span id="1"> 1 预读文档 </span>

1 [JS深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)

2 [MDN this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)


阅读原因: 参考实现文档


## <span id="2"> 2 bind作用介绍 </span>

1 Q: bind方法的 使用方法 和特点  是什么

A: S1 使用方法见下

```js

let Ex1 = fn.bind(A, v1)   // S1 bind返回的是(即EX1) 一个this指向A的 fn的副本

// S2 使用方法1:
Ex1(v2, v3 ...)   // S2 bind可以分次传入参数

// S3 使用方法2:
let obj1 = new EX1(v2, v3)   // S3可以用new调用，此时EX1内部的this指向的 obj1, 而非A 
```


## <span id="3"> 3 bind 模拟实现 </span>

1 Q: bind模拟实现的难点有哪些

A: 

S1 bind只能被函数调用，如何判断当前调用bind的值 + 值类型  =>  `原型链this指向 + typeof`

S2 bind可以返回fn的返回值  =>  `return函数 + 函数return值, 即 2层return`

S3 bind可以分次传入参数  =>  `args1.concat(agrs2)`

S4.1 bind的函数被new调用时，this指向实例  =>  `函数内部this + instanceof`

S4.2 bind的函数被new调用时，obj1 继承了EX1  =>  `原型对象赋值`



2: Q: 手写出 bind的模拟实现

A: S1 ES3的实现方法

```JS
Function.prototype.bind2 = function(ctx) {
  if (typeof this !== "function") {
    throw new Error('调用bind2必须要是函数类型')
  }
  
  let self = this
  let args1 = Array.prototype.slice.call(arguments, 1)  // 从1开始截取，去掉第一个参数ctx

  let fBind = function() {
    let args2 = Array.prototype.slice.call(arguments)   // 内部的arguments 和外层的不是同一个对象
    return self.call(this instanceof fBind ? this : ctx, args1.concat(args2))  // new调用时，函数this指向实例
  }

  let fNOP = function() {}
  fNOP.prototype = self.prototype   // 外部的this指向的是 fn
  fBind.prototype = new fNOP()        // 继承而不污染fn的原型对象:  临时函数 + new实例

  return fBind
}
```