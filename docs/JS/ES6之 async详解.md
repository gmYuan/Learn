## ES6之 generator详解

### <span id="1"> 1 预读文档 </span>

01 [async/await 原理及执行顺序分析](https://juejin.im/post/5dc28ea66fb9a04a881d1ac0)

02 [Promise/async/Generator实现原理解析](https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc)

03 [原生JS灵魂之问(下)](https://juejin.im/post/5dd8b3a851882572f56b578f)

阅读原因: 直接参考文档


### <span id="2"> 2 生成器 使用特性 </span>

1 Q: 什么是生成器, 有什么作用

A: S1 Generator 是一个特殊函数，返回值是  迭代器对象g: { next() {value: xxx, done: xxx } }

S2 可以通过 `yield表达式+next()方法` 来控制 生成器的状态切换

S3 yield* YYY 相当于 for..of遍历执行YYY里的 [Symbol.Iterator]接口

```js
function *hwGenerator() {
  yield 'hello'
  yield 'world'
  return 'bye bye'
  yield 'not execute'
}

let g = hwGenerator()
g.next()    //  {  value: "hello", done: false }
g.next()    //  { value: "world", done: false }
g.next()    //  { value: "bye bye", done: true }
g.next()   //   { value: undefined, done: true }
```

2 Q: generator还有什么其他实例方法

A:

S1 g.next(p1)每次都会执行内代码 直到yield语句处 + p1参数值就是yield语句返回值

S2 g.throw(xx)的报错 可以被内外 try...catch语句捕获到

S3 g.return(xx) 会让 迭代器终止

```js
function* gen1() {
    yield 1;
    yield* gen2();
    yield 4;
}
function* gen2() {
    yield 2;
    yield 3;
}

// 1 2 3 4
```

3 Q: 如何模拟实现 generator

```js
// 生成器函数根据yield语句将代码分割为switch-case块，后续通过切换_context.prev和_context.next来分别执行各个case
function gen$(_context) {
  while (1) {
    switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return 'result1';

      case 2:
        _context.next = 4;
        return 'result2';

      case 4:
        _context.next = 6;
        return 'result3';

      case 6:
      case "end":
        return _context.stop();
    }
  }
}

// 低配版context  
var context = {
  next:0,
  prev: 0,
  done: false,
  stop: function stop () {
    this.done = true
  }
}

// 低配版invoke
let gen = function() {
  return {
    next() {
      value = context.done ? undefined: gen$(context)
      done = context.done
      return {
        value,
        done
      }
    }
  }
} 

// 测试使用
var g = gen() 
g.next()  // {value: "result1", done: false}
g.next()  // {value: "result2", done: false}
g.next()  // {value: "result3", done: false}
g.next()  // {value: undefined, done: true}
```


### <span id="3"> 3生成器 自动执行 </span>

1 Q: 如何让 生成器可以自动执行 异步流程

A: S1 方法一: 基于Promise的 Generator自动执行器:

```js
function run(generator) {
  let g = generator()  //S1 启动迭代器

  function next(data) {
    let ret = g.next(data)    //S2 返回的是迭代器 {value: Promsie对象,  done: xxx}

    if (ret.done) return;

    ret.value.then(value => {   // S3 data是上一次yield的 异步操作的  返回值
      next(value)  // 把值传入生成器内部，再次调用 gen.next(), 执行到下一次的 yield语句暂停处
    })

  }
  next()
}

function* myGenerator() {
  console.log(yield Promise.resolve(1))    // 1
  console.log(yield Promise.resolve(2))   // 2
  console.log(yield Promise.resolve(3))   // 3
}

run(myGenerator)
```

S2 方法二: 基于Thunk函数的 Generator自动执行器

```js

function run(generator) {
  let gen = generator()  //S1 启动迭代器

  function next(data) {
    let ret = gen.next(data)    //S2 返回的是迭代器 {value: Thunk函数,  done: xxx}

    if (ret.done) return;
  
    ret.value(next)  // S3 Thunk函数的参数是 一个回调函数 + 在回调中递归调用next()以执行g.next()
  }

  next()

}
```

S3 方法三: Co通用版本的 Generator自动执行器

```js
async function fn(args) {
  // ...
}
等同于：

function fn(args) {
  return run(function* () {
    // ......
  })
}


function run(gen) {
  let g = gen()   // S1 启动生成器, 返回一个迭代器对象 {next() {...} }

  return new Promise(function(resolve, reject) {  // S1 返回Promsie: 可以使后续获取到 gen的结果
    function next(data) {
      try {  // S2 错误捕获, 防止yield处 的异步操作 执行错误
        let ret = g.next(data)  // S3 ret是 当前状态:  {value: Promise/Thunk函数, done: xxx}
      } catch (e) {
        return reject(e)
      }

      if (ret.done) return resolve(ret.value)


      let value = toPromise(ret.value)  //S4 把ret.value 必然转化为一个 Promise对象

      value.then(
        (value)  => { next(value) },  //S5 递归调用 gen.next()
        (e)  => {reject(e)}
      )
    }

    next()

  })

}

function toPromise(obj) {
  if (isPromise(obj)) return obj;
  if ('function' == typeof obj) return thunkToPromise(obj);
  return obj;
}

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

function thunkToPromise(fn) {
  return new Promise(function(resolve, reject) {
    fn((err, res) => {
      if (err) return reject(err);
      resolve(res);
    })
    
  })
}
```