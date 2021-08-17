# 网络之 DNS详解

### 目录

1 [预读文档](#1)

2 [DNS 介绍](#2)

3 [DNS 域名解析过程](#3)

4 [DNS 应用](#4)


## <span id="1">一 预读文档 </span>

01 [透视HTTP协议-06](/)

阅读原因: 直接 参考文档


## <span id="2"> 二 DNS介绍 </span>

Q1: 什么是DNS，有什么作用

A:

- S1 DNS即 域名解析系统, 它的作用是 `把域名 转换成对应的 IP地址`


Q2: 什么是域名, 有什么作用

A:

- S1 域名的层级关系是 `从右向左依次降低`

```html
"time.geekbang.org"
  "org"是 顶级域名；
  "geekbang"是 二级域名
  "time"是 主机名
```

S2 域名的作用有:

- 把 IP转变为 更好记忆的方式;

- 用来标识虚拟主机，决定由哪个虚拟主机来 对外提供服务

```nginx
server {
  listen 80;                       # 监听 80 端口
  server_name  time.geekbang.org;  # 主机名是 time.geekbang.org
  ...
}
```

- 域名 还是个命名空间系统, 可以解决 `资源重名问题`


## <span id="3"> 三 DNS域名解析过程 </span>

Q1: 介绍下 DNS域名解析的过程

A:

- S1 DNS的核心系统是一个 `三层的 树状 分布式服务，来对应域名 结构`

```
根域名 服务器(Root DNS Server): 返回 "com/cn" 等 顶级域名服务器的 IP地址

顶级域名服务器(Top-level DNS Server): 管理各自域名下的 权威域名服务器
    比如 com顶级域名服务器 可以返回 apple.com域名服务器的 IP地址

权威域名服务器(Authoritative DNS Server)：管理自己域名下 主机的IP地址
    比如 apple.com权威域名服务器可以返回  www.apple.com的 IP地址
```

比如，要访问 "www.apple.com"，就要进行下面的三次查询：
> 访问 根域名服务器 => 获得 com顶级域名服务器的 地址
> 访问 "com"顶级域名服务器 => 获得 "apple.com"权威域名服务器 的地址
> 访问 "apple.com" 域名服务器 => 获得 "www.apple.com" 的 IP地址


- S2 DNS的优化手段是 利用`DNS 缓存`

```HTML
浏览器缓存

操作系统 缓存

hosts文件: 如果操作系统在缓存里找不到 DNS记录，就会再寻找这个文件

非权威 域名服务器(本地⽹卡分配): hots文件也找不到，就会查找这些 DNS的代理查询, 他们本身也会有缓存

根域名 服务器

顶级域名 服务器

权威域名 服务器
```

![DNS 3层树状 分布式图](https://s1.ax1x.com/2020/04/15/JP0fM9.md.png)

## <span id="4"> 四 DNS 应用 </span>

Q1: DNS 有哪些应用

A:

- S1 "域名- IP重定向":  xxx.com 原本对应1.2.3.4, 通过DNS修改为 5.6.7.8

- S2 配置 内部子域名:  prices.xx.app + iamges.xx.app

- S3 基于域名的 负载均衡:
  
  (1) 域名 --- 轮询 -->  IP1/IP2/IP3
  
  (2) 域名  -- 通过设置DNS --> 返回最近/质量最好的 服务器IP