
01 [Promise 必知必会- 十道题](https://juejin.im/post/5a04066351882517c416715d)

02 [八段代码彻底掌握 Promise](https://juejin.im/post/597724c26fb9a06bb75260e8)




promise解决的问题：

S1 异步处理的方式=> 回调函数 => 多层回调的嵌套，形成 `"回调地狱"`

S2 回调的缺点:  

  代码过于耦合，维护性和复用性差
  无法在回调函数外部暴露出结果，所有逻辑都写在回调函数内部 + 异常也是在内部处理

因此引入 Promise来解决异步问题



promise的特点

1   Promise 的构造函数是同步执行的  => 立刻发起了请求
    promise.then 中的函数是异步执行的  => 拿到了结果后才能对其进行处理

```js
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})
promise.then(() => {
  console.log(3)
})
console.log(4)

// 结果
1 => 2 => 4 => 3
```


2  promise 有 3 种状态：pending、fulfilled 或 rejected
   状态改变只能是 pending->fulfilled /pending->rejected，状态一旦改变则不能再变。

```js
const promise = new Promise((resolve, reject) => {
  resolve('success1')
  reject('error')
  resolve('success2')
})

promise
  .then((res) => {
    console.log('then: ', res)
  })
  .catch((err) => {
    console.log('catch: ', err)
  })
  
// 结果
then: success1
```

3  promise.then/catch返回 一个新的 Promise 实例，从而实现链式调用

- return 一个同步的值/undefined， then方法返回一个resolved状态的Promise对象
- return 另一个 Promise，then方法将根据这个Promise的状态和值，创建一个新的Promise对象返回
- throw 一个同步异常，then方法将返回一个rejected状态的Promise,  值是该异常。

```js
var p = new Promise(function(resolve, reject){
  resolve(1);
})

p.then((value) => {               //第一个then
  console.log(value);
  return value*2;
}).then((value) => {              //第二个then
  console.log(value);
}).then((value) => {              //第三个then
  console.log(value);
  return Promise.resolve('resolve'); 
}).then((value) => {              //第四个then
  console.log(value);
  return Promise.reject('reject');
}).then((value) => {              //第五个then
  console.log('resolve: '+ value);
}, function(err){
  console.log('reject: ' + err);
})

// 结果
1 => 2 => undefined => 'resolve' => 'reject: reject'
```


4 一个promise对象，可以有多个then回调函数

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('once')
    resolve('success')
  }, 1000)
})

const start = Date.now()
promise.then((res) => {
  console.log(res, Date.now() - start)
})
promise.then((res) => {
  console.log(res, Date.now() - start)
})

// 结果
once
success 1005
success 1007
```

5 promsie.then有错时一定要 throw 而不能 return
  因为返回任意一个非 promise 的值都会被包裹成 promise 对象，
  即 return new Error('error!!!') 等价于 return Promise.resolve(new Error('error!!!'))

```js
Promise.resolve()
  .then(() => {
    return new Error('error!!!')
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

6  promise.then 或 promise.catch 返回的值 不能是 promise 本身，否则会造成死循环

```js
const promise = Promise.resolve()
  .then(() => {
    return promise
  })

promise.catch(console.error)

// 结果：
TypeError: Chaining cycle detected for promise #<Promise>
```

7 .then 或者 .catch 的参数期望是函数，传入非函数会发生 值穿透

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
  
// 结果
1
```

8 .catch 是 .then 第二个参数的简便写法, 可以捕获之前的错误

```js
Promise.resolve()
  .then(function success (res) {
    throw new Error('error')
  }, function fail1 (e) {
    console.error('fail1: ', e)
  })
  .catch(function fail2 (e) {
    console.error('fail2: ', e)
  })
  
// 结果
fail2: Error: error
```

9  Promise回调函数中的第一个参数resolve，会对Promise执行"拆箱"动作。
  即当resolve的参数是一个Promise对象时，resolve会"拆箱"获取这个Promise对象的状态和值，
  但这个过程是异步的。

  但Promise回调函数中的第二个参数reject不具备”拆箱“的能力，
  reject的参数会直接传递给then方法中的rejected回调。

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
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p2.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p3.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

// 结果
p3 rejected: [object Promise]
p1 fulfilled: resolve
p2 rejected: reject
```










Promsoe.resolve()特点

1 参数是promise对象会 直接返回

```js
var p1 = Promise.resolve( 1 );
var p2 = Promise.resolve( p1 );
var p3 = new Promise(function(resolve, reject){
  resolve(1);
});
var p4 = new Promise(function(resolve, reject){
  resolve(p1);
});

console.log(p1 === p2); 
console.log(p1 === p3);
console.log(p1 === p4);
console.log(p3 === p4);

// 结果
true / false / false / false
```




Promise.finally()特点

1  .finally()方法 必然会执行
2 .finally()方法的回调函数不接受任何的参数
3 它的返回值是 上一次的Promise对象值，不过如果抛出的是一个异常则返回异常的Promise对象。

```js
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

```