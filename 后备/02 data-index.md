# data-*

## 一 目录

目录

1 [预读文档](#1)

2 [知识详解](#2)

  - [2.1 data-* 含义和作用](#2.1)

## <span id="1">一  预读文档</span>

1 阅读文档有:

[01 阮一峰教程— 属性的操作](https://javascript.ruanyifeng.com/dom/attribute.html)

阅读原因: dataset部分知识点很全面介绍了data-*相关语法

02 [JS高级程序设计— 11.3.5自定义数据属性](/)

阅读原因: 同上，但是知识点基本相同，可略过


## <span id="2">二  知识详解</span>

### <span id="2.1"> 2.1 data-* 含义和作用 </span>

1 Q: data-* 的含义是什么，有什么作用

A: 用来 自定义HTML元素属性

S1 可以通过自定义元素属性，来对某些标记元素进行 针对性的操作

S2 注意 `ele.dataset.xxx`返回的结果是 字符串
