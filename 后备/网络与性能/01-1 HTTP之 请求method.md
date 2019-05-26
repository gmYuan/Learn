# HTTP之 请求方法(Request Method)

目录:

1 [预读文档](#1)

2 [HTTP请求方法有哪些](#2)


## <span id="1">1 预读文档 </span>

1 [HTTP请求方法](https://itbilu.com/other/relate/EkwKysXIl.html)

阅读原因: 比较全面的介绍了 HTTP的请求方法类型和含义



## <span id="2"> 2 HTTP请求方法有哪些 </span>

1 Q: HTTP请求方法有哪些

A: 

S1 GET:     请求 服务器上资源

S2 HEAD:    请求 服务器上资源的，但返回的响应中不会有 响应主体部分

S3 OPTIONS: 查询 服务器上该资源 所支持的所有 HTTP请求方法

S4 POST:    向指定资源 提交数据

S5 PUT:     上传某个资源的最新内容到 服务器

S6 DELETE:  删除指定的资源


S7 CONNECT: 在请求响应之间 建立隧道

S8 TRACE:   让服务器回显 之前收到的 请求信息

S9 PATCH:   可以局部更新文件的某段内容 + 不存在文件时会新建
