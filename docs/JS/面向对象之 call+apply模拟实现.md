# 面向对象之 call+apply的模拟实现

目录:

1 [预读文档](#1)

2 [call作用介绍](#2)

3 [call/apply 模拟实现](#3)


## <span id="1"> 1 预读文档 </span>

01 [JS深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

02 [初、中级前端应该要掌握的手写代码实现](https://juejin.im/post/5e24590ef265da3e152d27bc#heading-0)

03 [为什么 call 比 apply 快](https://juejin.im/post/59c0e13b5188257e7a428a83)

阅读原因: 直接参考文档


## <span id="2"> 2 call作用介绍 </span>

1 Q: 函数内部的this 有什么作用

A: 先看下示例代码

```js
function fn() {
  console.log(this.value)
}

A = { value: 12 }

fn.call(A)   // 12
```

S1 函数内部有this属性 + this必然指向一个对象  =>  函数可以(通过this)指向对象，从而访问对象中的属性和方法

S2 即 `this可以让一个对象(函数也是对象), 高效复用另一个对象的 属性/方法`


2 Q: call的作用是什么

A:

S1 fn.call(A) == A.fn(), 即 执行函数 + 执行时让函数内部的this指向对象A

S2 所以，模拟call的思路是:  

```js
A.temp = fn      // A对象增加 fn方法
A.temp()        // 执行fn()
delete A.temp   // 删除fn,避免影响到A原有状态
```


## <span id="3"> 3 call/apply 模拟实现 </span>

Q1: 手写出 call的模拟实现

A:

S1 ES6 实现方法

```js
Function.prototype.call2 = function(context, ...args){  //S0 取到剩余的传入参数
  let ctx = Object(context) || window  // S1 this为null时, 默认指向window
  ctx.fn = this     // S2 fn调用原型链上方法时，此时原型链方法内部的 this就指向fn
  const result = ctx.fn(...args)  // S3 fn可能会有返回值

  delete ctx.fn
  return result
}


// 测试一下
var value = 2;
var obj = {value: 1}

function bar(name, age) {
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age
  }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

S2 ES3的实现方法，了解即可

```JS
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

Q2: 手写出 apply的模拟实现

A:

```JS

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