# CSS选择器

目录

1 [预读文档](#1)

2 [选择器优先级](#2)

3 [选择器类型](#3)

4 [not选择器的使用](#4)


## <span id="1"> 1 预读文档</span>

1 预读文档:

01 [CSS 选择器参考手册](http://www.w3school.com.cn/cssref/css_selectors.asp)

阅读原因: 列举了所有选择器和示例，适合快速查阅

02 [CSS选择器整理](https://segmentfault.com/a/1190000007815822)

阅读原因: 解释了一些较难选择器的含义

03 [MDN— CSS选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)

阅读原因: 有更多的直观示例


## <span id="2">2 选择器优先级 </span>

1 Q: 选择器的优先级是什么

A: S1 !import > 内联样式 > ID选择器 > 类选择器 > 标签选择器 > 继承 > 浏览器默认


## <span id="3"> 3 选择器类型 </span>

1 Q: CSS中有哪些类型的选择器

A: 有以下类型:

S1 通用选择器:        *

S2 id选择器:          #idName

S3 类选择器:          .className

S4 元素选择器:        main


S5 后代选择器:        div p / .class1  .class2

S6 子元素选择器:      A > B

S7 相邻选择器:        p1 + p2

S8 兄弟选择器:        A ~ B


S9 属性选择器:        input[type="text"]

S10 伪类选择器:        :nth-child(n)

S11 伪元素选择器:      ::after

S12 多类选择器:       .class1.class2

S13 派生选择器:       p1, p2 {xxx}


2 Q: 属性选择器有哪些具体子类

A: 

S1 简单属性选择
    
a[class/href]:  选中所有 含有 href/class属性（属性值不限）的 a元素

a[href][title]: 选中 同时含有 href + title属性（属性值不限）的 a元素


S2 具体属性值

a[href='xxx']:  选中 含有 href属性 + `属性值严格等于/完全匹配xxx`的 a元素

a[href='xxx'][title='yyy']: 选中 同时含有 href(属性值严格等于xxx) + title属性(属性值严格等于yyy)的 a元素;


S3 部分属性值（子串值 属性选择器）

a[href~='xxx']:  选中 含有 href属性 + `属性值中包含xxx即可`的 a元素;

P[lang |='en']:  选中 含有 lang属性 + `属性值中等于en/ 以en开头`的 p元素;


3 Q: 类选择器和id选择器的区别联系

A: 

S1 在HTML中，都区分大小写

S2 id属性的值是唯一的，而class属性值可以重复

S3 一般实际开发情况下，id给js用，class给css用

S4 应该根据 “他们是什么”来为元素命名，而不是“他们的外观是什么”


## <span id="4">4 not选择器的使用 </span>

1 Q: 如何选择 除了.active的所有div元素

A:

```CSS
div:not(.active)
```


