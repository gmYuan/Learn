# 浏览器之 storage详解

### 目录

1 [预读文档](#1)

2 [cookie 相关](#2)

3 [localStorage/sessionStorage 相关](#3)

4 [IndexedDB 相关](#4)


## <span id="1">一 预读文档 </span>

01 [深入了解浏览器存储--从cookie到WebStorage、IndexedDB](https://juejin.im/post/5c8e6fa8e51d453ec75168cd)

02 [cookie、localStorage和sessionStorage 三者之间的区别以及存储、获取、删除等使用方式](https://juejin.im/post/5a191c47f265da43111fe859)


阅读原因: 直接 参考文档


## <span id="2">二 cookie相关 </span>


cookie实质是实现 请求端和响应端 之间的 信息记录 和 身份验证

关于cookie的知识点，详见其他部分文章


## <span id="3"> 三 localStorage/sessionStorage 相关 </span>

Q1: localStorage的特点是什么

A:

S1 保存的数据长期存在: 下一次访问该网站的时候，网页可以直接读取以前保存的数据

S2 大小为5M左右 + 仅在客户端使用，不和服务端进行通信

所以：

> LocalStorage可以作为浏览器 本地缓存方案，

> 用来提升网页首屏渲染速度(根据第一请求返回时，将一些不变信息直接存储在本地)。


关于localStorage的语法，详见 [Window.localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)


Q2: sessionStorage的特点是什么

A:

S1 会话级别的浏览器存储: 当会话结束（通常是该窗口关闭），sessionStorage保存的数据 会被清空

S2 同域名下的两个页面，只要不在同一个浏览器窗口中打开，那么它们的 sessionStorage内容便无法共享；

S3 大小为5M左右 + 仅在客户端使用，不和服务端进行通信

所以,

> sessionStorage 可以有效对表单信息进行维护，比如刷新时，表单信息不丢失。



Q3: sessionStorage 、localStorage 和 cookie 之间的区别

A:

S1 共同点：都是保存在浏览器端，且都遵循同源策略

S2 生命周期不同：

- cookie：可设置失效时间，默认是 关闭浏览器后失效;

- localStorage：除非被手动清除，否则会永久保存;

- sessionStorage： 仅在当前网页会话下有效， 关闭页面或浏览器后就会被清除


S3 存放数据大小不同：

- cookie：4KB左右

- localStorage / sessionStorage：可以保存5MB的信息


S4 通信对象不同：

- cookie：每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题

- localStorage和sessionStorage： 仅在客户端（即浏览器）中保存，不参与和服务器的通信


S5 作用域不同: sessionStorage 要在 同一窗口下 才能共享数据

![作用域](https://user-gold-cdn.xitu.io/2019/3/21/169a07c478b857c5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


## <span id="4">四 IndexedDB 相关 </span>


Q1: 什么是IndexDB, 它具有什么特点

A:
S1 IndexedDB 用于客户端 存储大量结构化数据(包括文件和blobs)

S2 它具有以下特点

```
- 储存空间大: IndexedDB 一般来说不会小于 250M 

- 支持二进制储存: 不仅可以储存字符串，还可以储存二进制数据

- 异步: IndexedDB 操作时不会锁死浏览器，用户依然可以进行其他操作

- 同源限制: IndexedDB 受到同源限制
```
