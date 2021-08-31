# 网络之 HTTP状态码

Q1: HTTP的状态码有哪些
A:

S1  1XX 提示信息，表示  协议正在处理中，还需要后续的操作
  - 101 Switching Protocols: 协议升级,  比如把HTTP升级为 websocket/ http2


S2  2XX 成功
  - 200 OK： 表示 请求被正确处理

  - 201 Created：请求已被实现，而且有一个新的资源 已经依据请求的需要 而建立

  - 202 Accepted：请求已接受，但是还没执行，不保证完成请求

  - 204 No content：表示请求成功，但响应报文不含 body数据实体

  - 206 Partial Content：HTTP 分块下载/断点续传的基础，在客户端发送 "范围请求"/部分获取资源时出现，表示 服务器成功处理了请求，但body里的数据不是资源的全部，而是其中的一部分。通常还会伴随着头字段 "Content-Range"，表示响应报文里 body 数据的具体范围，供客户端确认，如 "Content-Range: bytes 0-99/2000"，意思是此次获取的是  总计2000个字节的 前100 字节


S3  3XX 重定向，资源位置发生变动，需要客户端重新发送请求

  - 301 moved permanently: 永久重定向，资源已被分配了新的URL, 对应为 `Location响应报文`

  - 302 found: 临时重定向，表示 资源临时被分配了新的URL，对应为 `Location响应报文`

  - 303 see other: 表示资源存在着另一个URL，应使用 GET方法获取资源

  - 304 not modified: 表示资源未修改，用于缓存控制。它不具有通常的跳转含义，但可以理解成“重定向已到缓存的文件”（缓存重定向）。一般用于 If-Modified-Since等条件请求

  - 307 temporary redirect: 临时重定向，和302含义相同, 可用于`hsts跳转/ 避免ssl剥离攻击`

PS：
  - 302是http1.0的协议状态码，在http1.1版本为了细化302状态码 出现了303和307
  - 303: 明确表示客户端应当采用get方法获取资源，他会把POST请求变为GET请求进行重定向
  - 307: 会遵照浏览器标准，不会从post变为get


S4  4XX 客户端错误，请求报文有误，服务器无法处理
  - 400 bad request: 请求报文 存在语法错误，是一个通用的/笼统的 错误码

  - 401 unauthorized: 请求需要通过 HTTP认证信息 

  - 403 forbidden: 服务器禁止访问该资源

  - 404 not found: 在服务器上 没有找到请求的资源 

  - 405 Method Not Allowed：不允许使用某些方法操作资源，如不允许POST

  - 406 Not Acceptable：资源无法满足客户端请求的条件，如请求中文但只有英文

  - 408 Request Timeout：请求超时，服务器等待了过长的时间

  - 409 Conflict：多个请求发生了冲突，可以理解为多线程并发时的竞态

  - 413 Request Entity Too Large：请求报文里的 body太大

  - 414 Request-URI Too Long：请求行里的 URI 太大

  - 429 Too Many Requests：客户端发送了太多的请求，通常是由于服务器的限连策略

  - 431 Request Header Fields Too Large：请求头某个字段或总体太大


S5  5XX 服务器错误，服务器在处理请求时内部发生了错误
  - 500 internal sever error: 服务器端在执行请求时 发生了错误

  - 501 Not Implemented：表示客户端请求的功能还不支持

  - 502 Bad Gateway：通常是服务器作为网关或者代理时返回的错误码，表示服务器自身工作正常，访问 后端服务器时发生了错误，但具体的错误原因也是不知道的

  - 503 Service Unavailable：表示服务器当前很忙，暂时无法响应服务；503 是一个“临时”的状态，很可能过几秒钟后服务器就不那么忙了，可以继续提供服务，所以 503 响应报文里通常还会有一个“ Retry-After ”字段，指示 客户端可以在多久以后再次尝试发送请求。

  - 505 http version not supported: 服务器不支持/拒绝支持 在请求中使用的 HTTP版本