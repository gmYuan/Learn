# 面向对象之 call+apply的模拟实现

目录:

1 [预读文档](#1)

2 [call作用介绍](#2)

3 [call/apply 模拟实现](#3)


## <span id="1"> 1 预读文档 </span>

1 [JS深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

2 [如何用js实现call或者apply的功能](https://www.zhihu.com/question/35787390)

阅读原因: 参考实现文档


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

S1 fn.call(A) == A.fn(), 即 指向函数 + 执行时让函数内部的this指向对象A

S2 所以，模拟call的思路是:  

```js
A.temp = fn      // A对象增加 fn方法   
A.temp()        // 执行fn()
delete A.temp   // 删除fn,避免影响到A原有状态 
```


## <span id="3"> 3 call/apply 模拟实现 </span>

1 Q: call模拟实现的难点有哪些

A: 

S1 A.temp = fn, 如何获取到fn  =>  `fn调用原型链上方法时，此时原型链方法内部的 this就指向fn`

S2 fn中执行时，如何获取到剩余的传入参数  => `ES6剩余参数/ ES3 eval方法`

S3 call不传入参数时，默认指向window  => `||替补情况`

S4 可以接收到fn的返回结果 =>  `return + fn的return`


2: Q: 手写出 call的模拟实现

A: S1 ES3的实现方法

```JS
Function.prototype.call2 = function(content) {
  let ctx = content || window
  ctx.temp = this

  let args = []
  for (let i=1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  let result = eval('ctx.temp(' + args + ')')

  delete ctx.temp
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
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

S2 ES6的实现方法

```js
Function.prototype.call2 = function(content, ...args){
  let ctx = content || window
  ctx.temp = this
  let result = ctx.temp(...args)

  delete ctx.temp
  return result
}
```