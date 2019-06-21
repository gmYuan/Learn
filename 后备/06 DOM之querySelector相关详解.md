# DOM之 querySelector相关详解

## 一 前言

最近学习了 querySelector相关知识点，所以做一个小结。

## 二 选择符API

1 选择符API的核心是: querySelector() 和 querySelectorAll()方法
  他们可以用于 Document节点类型 和 Element节点类型


2 querySelector()方法
S1 参数是合法的 CSS选择器;

S2 返回值是 与选择器相匹配的第一个元素 / null;

S3 `document.querySelector("选择器")`: 在整个文档范围内查找元素;
   `ele.querySelector("选择器")`: 只会在ele的 后代元素范围内 查找


3 querySelectorAll()方法 
S1 参数是合法的 CSS选择器;

S2 返回值是 含有所有匹配元素 的NodeList实例(不是动态集合，而是类似于当前状态的快照)

S3 下标索引调用的是 `NodeList.item()方法`


4 matchesSelector() 方法
  暂略






## 参考文档

[01 JS高级程序设计 第11.1 选择符API](https://book.douban.com/subject/10546125/)
[02 阮一峰——document对象](https://javascript.ruanyifeng.com/dom/document.html#toc12)
