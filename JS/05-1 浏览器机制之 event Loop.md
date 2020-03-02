# 浏览器机制之 event Loop

目录:

1 [预读文档](#1)

2 [浏览器 进程与线程](#2)

3 [JS的运行机制—— Event Loop](#3)

4 [NodeJS 的Event Loop](#4)


## <span id="1"> 1 预读文档 </span>

1 [浏览器与Node的 事件循环有何区别](https://juejin.im/post/5c337ae06fb9a049bc4cd218)

阅读原因: Node.js部分参考，必读

2 [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://juejin.im/post/5a6547d0f265da3e283a1df7#heading-17)

3 [Eventloop不可怕，可怕的是遇上Promise](https://juejin.im/post/5c9a43175188252d876e5903)

阅读原因: 第1~3部分 参考文档


## <span id="2"> 2 浏览器 进程与线程 </span>


Q1: 什么是进程和线程

A:

进程: cpu资源分配的 最小单位 + 进程之间相互独立 + 一个进程由一个/多个 线程组成 

线程: cpu调度的最小单位 + 多个线程 在同一进程中  共享数据, 从而协作完成任务


Q2: 浏览器内的进程 有哪些

A: 

S1 浏览器是多进程的, 简单理解: 每打开一个Tab页，就相当于创建了一个独立的浏览器进程;

S2 浏览器的进程组成:

Browser主进程： 只有一个 + 负责各个页面的资源 管理调度

第三方插件进程：插件支持

GPU进程：最多一个 + 用于3D绘制等

浏览器渲染Renderer进程/浏览器内核: 内部多线程 + 负责 页面渲染 / 脚本执行 / 事件处理


Q3: 浏览器渲染进程内 有哪些线程

A: 

S1 GUI渲染线程: RenderObject树的 创建与绘制 + 与JS引擎线程 互斥

S2 JS引擎线程: 执行JS代码

S3 事件触发线程: 处理点击等事件

S4 定时触发器线程: 处理延时操作

S5 异步http请求线程:  处理AJAX请求


## <span id="3"> 3 JS的运行机制—— Event Loop </span>

Q1: JS引擎是单线程的，那么它是如何执行JS代码的

A: 

S1 JS是单线程的，因此为了避免 异步任务堵塞 => JS把任务分为 异步任务 和 同步任务;

S2 同步任务保存在 JS引擎线程管理的 执行栈A中， 依次执行;

S3 异步任务保存在 事件触发线程中的 一个事件队列B，在JS执行栈空闲时 依次执行;

S4 setTimeout/setInterval由 定时器线程单独管理，在传入时间后 把回调加入到 事件队列中;

S5 ES6引入了promise, JS 将任务进一步细分为 宏任务 与 微任务;


JS的执行流程为:

script主代码 -> 微任务加入到微任务队列,宏任务加入到宏任务队列 -> 依次执行完 微任务队列内所有任务 -> 页面重新渲染 -> 宏任务2...


## <span id="4"> 4 NodeJS 的Event Loop </span>

1 Q: NodeJS 的Event Loop 流程是什么

A:

S1 Node的 Event loop 共分为6个阶段:

  timers 阶段：执行 setTimeout/setInterval 回调

  I/O callbacks 阶段

  idle, prepare 阶段：仅node内部使用

  poll 阶段：获取新的I/O事件

  check 阶段：执行 setImmediate 回调

  close callbacks 阶段


S2 node中的事件循环的执行顺序大致是：

外部输入数据--> 轮询阶段(poll)--> 检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)

-->I/O事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段（按照该顺序反复运行）...


2 Q: Node与浏览器的 Event Loop差异 是什么

A:

S1 浏览器环境下，微任务的任务队列是每个宏任务 执行完之后执行;

S2 在Node.js中，微任务会在事件循环的各个阶段之间执行

```js
setTimeout(()=>{
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)

setTimeout(()=>{
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)

// 浏览器端: timer1=> promise1=> timer2=> promise2

// Node.js >=11: 同上

// Node.js <=10:  timer1=> promise1=> timer2=> promise2 或者 timer1=> timer2=> promise1=> promise2
```
