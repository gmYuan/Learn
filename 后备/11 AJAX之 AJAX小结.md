# AJAX+跨越详解

## 一 前言

最近学习了AJAX和跨域相关的知识，所以对其做一下详解。
又是一篇长文的节奏~~


## 二 可以发生请求的途径

1 在介绍AJAX之前，先明确一下我们可以有哪些可以向服务器发生请求的方法
  S1 方法1: 通过`form表单`(具体可参考 [MDN的 创建首个HTML表单](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Forms/Your_first_HTML_form))
  
  S2 方法2: 通过`a标签`发请求(get)
  以上两个的缺点是: 会刷新页面或新开页面, 且只支持 get/post请求

  S3 方法3: 通过 `img标签`发请求(get)，但只能以图片形式展示
           通过 `link标签`可以发 get请求，但是只能以 CSS、favicon的形式展示
           通过 `script标签`可以发 get请求，但是只能以脚本的形式运行

2 引入AJAX的原因:
  希望有方式可以实现,
    get、post、put、delete请求都行 + 想以什么形式展示就以什么形式展示


## 三 AJAX相关

1 什么是AJAX
S1 异步的 JavaScript和XML:
	使用 XMLHttpRequest 发请求
	服务器返回 XML格式的字符串(现在都使用JSON)
	JS 解析XML，并更新局部页面


2 具体过程
  S1 客户端发起请求A
  S2 服务器后台: 根据url情况，读取文件资源（一般是html文本），并设置成响应A返回

  S3 如果 返回的html文件里，含有script标签时，客户端会再次向服务器发起src指向的 脚本内容请求B
  S4 服务器后台要针对请求B，再次处理(读取服务器前端写的 JS文件内容，并作为响应内容B返回)
  S5 JS里监听 某个页面元素的点击事件，发送AJAX请求C

  S5 AJAX请求C 的步骤:
    (1) 创建一个请求实例对象 `var request = new XMLHttpRequest();`
    (2) 初始化对象，并传入请求参数(请求方法和请求路径) `request.open('get','/xxx');`
    (3) 设置请求参数等
    (4) 发送请求 `request.send();`

  S6 服务器 处理Ajax请求C:
   (1) 接收到请求路径，后台设置对应路径的处理方法（代码） `if (path === '/xxx')`
   (2) 服务器 返回响应C —json文件 `response.write(...)`

  S7 客户端接收并读取 响应C:
  A1 监听响应状态变化的属性(回调函数) `request.onreadystatechange`
     (1)当状态为4时，说明响应体已全部返回 `request.readyState`
     (2)当响应头为200时，说明响应是成功的 `request.status`
     (3)此时读取响应内容 `request.responseText`

  A2 一般情况下，后台的响应都是JSON格式的数据，所以需要做格式处理
    (1)关于JSON语法介绍,可参考SP34-2
    (2)获取返回数据（字符串格式）+ 转化成对象格式`JSON.parse`
    (3)使用对象访问属性的语法，来获取数据值


3 XMLHttpRequest对象
S1 兼容IE7以下的XHR对象代码，可参考高程P572,这里暂不赘述

S2 XHR对象方法:
  (1) open()方法: 初始化请求
  (2) send()方法: 发送请求

S3 浏览器接收到响应后，会将其自动转化为XHR对象的 相关属性:
  (1) responseText属性:             响应内容
  (2) status属性 + statusText属性： 状态码+说明文字

S4 异步请求时 使用到的相关 事件回调函数和属性
  (1) onreadystatechange()事件回调函数:  触发readystatechange事件时调用的函数
  (1) readyState属性:                   请求/响应过程的当前活动阶段

以上代码见下:
```js
var xhr = new XMLHttpRuquest();
xhr.onreadystatechange = function(){
  if (xhr.readyState === 4){
    if (xhr.status >= 200 && xhr.status <300 || xhr.status === 304){
      console.log(xhr.responseText)
    } else {
      console.log("Request was unsuccessful: " + xhr.status)
    }
  }
}

xhr.open("get", "example.txt", true);
xhr.send();
```


4 用AJAX设置 请求头(体)+响应头
S1 常见请求头含义，见高程P575

S2 自定义发送 HTTP请求头(在open和send之间调用) `xhr.setRequestHeader()`
   且要成功发送请求头部信息，setRequestHeader()必须open()调用后 + send()方法调用前

S3 自定义发送 HTTP请求体  `xhr.send(requestBody)`

S4 获取响应头部分 `xhr.getResponseHeader()` 或 `xhr.getAllResponseHeaders()`

S5 获取响应说明文字 `xhr.statusText`

S6 使用GET请求时，查询字符串需要进行编码。相关代码可参考 高程P576-577


## 四 XMLHttpRequest 2级

1 FormData类型 
S1它简便了 序列化表单 + 创建与表单格式相同的数据(用于 通过XHR传输)
  例子代码可参考 高程P578

2 超时设定
S1 xhr对象新增一个timeout属性，表示请求在等待响应多少毫秒之后就终止
   timeout设置一个数值—— 如果在规定时间内没有接收到响应—— 触发timeout事件—— 调用ontimeout 事件处理程序

3 overrideMimeType()方法
S1 overrideMimeType()方法 用于重写 XHR响应的MIME类型

S2 调用`xhr.overrideMimeType()` 必须在send()方法之前
   例子代码可参考 高程P580


## 五 进度事件

1 xhr有6个进度事件: loadstart/progress/error/abort/load/loadend
 

2 load事件
S1 响应接收完毕后 将触发 load事件，因此不用去检查 readyState属性了

S2 onload事件处理程序会接收到一个 event对象，其 target属性就指向 XHR对象实例，
   因而可以访问到 XHR对象的所有方法和属性

S3 但因为浏览器实现原因，因此还是要使用 XHR对象变量


3 progress事件
S1 progress事件 会在浏览器接收新数据期间 周期性地触发

S2 onprogress事件处理程序会接收一个event对象，其 target属性是 XHR对象
   它包含3个额外属性： lengthComputable + position + totalSize 
   它们可以为用户 创建一个进度指示器

S3 必须在调用 open()方法之前添加 onprogress事件处理程序
   具体代码可参考 高程P581


## 六 跨域相关


1 什么是 同源策略
S1 原则: 只有 协议+域名+端口 都一样，才可以发送AJAX请求

S2 原因: 如果没有同源策略，那么就可以通过url任意访问私密的个人信息（即为了信息隐私和安全）


2 突破同源策略/跨域 的方法(A网站前台可以访问到 B网站的后台数据)
S1 方法一: CORS(Corss-origin resource sharing)
  A1 A网站 发送请求头 `Origin: 协议+域名+端口` 
  A2 B网站 服务器后台设置数据头 `response.setHeader('Access-Control-Allow-Origin','协议://A域名:port')`

  A3 跨域XHR对象有一些限制,具体见高程 P584

  A4 Preflighted Reqeusts  和 带凭据的请求 知识点，了解即可


S2 方法二: 图像Ping
  A1 






方法一: JSONP












### 3.4 封装AJAX

1 构建独立的函数`Jquery`:返回一个对象，对象里有多个属性
2 增加属性`window.Jquery.Ajax`,值是一个 封装函数
3 当一个函数的参数有多个时: 可以先封装这些参数为一个对象，然后把对象作为函数参数传入，好处是:
    key-value对，便于理解参数含义  +  传入的参数个数可以更灵活（而不用使用占位符）

4 回调函数：AJAX函数调用时，传入的定义函数，就是回调函数
  也就是说，A函数在定义时，调用了B函数，而这个B函数又是调用A函数时传入的参数.代码表示为

```js
function A(B){
  B.call(undefined,argu1)
}

A((x) => {console.log(x)})

```

5 如果回调函数里想执行多个函数，方法同上
6 传入请求header的方法
  S1 传入实际header参数（对象）
  S2 遍历对象: `for..in语句`
7 函数接收可选参数的实现方法: `arguments.length`

以上具体代码可参考:[Ajax参数封装](https://github.com/gmYuan/node-Ajax/blob/v1.0/main.js)