# 理解HTML语义化

目录

1 [预读文档](#1)



2 [HTML语义化](#2)

 

   - [2.1 什么是HTML语义化](#2.1)

 

   - [2.2 为什么要实现HTML语义化](#2.2)

 

   - [2.3 如何实现HTML语义化](#2.3)

 


## <span id="1"> 一 预读文档 </span>

阅读文档

1 [什么是语义化的HTML](https://www.kancloud.cn/z591102/interview/894469)

阅读原因: 前端面试题库里的文章，有参考答案


2 [到底什么是HTML 语义化](https://github.com/zhanyouwei/blog-source/issues/6)

阅读原因: 全面的参考文档

3 [HTML5语义化](https://zhuanlan.zhihu.com/p/32570423)

阅读原因: 对如何实现语义化的那一部分写的很好



## <span id="2"> 二 HTML语义化 </span>



### <span id="2.1"> 2.1 什么是HTML语义化 </span>



1 Q: 什么是HTML语义化

A: S1 HTML语义化是指 使用标签要符合其标准语义，而不是为了样式效果 误用或滥用HTML标签

S2 要合理分析页面结构，使用如header/nav/article/aside/footer等标签，从而让页面内容结构化

S3 从而使代码 便于阅读和维护，同时也可以让 浏览器/爬虫等 更好地解析页面


### <span id="2.2"> 2.2 为什么要实现HTML语义化 </span>


1 Q: 为什么要实现 HTML语义化 / HTML语义化的好处有哪些

A: S1 可以提高代码的可读性，语义化的HTML 在没有CSS的情况下 也能呈现较好的内容结构与代码结构

S2 有利于SEO，有助于爬虫抓取更多的有效信息

S3 可以方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备），提高用户体验


### <span id="2.3"> 2.3 如何实现HTML语义化 </span>

1 Q: 如何实现 HTML语义化

A: S1 根据页面内容及其结构，选择合适的标签

S2 尽可能少的使用无语义的标签div和span，避免因为样式效果而使用某个元素，如h1/table等

S3 使用html5引入的一系列语义化标签，包括: header/nav/main/article/aside/footer等标签


