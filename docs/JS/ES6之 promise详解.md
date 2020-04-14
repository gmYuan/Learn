# ES6之 Promise详解

目录:

1 [预读文档](#1)

2 [promise实现](#2)

3 [promise其他方法 实现](#3)


## <span id="1"> 1 预读文档 </span>

01 [八段代码彻底掌握 Promise](https://juejin.im/post/597724c26fb9a06bb75260e8)

02 [Promise的源码实现](https://juejin.im/post/5c88e427f265da2d8d6a1c84)

03 [浅谈Promise怎么取消或中断](https://juejin.im/post/5cc093635188252e754f2239)

阅读原因: 直接参考视频


## <span id="2"> 2 promise实现 </span>

1 Q: 如何实现一个 promise

A: 

S1 then的多个回调: 发布订阅

S2 then的链式调用: 返回新的promsie对象 + 获取回调函数值

S3 新Promise对象的返回值: 由then内的回调函数值 决定

```js
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function Promise(executor) {
  let self = this

  self.status = PENDING   // 初始化状态
  self.value = undefined
  self.reason = undefined
  self.onResolvedCallbacks = []
  self.onRejectedCallbacks = []

  function resolve(value) {
    // 防止调用多次不同状态
    if (self.status === PENDING) {
      self.status = RESOLVED
      self.value = value
      self.onResolvedCallbacks.forEach(fn => fn())
    }
  }

  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED
      self.reason = reason
      self.onRejectedCallbacks.forEach(fn => fn())
    }
  }


  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  let self = this
  let promise2

  // then的参数 非函数时, 穿透上一个Promise的返回值
  onFulfilled = (typeof onFulfilled === 'function' ? onFulfilled : value => value)
  onRejected = (typeof onrejected === 'function' ? onRejected : err => { throw err })

  // then返回的是一个新的Promise对象,且对象值 由onFulfilled/onRejected的返回值决定
  promise2 = new Promise((resolve, reject) => {
    if (self.status === RESOLVED) {
      // 异步执行回调函数, 以获取到promise2的值
      setTimeout(() => {
        try { // 防止执行回调时内部有报错
          let x = onFulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0)

    } else if (self.status === REJECTED) {
      setTimeout(() => {
        try {
          let x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0)

    } else if (self.status === PENDING) {
      self.onResolvedCallbacks.push(() => {
        // 存入的函数同上是 异步的
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
       }, 0)
      })

      self.onRejectedCallbacks.push( () => {
        setTimeout( ()=> {
          try {
            let x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        } , 0)
      })

    }

  })

  return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('循环引用了'))
  }

  if(x && typeof x === 'object' || typeof x === 'function') {
    let used  // 兼容所有Promise实现, 确保只能改变一次状态值

    try {  // 防止获取then时通过Object.defineProperty报错
      let then = x.then

      if (typeof then === 'function') {  // 则认为x是 promsie对象
        then.call(x,  // 通过then来获取并传出 promise对象的值
          (y) => {  
            if (used) return;
            used = true
            resolvePromise(promise2, y, resolve, reject)  //防止y又是一个promise对象
          },
          (r) => {
            if (used) return;
            used = true
            reject(r)
          }
        )

      } else {  // then非函数,说明是普通对象
        if (used) return;
        used = true
        resolve(x)
      }

    } catch(e) {
      if (used) return;
      used = true
      reject(e)
    }

  } else {  // then的返回值是 基本数据类型，返回成功状态的该值
    resolve(x)
  }
}

```

## <span id="3"> 3 promise其他方法 实现 </span>

1 Q: 如何实现 promise其他方法

A:

S1 promise.resolve方法: 返回 一个给定值解析后的 promise对象

S2 promise.reject方法: 返回一个失败状态的 promise对象

S3 promise.all方法: 只有全部成功时，才返回一个成功的promise对象，值是有序数组

S4 promise.race方法: 获取最先完成的 promise返回值

S5 promise.prototype.catch方法:  then的语法糖

S6 promise.prototype.finally方法: 必然执行的函数

```js
Promise.resolve = function(params) {
  if (params instanceof Promise) {  // 如果传入的是promise对象,直接返回它即可
    return params
  }

  return new Promise( (resolve, reject) => {
    if (params && params.then && typeof params.then === 'function') {
      // thenable对象时，直接调用其then函数即可
      params.then(resolve, reject)

    } else {  // 普通值，则直接返回 以该值为成功状态的promise对象
      resolve(parmas)
    }

  })
}


// promise.reject方法
Promsie.reject = function(reason){
  return new Promise( (resolve, reject) => {
    reject(reason)
  })
}


// promise.all方法
Promise.all = function(promises) {
  return new Promise( (resolve, reject) => {
    let result = []  // 返回结果值
    let index = 0   // 对异步操作结果获取的计数器

    if (promises.length === 0) {  // 空数组传入，则同步 返回空的数组
      resolve(result)
    }

    for (let i=0; i<promises.length; i++) {
      // 因为promises可能是同步数据/promsie对象, 所以需要用resolve变成对应状态的 promise
      Promise.resolve(promises[i]).then( data=> {
        // 因为需要判断多个异步操作是否都获取到了值，所以封装成一个函数处理
        processData(i, data)
        // 如果有一个失败了，则整个 promsie.all状态也是 失败的
      },reject)
    }

    function processData(i, data) {
      result[i] = data
      // 用index而非 result.length来判断的原因是, 如果result[9] = 100, 则其长度为10
      // 但实际异步结果可能并未获取到, 所以利用index计数器来判断 异步操作是否完成
      if (++index === promises.length) {
        resolve(result)
      }
    }

  })
}


//Promise.race方法
Promise.race = function(promises) {
  if (promises.length === 0) {
    return;   // 如果传入数组为空，则一直是pending状态
  }
  
  return new Promise( (resolve, reject) => {
    for (let i=0; i<promises.length; i++) {
      // 遍历并执行 promises数组内容即可, 在执行完第一个返回内容后，终止程序执行
      Promise.reslove(promises[i]).then(data => {
        resolve(data)
        return;

      }, err => {
        reject(err)
        return;
      })
    }
  })
}


// promise.prototype.catch方法
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}


// promise.prototype.finally方法
Promise.prototype.finally = function(cb) {
  // 用then来接收 上一个Promise的状态和 返回值
  return this.then((value)=> {
    // 用resolve来保证回调函数是异步时，也还是在执行完成后才返回 上一个Promise的值
    return Promise.resolve( cb() ).then( () => {
      // finally的核心点: 执行回调 + 传递上一个Promise的值
      return value
    })

  }, (err)=>{
    return Promise.resolve( cb() ).then( () => {
      throw err
    })
  })

}
```