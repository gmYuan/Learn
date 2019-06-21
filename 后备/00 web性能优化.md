# web性能优化

目录:

1 [预读文档](#1)

2 [web资源过程简介](#2) 

3 [性能优化方法](#3)


## <span id="1"> 1 预读文档 </span>

1 [web性能优化方法](https://xiedaimala.com/tasks/17aa2419-1450-425d-9d53-c20b08598b46)

阅读原因: web性能优化的 参考文档和视频

2 [雅虎前端优化35条规则](https://github.com/creeperyang/blog/issues/1)

阅读原因: 比较流行的 web性能优化方法介绍


## <span id="2"> 2 web资源过程简介 </span>

1 Q: 一般 web获取资源的过程有哪些

A: 

S1 输入域名后，进行DNS查询

S2 建立TCP连接

S3 发起HTTP请求

S4 等待和接收HTTP响应

S5 获取到HTML资源，分析Doctype + 逐行解析标签

S6 并行下载CSS，串行渲染CSS

S7 并行下载JS，串行执行JS


## <span id="2"> 2 性能优化方法 </span>

1 Q: 一般 web性能优化的常见方法有哪些

A: 

S1 输入域名后，进行DNS查询

方法1: 减少资源引入的 域名数量，从而减少DNS查询


S2 TCP连接

方法2: 使用keep-live创建，从而实现 连接复用

方法3: 使用HTTP/2.0，从而实现 多路复用
 

S3 发起HTTP请求

方法4: 减少HTTP请求的数据体积— 减少cookie数量

方法5: 减少HTTP请求的数据体积— 使用GZip压缩文件内容

方法6: 减少HTTP请求的数量—     合并多个CSS/JS文件 成一个文件

方法7: 减少发送HTTP请求—       使用cache-control缓存文件

方法8: 同时发送多个HTTP请求—   不同资源类型，使用不同的二级域名，从而并发下载资源



S4 等待和接收HTTP响应

方法9:  减少响应文件大小—  使用ETag判断资源是否304

方法10: 减少响应文件距离—  使用CDN


S5 获取到HTML资源，分析Doctype + 逐行解析内容

方法11: 正确写明 html文件的Doctype，便于浏览器按正确标准解析内容

方法12: 合理使用 懒加载/预加载技术


S6 并行下载CSS，串行渲染CSS + 并行下载JS，串行执行JS

方法13: CSS文件放在head内，JS文件放到html尾部

