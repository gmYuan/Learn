# 网络之 HTTP小结

Q1: HTTP有哪些特点
A:
S1 它是灵活可扩展的，可以任意添加头字段 实现自定义功能

  - HTTP协议一开始只规定了报文的基本格式，报文的各个组成部分都没有严格的语法语义限制，可以由开发者任意定制
  - 所以在发展过程中，逐渐增加了 请求方法/ 版本号/ 状态码 /头字段等特性
  - body也不再限于 文本形式的 TXT/HTML，而是能够传输 图片/音频视频等任意数据
  - HTTP不限制具体的下层协议，它可以运行在 TCP/SSL/基于UDP的QUIC 上层


S2 可靠传输，基于 TCP/IP 协议 “尽量”保证数据的送达
  - 因为 HTTP协议是基于 TCP/IP 的，而 TCP是一个 “可靠”的传输协议，所以HTTP就继承了这个特性

  - 具体做法是 对实际传输的数据（entity）做一层包装，加上一个头，然后调用 Socket API，通过 TCP/IP 协议栈 发送或者接收

  - "可靠" 传输是指在 网络基本正常的情况下 数据收发必定成功，在 网络繁忙/ 连接质量差等恶劣的环境下，也有可能收发失败


S3  应用层协议，比 FTP/SSH等 更通用/功能更多
  - 只要不太苛求性能，HTTP 几乎可以传递一切东西，满足各种需求
  - 相比其他应用层协议，HTTP 的适用范围更广，应用广泛

S4 HTTP 协议使用的是 请求 - 应答 通信模式 
  - 请求 - 应答模式是 HTTP 协议最根本的通信模型
  - 请求 - 应答模式 也明确了 HTTP 协议里通信双方的定位，永远是请求方先发起连接和请求，是主动的，而应答方只有在收到请求后才能答复，是被动的，如果没有请求时不会有任何动作
  -  请求 - 应答模式 也导致了 WebService/ RESTful/ gPRC 等技术的出现


S5 HTTP 协议是无状态的，每个请求互相独立的，不要求客户端/服务器 记录请求信息
  - “状态”是指 客户端/服务器里保存的一些数据/标志，记录了 通信过程中的一些变化信息
  -  “无状态” 形象地来说就是 “没有记忆能力”

  - HTTP 在整个协议里 没有规定任何的“状态”，客户端和服务器永远是处在一种“ 无知 ”的状态。建立连接前两者互不知情，每次收发的报文也都是互相独立的，没有任何的联系。收发报文也不会对客户端或服务器产生任何影响，连接后也不会要求保存任何信息。

  - 但 HTTP 是“灵活可扩展”的，虽然标准里没有规定“状态”，但完全能够 在协议的框架里给它“打个补丁”，增加这个特性。
  
  - “无状态”的优点是：实现简单/ 减轻服务器负担/ 便于集群化负载均衡
  - “无状态”的缺点是：无法支持 有一系列的多个步骤的“事务”型操作


S6 HTTP是明文传输的，协议里的报文(header)不使用二进制数据，而是用可阅读的文本
  - 优点是 便于阅读和调试
  - 缺点是 传输内容不够安全：明文传输 + 无身份验证 + 无内容完整性校验

------
Q2 HTTP的双方如何 通信识别传输的数据类型
A:

S1 对于数据类型，HTTP使用了MIME规范的子集  (多用途互联网邮件扩展)
  - text：文本格式的可读数据，如 text/html、text/plain、text/css 等
  - image：图像文件，有 image/gif、image/jpeg、image/png 等
  - audio/video：音频和视频数据，如 audio/mpeg、video/mp4 等
  - application：数据格式不固定，可能是文本也可能是二进制，必须由上层应用程序来解释
，如application/json、application/javascript、application/pdf、application/octet-stream(未知类型，不透明的二进制数据)

S2 HTTP 在传输时为了节约带宽，有时候还会压缩数据
  - Encoding type 表明了 数据压缩的编码格式，这样对方才能正确解压缩，还原出原始的数据
  - 常用的有三种：
  - gzip：GNU zip 压缩格式
  - deflate：zlib（deflate）压缩格式，流行程度仅次于 gzip
  - br：一种专门为 HTTP优化的 新压缩算法（Brotli）
有了 MIME type 和 Encoding type，通信双方可以识别和处理 body数据了


S3 客户端用 Accept头表明 希望接收的 数据类型 和 支持的编码格式
  - Accept: text/html,application/xml,image/webp,image/png
  - Accept-Encoding: gzip, deflate, br
  - 如果 请求报文里没有 Accept-Encoding字段，就表示客户端不支持压缩数据

S4 服务器用 Content头表明 实际发送的数据类型 和 编码格式
  - Content-Type: text/html
  - Content-Encoding: gzip
  - 如果 响应报文里没有 Content-Encoding字段，就表示响应数据没有被压缩

--------
Q3 HTTP如何传输大文件
A:

S1 数据压缩
  -  Accept-Encoding  请求头字段 + Content-Encoding  响应字段
  - 缺点：通常只对文本文件有较好的压缩率，图片、音频视频等 多媒体数据 已经是高度压缩的，用gzip效果反而不佳

S2 "服务端的化整为零" ==> 分块传输
  - 请求/响应对： Transfer-Encoding: chunked 响应头字段
  - 和 "Content-Length" 响应字段互斥出现 (分块传输无法得知总长)
  
S2.3 分块传输的编码规范：
  - 长度头：表明这次流数据的长度 (16进制数字) + CRLF(回车换行，即\r\n)
  - 数据块：流数据传输内容 + CRLF
  - 结束分块：0 + CRLF

具体示意图，见
![分块传输 规范图](https://gitee.com/ygming/blog-img/raw/master/img/http8.png)

S3 "客户端的化整为零" ==> 范围请求
  - 请求/响应对： range: bytes=x-y 请求字段 + Accept-Ranges: bytes 响应字段

S3.2 服务端的处理流程：
  - 检查范围的合法性，非法时 服务器会返回 状态码416，意思是“范围请求有误”

  - 根据 Range头计算偏移量 + 读取文件片段，之后返回 状态码206 Partial Content，表示body只是原数据的一部分

  - 服务器添加 响应头字段 "Content-Range: bytes x-y/length"，说明片段的实际偏移量和资源的总大小

  - 发送数据，把片段用TCP发给客户端

  ```js
GET /16-2 HTTP/1.1
Host: www.chrono.com
Range: bytes=0-31
------------------------

HTTP/1.1 206 Partial Content
Accept-Ranges: bytes
Content-Length: 32
Content-Range: bytes 0-31/96

 
// this is a plain text json doc
```

S3.3 批量范围请求：
  - Range请求头有多个范围 + Content-Type：multipart/byteranges; boundary值
  - 响应的body规范：boundary + Content-Type + Content-Range
  - 最后用 "- -boundary- -" 表示所有的分段结束

见示意图
![批量范围 规范图](https://gitee.com/ygming/blog-img/raw/master/img/http9.png)

```js
GET /16-2 HTTP/1.1
Host: www.chrono.com
Range: bytes=0-9, 20-29
-------------------------

HTTP/1.1 206 Partial Content
Accept-Ranges: bytes
Content-Type: multipart/byteranges; boundary=00000000001
Content-Length: 189
Connection: keep-alive

--00000000001
Content-Type: text/plain
Content-Range: bytes 0-9/96
 
// this is
--00000000001
Content-Type: text/plain
Content-Range: bytes 20-29/96
 
ext json d
--00000000001--
```

-------------------
Q4 介绍 HTTP的连接管理机制
A:
S1 HTTP 0.9/1.0 连接机制：短连接/无连接
  - 每次的请求-响应(4个包，2个RTT)，都需要花费 "三次握手"(1个RTT) + "四次挥手"(2个RTT)，使用浪费率为 3/5=60%

![短连接缺点](https://gitee.com/ygming/blog-img/raw/master/img/http10.png)


S2 HTTP1.1 连接机制：长连接
  - 只在第一次发生请求时 新建TCP握手，之后的请求都复用这个TCP连接，本质是 "成本均摊"
  - 使用 通用头字段 "Connection: keep-alive"
  - 保持TCP连接 需要服务器 消耗内存保存状态，所以如果有大量长连接只连不发，就会很快耗尽服务器的资源，即所谓的 DDOS

S3.2 所以服务器需要使用 合适的策略，以关闭长连接
  - 客户端主动发送 请求头字段 Connection: close
  - 连接时长 角度：设置长连接的超时时间(keepalive_timeout)，在一段时间内 连接上没有任何数据收发 就主动断开连接
  - 处理请求数量 角度：设置长连接内 可发送的最大请求次数(keepalive_requests)，当在这个连接上处理了 N个请求后，就会主动断开连接

S4 处理 "队头堵塞" 问题：
  - 所谓 "队头堵塞"，是指HTTP规定 服务器要按入队时间来处理HTTP请求，当 前一个请求的处理耗时很长后，后面的请求就只能被堵塞，进入等待
  
  - 方法1 "并发连接"：客户端 同时对一个域名发起多个长连接，用数量来解决质量的问题。但是这种方法不能滥用(服务器需要承载 用户数×并发数的 长连接)，实际一般是 并发 6~8个连接

  - 方法2 "域名分片"：多开几个域名(如 x1.chrono.com / x2.chrono.com)，而这些域名都指向同一台服务器 X.chrono.com，这样 实际长连接的数量就又上去了


