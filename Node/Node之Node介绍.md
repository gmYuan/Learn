# Node之 Node介绍

Q1 Node是什么
A:
S1 Node是一个平台，它整合封装了一些第三方技术，从而拓宽了 JS的能力边界
S2 所以通过Node，我们可以读写 文件系统，处理网路请求，开发后端应用等
S3 Node 自底向上 主要整合/提供了以下能力：

- node API：包括 fs/http/stream等模块
  
- node.js bindings：cpp功能库A ==> 映射文件 A.bindings.cpp ==> 经过编译后，转化为对应功能的 Node文件（或者是其他 Node可执行的类型）==> require()引入使用，
这样Node就能调用cpp库  

- C/C++插件：Node提供了插件语法，从而让开发者 自定义使用cpp插件


- v8引擎：让JS语句编译成二进制机器语言， 从而可以直接执行 JS语句 + 内存管理等其他功能；注意v8本身是多线程的，包括 JS执行线程/垃圾回收线程/函数栈线程等，但v8执行JS语句时，只有一个线程，所以JS执行是 单线程的

- libuv库：从而可以 异步的 + 跨平台的  执行IO操作，比如 TCP/UDP/文件读取等
- c-cares： cpp编写的库，使用它 可以让Node 解析DNS
- OpenSSL：进行加密解密 
- http-parse库：解析网络请求URL
...... 

综上：

C++第三方封装层(处理 异步IO/ DNS解析/) + JS-bingds(编译中转层) + V8(执行JS + 事件循环控制) + Node标准库(简化代码编写)
这就是Node.js的大体构成。

![Node工作流程图](https://gitee.com/ygming/blog-img/raw/master/img/node_work.png)
-------

Q2 什么是event Loop
A：
S1 对多个事件进行调度管理的 机制：
文件信息/网络信息/定时任务 等通知Node待处理  ==> 多个任务直接可能同时到达，但需要有一个处理的 优先级机制 ==> Event Loop 人为定义和实现了这种 处理机制

S2 Event Loop的具体管理方法：拆分处理阶段 ==> 每个阶段处理特定的事件 ==> 在这些阶段之间进行 轮询切换

S3 具体分为以下阶段：
- timers：检查执行 定时器事件；
- poll：轮询，执行 系统事件；
- check：主要执行 setImmediate事件；

具体如图：
![event Loop示意图](https://gitee.com/ygming/blog-img/raw/master/img/node_eventLoop.png)

          