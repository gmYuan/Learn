## ES6之 Promise详解

### <span id="1"> 1 预读文档 </span>

01 [要就来45道Promise面试题一次爽到底](https://juejin.im/post/5e58c618e51d4526ed66b5cf)

02 [Eventloop不可怕，可怕的是遇上Promise](https://juejin.im/post/5c9a43175188252d876e5903)

预读原因: promise使用特性介绍，很多题目解释的原因都不准确


03 [史上最最最详细的手写Promise教程](https://juejin.im/post/5b2f02cd5188252b937548ab)

04 [Promise的源码实现](https://juejin.im/post/5c88e427f265da2d8d6a1c84)

预读原因: promise源码实现


全文大纲如下:

![Promise相关大纲](https://s1.ax1x.com/2020/07/01/N74NOH.png)


### <span id="2"> 2 promise 特点 </span>

S1 then的执行时机:  resolve/reject是否调用 + 回调函数return的 值类型

```js
// 例1
new Promise((resolve,reject)=>{
   console.log("promise1")
  resolve()
}).then(()=>{
  console.log("then11")
  new Promise((resolve,reject)=>{
    console.log("promise2")
    resolve()
  }).then(()=>{
    console.log("then21")
  }).then(()=>{
     console.log("then23")
  })
}).then(()=>{ 
    console.log("then12")
})
// 结果 promise1, then11, promise2, then21, then12, then23


// 例2
new Promise((resolve,reject)=>{
  console.log("promise1")
  resolve()
}).then(()=>{
  console.log("then11")
  return new Promise((resolve,reject)=>{
    console.log("promise2")
    resolve()
  }).then(()=>{
    console.log("then21")
  }).then(()=>{
    console.log("then23")
  })
}).then(()=>{
  console.log("then12")
})
// 结果 promise1, then11, promise2, then21, then23, then12


// 例3
Promise.resolve()
  .then(() => {
    return new Error('error!!!')     //返回了一个错误对象，而非抛出错误throw new Error
  })
  .then((res) => {
    console.log('then: ', res)
  })
  .catch((err) => {
    console.log('catch: ', err)
  })
  
// 结果：
then: Error: error!!!
    at Promise.resolve.then (...)
    at ...
```


S2 resolve的参数是 Promise对象时，resolve会 等待这个Promise的执行结果, 这个过程是异步的
  而 reject会把参数  直接传递给then方法中的rejected回调

```js
var p1 = new Promise(function(resolve, reject){
  resolve(Promise.resolve('resolve'));
});

var p2 = new Promise(function(resolve, reject){
  resolve(Promise.reject('reject'));
});

var p3 = new Promise(function(resolve, reject){
  reject(Promise.resolve('resolve'));
});

p1.then(
  function fulfilled(value){
    console.log('fulfilled1: ' + value);
  }, 
  function rejected(err){
    console.log('rejected1: ' + err);
  }
);

p2.then(
  function fulfilled(value){
    console.log('fulfilled2: ' + value);
  }, 
  function rejected(err){
    console.log('rejected2: ' + err);
  }
);

p3.then(
  function fulfilled(value){
    console.log('fulfilled3: ' + value);
  }, 
  function rejected(err){
    console.log('rejected3: ' + err);
  }
);
// 结果
// p3 rejected3: [object Promise]
// p1 fulfilled1: resolve
// p2 rejected2: reject
```


S3  then()的参数 非函数时，直接把 请求A的结果 向下传递 ( 传给请求C/暴露给外部)
```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
  
// 结果
// 1
```


### <span id="3"> 3 promise 源码实现 </span>

A: 实现见下

```js

/**
 * S1  请求A立刻发起执行
 * S2  A请求成功/失败，保存结果和状态 + 调用请求过程中注册的 回调函数
 * S3  后续B 可以再次发起另一个请求C..., 所以then 返回的是 一个新的promise对象
 * S4  后续处理B 要等请求A返回结果, 所以没必要设置为同步 堵塞代码 => then内的回调是 异步执行的
 * S5  后续处理的结果有多种情况，需要专门讨论
 * S6  then注册回调时，promise还是pending状态 =>  push的是一个异步的 回调函数
 * S7  后续B非函数,  则 内部构造一个函数 + promise请求完成后，会自动把成功/失败结果作为参数 传入
 * 
 * S8.1  回调函数的 结果是 promise实例本身，循环引用报错
 * S8.2  基本类型，直接返回值
 * S8.3  一个新的 promsie对象 => 再次调用resolvePromise 递归解析结果
 * S8.4  普通对象类型, 直接返回值
 * S8.5  有报错则 reject抛出错误
*/

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(executor) {
  let self = this
  self.status = PENDING
  self.onFulfilled = []
  self.onRejected = []
   
  function resolve(value) {           // S2 A请求成功，保存结果和状态
    if (self.status === PENDING) {
      self.status = FULFILLED;
      self.value = value;
      self.onFulfilled.forEach(fn => fn())
    }
  }

  function reject(reason) {        // S2  A请求失败，保存原因和状态
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = reason;
      self.onRejected.forEach(fn => fn())
    }
  }

  try {
    executor(resolve, reject)   // S1 请求A立刻发起执行
  } catch (e) {
    reject(e)
  }

}

Promise.prototype.then = function (onFulfilled, onRejected) {
  let self = this
  let promise2  

  // S7  后续B非回调函数则传透值
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
  
  //S3 后续B 可以再次发起另一个请求C..., 所以是一个新的promise对象
  promise2 = new Promise((resolve, reject) => {
    if (self.status === FULFILLED) {
      // S4 后续处理B 要等请求A返回结果,所以没必要设置为同步 堵塞代码
      setTimeout(() => {
        try {
          let x = onFulfilled(self.value)
          // S5 后续处理的结果有多种情况，需要专门讨论
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })

    } else if (self.status === REJECTED) {
      setTimeout( () => {
        try {
          let x = onRejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      });

    } else if (self.status === PENDING) {
      self.onFulfilled.push( () => {   //S6 push的是一个异步的 回调函数
        setTimeout( () => {
          try {
            let x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })

      self.onRejected.push( () => {
        setTimeout( () => {
          try {
            let x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })

    }
  })

  return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
  let self = this

  // S8.1 后续结果是 promise实例本身，循环引用报错
  if (promise2 === x) {
    reject( new TypeError('Chaining cycle') )
  }

  if (x && typeof x === 'object' || typeof x === 'function') {  // x是除了null以外的对象或者函数
    let used      // 确保 resolve/reject互斥，只调用一次

    try {     // S8.3 防止获取then时通过Object.defineProperty报错
      let then = x.then

      if (typeof then === 'function') {   // 则x看作为 promsie对象
        // S8.3  一个新的 promsie对象 => 最后再次调用resolvePromise 递归解析结果
        then.call(x, (y) => {
          if (used) return
          used = true
          resolvePromise(promise2, y, resolve, reject)
        }, (r) => {
          if (used) return
          used = true
          reject(r)
        })

       } else {       //S8.4   普通对象类型, 直接返回值
        if (used) return
        used = true
        resolve(x)
       }
    } catch (e) {   // S8.5  有报错则 reject抛出错误
      if (used) return
      used = true
      reject(e)
    }

  } else {          //S8.2  基本类型，直接返回值
    resolve(x)
  }

}
```


### <span id="4"> 4 promise其他方法 实现 </span>

```js
/** 1    Promise.resolve方法
  *  S1  如果传入的是promise对象,直接返回它
  *  S2 thenable对象时，直接调用其then函数
  *  S3 普通值，则返回 以该值为成功状态的promise对象
*/  
Promise.resolve = function(params) {
  if (params instanceof Promise) {  // S1
    return params
  }

  return new Promise( (resolve, reject) => {
    if (params && params.then && typeof params.then === 'function') {   // S2
      params.then(resolve, reject)

    } else {  // S3
      resolve(parmas)
    }

  })
}


/**  2  promise.reject方法
*/
Promsie.reject = function(reason){
  return new Promise( (resolve, reject) => {
    reject(reason)
  })
}


/**  3  promise.all方法
*   S1  因为promises可能是同步数据/promsie对象, 所以需要用 Promise.resolve变成对应状态的 promise
*  S2  用index而非 result.length来判断的原因是, 如果result[9] = 100, 则其长度为10
          但实际其他的异步结果可能 并未获取到, 所以利用index计数器来判断 异步操作是否完成
*  S3 如果有一个失败了，则整个 promsie.all状态也是 失败的
*/

Promise.all = function(promises) {
  return new Promise( (resolve, reject) => {
    let result = []   // 返回结果值
    let index = 0   // 对异步操作结果获取的计数器

    if (promises.length === 0) {  // 空数组传入，则同步 返回空的数组
      resolve(result)
    }

    for (let i=0; i<promises.length; i++) {
      Promise.resolve(promises[i]).then( data=> {                 // S1
        result[i] = data
        if (++index === promises.length) { resolve(result) }  // S2
      },
      reject   // S3
    )}

  })
}


/*  4  Promise.race方法
*   S1  如果传入数组为空，则一直是pending状态
*  S2 遍历并执行 promises数组内容, 在最快注册的 then回调被执行后，终止整个promise
*/
Promise.race = function(promises) {
  if (promises.length === 0)  return;       // S1
  
  return new Promise( (resolve, reject) => {
    for (let i=0; i<promises.length; i++) {
      Promise.reslove(promises[i]).then(data => {   // S2
        resolve(data)

      }, err => {
        reject(err)
      })
    }
  })
}


/* 5  Promise.allSettled方法
*  S1  promises成员成功时, 基本同Promise.all
*  S2 对失败时要进行和成功一样的逻辑处理，而不是直接返回终止
*/
Promise.allSettled = function(promises) {
  return new Promise( (resolve) => {
    let result = [],  index = 0
  
    if(promises.length === 0)  { resolve(result) } 
  
    for(let i = 0; i < length; i++) {
      Promise.resolve(promises[i]).then( 
        (value) => {  // S1
          result[i] = { status: 'fulfilled', value, }
          if(++index === promises.length) { return resolve(result) }
        }, 
        (reason) => {   // S2
          result[i] = { status: 'rejected', reason, }
          if(++index === length) { return resolve(result) }
        }
      )
    }

  })
}


/*  6  promise.prototype.finally方法
*   S1  函数功能核心点:  必然会执行执行回调 + 回调函数 不接受任何的参数
*  S2  Promise.resolve 用来确保 cb是异步时，value在 cb执行后才被 返回
*  S3 它的返回值是 上一次的Promise对象值，不过如果抛出的是一个异常则返回异常的Promise对象
*/

Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
  
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
  	return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })

// 结果
'1'
'finally2'
'finally'
'finally2后面的then函数' '2'


Promise.prototype.finally = function(cb) {  //S1  
  return this.then(
    (value) => Promise.resolve( cb() ).then( () =>  value ),      // S2 
    (err)=>  Promise.resolve( cb() ).then( () => { throw err } )
  )
}


/*  7  promise.prototype.catch方法
*/
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}
```


### <span id="5"> 5 promise 常见题目 </span>

Q1  使用Promise实现 每隔1秒输出1,2,3

A:  S1 timer1入队后 => timer2入队 => timer3入队, 即定时器 `按序入队`

S2 then的链式快捷写法 => reduce

```js
let arr = [1, 2, 3]
arr.reduce( (p, curValue) => {
  return p.then( () => {                      // reduce每次返回的都要是一个Promise对象
    return new Promise( resolve => {    //  return new Promise可以保证 then1执行后才会入队then2
      setTimeout( () => resolve(console.log(curValue)) , 1000 )
    })  

  } )
}, Promise.resolve() )
```


Q2: 实现Promise.all / Promise.allSettled / Promise.race方法

A:  代码解析见上


Q3：如何实现 中断Promise执行

A:

```js
/*   方法1:  返回 pending状态的 Promise对象  */
Promise.resolve().then(() => {
    console.log('ok1')
    return new Promise(()=>{})  // 返回“pending”状态的Promise对象
}).then(() => {
    // 后续的函数不会被调用
    console.log('ok2')
}).catch(err => {
    console.log('err->', err)
})


/*  方法2:  抛出错误的 Promise */

Promise.resolve().then(() => {
    console.log('ok1')
    throw 'throw error1'
}).then(() => {
    console.log('ok2')
}, err => {     
    // 捕获错误
    console.log('err->', err)
}).then(() => {   
    // 该函数将被调用
    console.log('ok3')
    throw 'throw error3'
}).then(() => {
    // 错误捕获前的函数不会被调用
    console.log('ok4')
}).catch(err => {
    console.log('err->', err)
})
```