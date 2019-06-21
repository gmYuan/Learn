# BOM之 Location / URL / URLSearchParams对象详解

## 一 前言

最近学习了BOM对象的相关知识，所以对其做一下小结

本篇主要介绍 Location 对象，URL 对象，URLSearchParams 对象

目录

1 [Location 对象](#1)

    - [1.1 属性](#1.1)

    - [1.2 方法](#1.2)




## <span id="1">一  Location 对象</span>

1 Location对象是浏览器提供的原生对象，提供 URL相关的信息和操作方法

2 通过window.location和document.location属性，可以获取到这个对象


### <span id="1.1"> 1.1 属性 </span>



### <span id="1.2"> 1.2 方法 </span>

1 Location.reload()

S1 作用: reload方法使 浏览器重新加载当前网址，相当于按下浏览器的刷新按钮

S2 语法: 接受一个布尔值作为参数

> 如果参数为true，浏览器将向服务器重新请求这个网页，并且重新加载后，网页将滚动到头部

> 如果参数是false/为空，浏览器将从本地缓存重新加载该网页，并且重新加载后，网页的视口位置是重新加载前的位置

```js
location.reload()     //重新加载（有可能从缓存中加载）

location.reload(true)  //重新加载（从服务器重新加载）
```

以上可参考

[01 阮一峰教程— Location对象/ URL对象/ URLSearchParams对象](https://wangdoc.com/javascript/bom/location.html)

[02 JS高级程序设计 8.2.2](https://book.douban.com/subject/10546125/)









