# ES6之 generator详解

目录:

1 [预读文档](#1)

2 [生成器 使用特性](#2)

3 [生成器 自动执行](#3)


## <span id="1"> 1 预读文档 </span>

1 [Generator 函数的语法](http://es6.ruanyifeng.com/#docs/generator)

2 [ES6 系列之 Generator 的自动执行](https://github.com/mqyqingfeng/Blog/issues/99)

阅读原因: 直接参考文档


## <span id="2"> 2 生成器 使用特性 </span>

1 Q: 什么是生成器, 有什么作用

A: S1 Generator 是一个可以 返回迭代器的 特殊函数，它可以用来 控制异步流程;

S2 通过 yield关键字+next()方法 来控制 生成器的状态切换;



2 Q: generator使用特性 有哪些

A: S1 返回的是 一个迭代器对象g: { next() {value: xxx, done: xxx } } ==> for..of/扩展运算符

S2 g.next(p1)每次都会执行内代码 直到yield语句处 + p1参数值就是yield语句返回值

S3 g.throw(xx)的报错 可以被内外 try...catch语句捕获到

S4 g.return(xx) 会让 迭代器终止

S5 yield* YYY 相当于 for..of遍历执行YYY里的 [Symbol.Iterator]接口


## <span id="3"> 3生成器 自动执行 </span>

1 Q: 如何让 生成器可以自动执行 异步流程

A: S1 方法一: 基于Promise的 Generator自动执行器:

```js
function run(generator) {
  let gen = generator()  //S1 启动迭代器

  function next(data) {
    let ret = gen.next(data)    //S2 返回的是迭代器 {value: Promsie对象,  done: xxx}

    if (ret.done) return;

    ret.value.then(function(data) {  // S3 data是上一次yield的 异步操作的  返回值
      next(data)  // 把值传入生成器内部，再次调用 gen.next(), 执行到下一次的 yield语句暂停处
    })

  }

  next()

}
```

S2 方法二: 基于Thunk函数的 Generator自动执行器

```js

function run(generator) {
  let gen = generator()  //S1 启动迭代器

  function next(data) {
    let ret = gen.next(data)    //S2 返回的是迭代器 {value: Thunk函数,  done: xxx}

    if (ret.done) return;
  
    ret.value(next)  // S3 next接收的data参数, 就是上一次的 异步执行的结果
  }

  next()

}
```

S3 方法三: Co通用版本的 Generator自动执行器

```js

function run(gen) {
  let gen = gen()   // S1 启动生成器, 返回一个迭代器对象 {next() {...} }

  return new Promise(function(resolve, reject) {  // S1 返回一个Promsie: 可以使后续获取到 gen的结果值
    function next(data) {
      try {  // S2 错误捕获, 防止yield处 的异步操作 执行错误
        let ret = gen.next(data)  // S3 ret是 当前状态:  {value: Promise/Thunk函数, done: xxx}
      } catch (e) {
        return reject(e)
      }

      if (ret.done) return resolve(ret.value)


      let value = toPromise(ret.value)  //S4 把ret.value 必然转化为一个 Promise对象

      value.then(
        function(data) { next(data) },  //S5 递归调用 gen.next()
        function(e) {reject(e)}
      )
    }

    next()

  })

}

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

function toPromise(obj) {
  if (isPromise(obj)) return obj;
  if ('function' == typeof obj) return thunkToPromise(obj);
  return obj;
}

function thunkToPromise(fn) {
  return new Promise(function(resolve, reject) {
    fn(function(err, res) {
      if (err) return reject(err);
      resolve(res);
    })

  })
}
```