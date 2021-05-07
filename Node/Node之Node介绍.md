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




Q2 什么是event Loop
