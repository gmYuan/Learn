# 网络之 XSS + CSRF 详解

## 目录

1 [预读文档](#1)

2 [XSS相关](#2)

3 [CSRF相关](#3)


## <span id="1">一 预读文档 </span>

01 [寒冬求职之你必须要懂的Web安全](https://juejin.im/post/5cd6ad7a51882568d3670a8e)

02 [前端安全系列（一）：如何防止XSS攻击](https://juejin.im/post/5bad9140e51d450e935c6d64#heading-14)

03 [前端安全系列之二：如何防止CSRF攻击](https://juejin.im/post/5bc009996fb9a05d0a055192)

阅读原因: 直接 参考文档


## <span id="2"> 二 XSS相关 </span>

1 Q: 什么是 XSS

A:

S1 跨站脚本攻击 + 攻击者 注入恶意的 html标签/JS代码，从而获取用户信息等内容;

S2 XSS的本质是：恶意代码未经过滤 + 浏览器无法区分哪些脚本是可信的，导致恶意脚本被执行


2 Q: XSS的类型有哪些

A:

S1 反射型: 如 搜索 + href/src等跳转属性 + POST参数

攻击者构造出特殊的 URL，其中包含恶意代码 => 服务端将恶意代码从 URL 中取出，在响应内容中 包含这段XSS代码 => 返回给浏览器 解析执行


S2 存储型: 如 评论功能

攻击者提交一段XSS代码  => 服务器端接收并存储  => 其他用户访问这个接口内容时，都会执行这段恶意代码


S3 DOM型：如 onload/onerror等事件

攻击者构造出特殊数据，其中包含恶意代码 => 前端JS 解析执行了 URL 中的恶意代码

它属于 前端JS自身的 安全漏洞


3 Q: 如何防御 XSS

A:

S1 对明确的输入类型，进行 格式检查： 如 邮箱/ 电话号码等;

S2 对 HTML标签+JS代码 进行编码转义, 要在不同的上下文里, 使用相应的转义规则：

如 HTML标签 文字内容/ HTML标签 属性值/ HTML标签 内联监听器/ CSS属性值/ CSS的URL/ URL路径/ URL参数

S3.1 尽量避免使用 .innerHTML/ .outerHTML/ document.write()/ eval()/ 

S3.2 尽量避免使用 DOM中的 内联事件监听器, 如 onerror/ onload

S4 开启CSP：禁止加载外域代码/ 禁止外域提交

```js
Content-Security-Policy: default-src 'self'

<meta http-equiv="Content-Security-Policy" content="form-action 'self';">
```

S5 开启 HttpOnly属性



## <span id="3"> 三 CSRF相关 </span>

1 Q: 什么是 CSRF

A:

S1 跨站请求伪造： 攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站 发送跨站请求

S2 典型的 CSRF攻击流程：

(1) 受害者登录 A站点，并保留了 登录凭证(Cookie);

(2) 攻击者诱导受害者访问了 站点B

(3) 站点B 向 站点A 发送请求 + 浏览器会默认携带 站点A的 Cookie信息;

(4) 站点A执行了 站点B的请求

![CSRF攻击流程](https://user-gold-cdn.xitu.io/2019/5/15/16abb8d5ab69386f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


2 Q: CSRF的 攻击特点是什么

A:

S1 攻击一般发起在 第三方网站;

S2 攻击者并不能获取到受害者的 登录凭证，仅仅是 "冒用" (cookie有同源策略);

S3 跨站请求可以用各种方式：图片URL、超链接、CORS、Form提交

根据这3个特点，就可以制定 CSRF的防御策略


3 Q: 如何防御 CSRF

A:

S1 同源检测： 用 `Origin Header / Referer Header:same-origin`确定 来源域名 + 如果 Origin和Referer都不存在，直接进行阻止

S2 添加验证码: 体验不够好，但是在关键敏感步骤时 可以使用

S3 使用Token:

- (1) 服务端给用户 生成一个token，加密后传给用户
- (2) 用户在提交请求时，需要携带 这个token
- (3) 服务端 验证token是否正确

S4 Samesite Cookie属性: `Set-Cookie响应头新增Samesite属性: Strict/Lax`

```JS
Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
```