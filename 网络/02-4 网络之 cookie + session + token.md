# 网络之 cookie + session + token详解

## 目录

1 [预读文档](#1)

2 [Cookie相关](#2)

3 [Session相关](#3)

4 [Token相关](#4)


## <span id="1">一 预读文档 </span>

1 [傻傻分不清之 Cookie、Session、Token、JWT](https://juejin.im/post/5e055d9ef265da33997a42cc#heading-21)

2 [把cookie聊清楚](https://juejin.im/post/59d1f59bf265da06700b0934#heading-4)

阅读原因: 直接 参考文档


## <span id="2">二 Cookie相关 </span>

Q1: 什么是 Cookie

A:

S1 HTTP 是一个 `无状态`的协议，每个请求都完全独立，服务端不会记录之前通信 的任何信息;

S2 为了能够记录 服务器和浏览器之间的`会话状态`，引入了cookie机制;

S3.1 当浏览器第一次向 服务器发起请求时,服务器会把 cookie放在 响应请求中 返回给浏览器;

S3.2 当浏览器再次发起请求时，就会自动携带上之前的cookie信息 发送给服务端;

S3.2 服务端通过查看 cookie信息, 就可以获取到 之前记录的 信息内容

S4 所以，cookie的主要作用是: `身份识别 和 信息记录`

![cookie流程图](https://user-gold-cdn.xitu.io/2019/3/21/1699f22b7029ca14?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


Q2: 如何创建cookie

A:

S1 服务端通过 set-cookie响应头字段 设置cookie;

S2 浏览器通过 `document.cookie` API来 创建cookie


Q3: cookie对象有哪些属性

A:

S1 name: 表示cookie的名字;

S2 value: 表示cookie的值;

S3 domain: 指定 cookie所属域名;

S4 path: 指定 cookie在哪个路由 下生效;

S5 Expires: 设置的 cookie过期时间, 根据的是本地时间所以不精确;

S6 maxAge: 设置的 cookie失效时间;

S7 secure: 设置 仅在安全协议下 cookie才生效;

S8 httpOnly: 无法通过 JS脚本 读取到 cookie信息, 能够 防止xss攻击


Q4: Cookie有哪些缺点:

A: 

S1 明文传输，不够安全: 不要存储敏感数据 + 注意设置httpOnly

S2 容量不够大: 一般只有4KB大小;

S3 有跨域限制

S4 移动端对 cookie 的支持不是很好

S5 过多的Cookie 会影响性能: 每次请求都会携带cookie, 包括静态资源请求，会造成资源浪费


## <span id="3"> 三 Session相关 </span>

Q1: 什么是 Session

A:

S1 Session是另一种 会话状态记录的 机制, 基于cookie实现

S2.1 浏览器第一次向 服务器发起请求时, 服务器会根据 用户提交的信息，生成对应的 Session, 然后把对应的SessionID标识 返回给浏览器;

S2.2 浏览器接收到 `SessionID`后，会把它存入到 `Cookie`中，同时记录 此SessionID 属于哪个域名;

S3.1 当第二次访问服务器时，会通过 Cookie把 SessionID传回给 服务端;

S3.3 服务端根据 SessionID查找对应的 Session信息—— 找到: 用户已登录; 未找到： 用户没有登录/ 登录失效

![Session流程图](https://user-gold-cdn.xitu.io/2019/12/29/16f523a04d0b3cf5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


Q2: Session 有哪些缺点:

A:

S1 session存储在服务器里面，数量过多时会 影响服务端性能

S2 会有 session共享问题需要解决

S3 因为基于cookie，所以同样有 有跨域限制 + 移动端支持不友好


Q3: Cookie 和 Session 的区别

A:

S1 存储方式不同: cookie信息保存在客户端中 + Session信息保存在 服务端中;

S2 安全性不同: 由S2可知，Session比Cookie更安全;

S3 容量大小不同: cookie一般大小是4KB + Session容量大得多;

S4 存储的 值类型不同: Cookie只支持存字符串数据 + Session可以存任意 数据类型

S5 有效期不同: Cookie可设置为长时间保持，如默认登录功能 + Session一般 失效时间较短


Q4: 如果禁止了 Cookie，如何实现 会话状态记录

A:

S1 重写URL: 在请求的地址后面拼接 `xxx?SessionID=123456`

S2 使用token: token也可以用于 状态记录


## <span id="4"> 四 Token相关 </span>

Q1: 什么是 Token

A: 

S1 token是 访问特定资源接口API时 所使用的 资源凭证

S2 客户端使用 用户名跟密码 请求登录;

S3 服务端 验证用户名与密码 => 成功后，服务端生成一个 token + 把这个 token发送给客户端

S4 客户端收到 token以后，把它存储起来 + 每次向服务端请求资源的时， 通过header发送 token

S5 服务端收到请求，验证token + 验证成功，就向客户端 返回请求的数据

![Token 流程图](https://user-gold-cdn.xitu.io/2019/12/29/16f523a04d9c745f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


Q2: Token的特点

A:

S1 基于 token的 用户认证是一种 服务端无状态的认证方式 => 减轻服务器的压力

S2 token应用管理，所以可以 避开同源策略

S3 token可以避免 CSRF攻击

S4 token更加适用于 移动端
