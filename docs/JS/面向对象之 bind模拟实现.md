# 面向对象之 bind的模拟实现

目录:

1 [预读文档](#1)

2 [bind 作用介绍](#2)

3 [bind 模拟实现](#3)


## <span id="1"> 1 预读文档 </span>

01 [JS深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)

02 [初、中级前端应该要掌握的手写代码实现](https://juejin.im/post/5e24590ef265da3e152d27bc)

阅读原因: 直接参考文档


## <span id="2"> 2 bind作用介绍 </span>

1 Q: bind方法的 使用方法 和特点  是什么

A: S1 使用方法见下

```js

let Ex1 = fn.bind(A, v1)   // S1 bind返回的是(即EX1) 一个this指向A的 fn的副本

// S2 使用方法1:
Ex1(v2, v3 ...)   // S2 bind可以分次传入参数, 再执行函数

// S3 使用方法2:
let obj1 = new EX1(v2, v3)   // S3可以用new调用，此时EX1内部的this指向的 obj1, 而非A 
```


## <span id="3"> 3 bind 模拟实现 </span>

Q1: 手写出 bind的模拟实现

A:

```JS
Function.prototype.bind2 = function(ctx, ...args) {
  if (typeof this !== "function") {     // S1 bind只能被函数调用, this即调用的 函数对象
    throw new Error('调用bind2必须要是函数类型')
  }
  
  const fn = this

  let bindFn = function(...args2) {
    let res = [...args, ...args2]  //S2 bind可以分次传入参数

    // S3 bind可以返回 内部bindFn的返回值 + S4 fn的this的指向值 为传入值/new 的新对象实例
    return fn.apply(this instanceof bindFn ? this : ctx, res)

  }

  bindFn.prototype = Object.create(fn.prototype)  // S5 new生成的对象实例，其父类是 fn

  /* Object.create的功能，相当于:
    let fNOP = function() {}
    fNOP.prototype = fn.prototype
    bindFn.prototype = new fNOP()  
  */

  return bindFn
}
```