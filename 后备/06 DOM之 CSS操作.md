# DOM之 CSS 操作

## 前言

最近学习了DOM中关于CSS操作的 相关知识，所以对其做一个小结

主要介绍如何通过 JavaScript 操作 CSS

目录

1 [HTML元素的style属性](#1)

2 [CSSStyleDeclaration 接口](#2)

  - [简介](#2.1)

  - [CSSStyleDeclaration 实例属性](#2.2)

  - [CSSStyleDeclaration 实例方法](#2.3)

3 [CSS 模块的侦测](#3)

4 [CSS 对象](#4)

5 [window.getComputedStyle()](#5)

6 [CSS 伪元素](#6)
    
7 [StyleSheet 接口](#7) 
       
......
   
## <span id="1">一 HTML元素的style属性</span>

1 操作CSS 样式方法一: 使用元素节点的getAttribute方法、setAttribute方法和removeAttribute方法

```js
div.setAttribute(
  'style',
  'background-color:red;' + 'border:1px solid black;'
);

// 相当于下面的 HTML 代码。
<div style="background-color:red; border:1px solid black;" />
```
2 但是，style不仅可以使用字符串读写，它本身还是一个对象，部署了 CSSStyleDeclaration 接口

```js
e.style.fontSize = '18px';
e.style.color = 'black';
```

## <span id="2">二 CSSStyleDeclaration 接口</span>

### <span id="2.1">2.1 简介 </span>

1 接口作用: CSSStyleDeclaration接口用来 操作元素的内联样式

2 它可以直接读写 CSS 的样式属性,但有一些注意点见下例

```js
var divStyle = document.querySelector('div').style    // 2.S1 style属性的值是一个 CSSStyleDeclaration 实例

divStyle.backgroundColor = 'red';      // 2.S2 连词号需要变成骆驼拼写法
divStyle.cssFloat = ‘left’           // 2.S3 CSS属性名是保留字，则规则名之前需要加上字符串css，这里float写成cssFloat

divStyle.border = '1px solid black'    // 2.S4 属性值都是字符串，设置时必须包括单位，但不含结尾的分号
divStyle.width = '100px';
divStyle.height = '100px';
divStyle.fontSize = '10em';

divStyle.backgroundColor    // red
divStyle.border 	    // 1px solid black
divStyle.height 	   // 100px
divStyle.width             // 100px
```



以上内容可参考

[01 JS高级程序设计 第12.2.1](https://book.douban.com/subject/10546125/)

[02 阮一峰 CSS 操作](https://wangdoc.com/javascript/dom/css.html)


