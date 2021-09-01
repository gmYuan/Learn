# 网络之 HTTP状态详解

### 目录

1 [预读文档](#1)

2 [HTTP报文 + 部首](#2)

3 [HTTP方法](#3)

4 [HTTP状态码](#4)


## <span id="1">一 预读文档 </span>

01 [可能是全网最全的http](https://juejin.im/post/5d032b77e51d45777a126183)

02 [具有代表性的 HTTP状态码](https://juejin.im/post/5a276865f265da432c23b8d2)

03 [面试必考之http状态码有哪些](http://hpoenixf.com/%E9%9D%A2%E8%AF%95%E5%BF%85%E8%80%83%E4%B9%8Bhttp%E7%8A%B6%E6%80%81%E7%A0%81%E6%9C%89%E5%93%AA%E4%BA%9B.html)

04 [99%的人都理解错了HTTP中GET与POST的区别](https://mp.weixin.qq.com/s?__biz=MzI3NzIzMzg3Mw%3D%3D&mid=100000054&idx=1&sn=71f6c214f3833d9ca20b9f7dcd9d33e4)


阅读原因: 直接 参考文档


## <span id="2">二 HTTP报文 + 部首 </span>


Q1: http的请求报文是什么样的

A:

S1 请求报文由 4部分组成: 请求行 + 请求头部 +  空行 + 请求体

S2 请求行 `GET /index.html HTTP/1.1`：请求方法字段 + URL字段 + HTTP协议版本字段;

S3 请求头部 `Host`: 由关键字/值对组成

S4 请求体: post put等请求携带的数据

![请求报文](https://user-gold-cdn.xitu.io/2019/6/14/16b545c9bac2897b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


响应报文结构类似，由  响应行 + 响应头 + 空行 + 响应体组成

响应行 `HTTP/1.1 200 OK`: 协议版本 + 状态码 + 状态码的原因短语


Q2: HTTP的常见部首 有哪些

A:

S1 通用部首: Cache-Control(控制缓存)/ Transfor-Encoding (报文主体的传输编码格式)

S2 请求部首: If-None-Match(Etag)/ If-Modified-Since(Last-Modified)/ Range/ Connection

S3 响应部首: Location/ ETag/ Last-Modified/ Expires/ Allow


## <span id="3"> 三 HTTP方法 </span>


Q1: HTTP有哪些方法

A:

S1 get: 请求获取资源

S2 head: 获取请求资源的 头部信息

S3 post: 发送数据 给服务器

S4 put: 新增/替换 资源

S5 patch: 用于对资源指定部分内容 进行修改

S6 delete: 删除 指定的资源

S7 options: 获取资源所支持的 通信选项

S8 trace: 回显 服务器收到的请求

S9 connect: /


Q2: GET和POST有什么区别

A:

> S1 数据的传输方式 不同：GET请求通过URL传输数据，而POST的数据 通过请求体传输;

> S2 安全性不同：POST的数据 因为在请求主体内，所以比get请求更安全些;

> S3 传输的 数据类型不同：GET只允许 ASCII字符，而POST无限制;

> S4 操作后果不同：GET请求是安全 且 幂等的，POST可能重复提交表单，非安全非幂等

> S5 长度限制不同: GET请求在URL中传送的参数是有长度限制的，而POST没有现在


Q3: PUT和POST都是给服务器发送新增资源，有什么区别

A:

S1 PUT操作结果是幂等的(连续调用一次或者多次的效果相同), 而 POST是 非幂等的;

S2 PUT的URI指向 一般是具体单一资源(某一篇文章)，而POST可以指向 资源集合(文章列表集合)




## <span id="4">四 HTTP状态码 </span>




