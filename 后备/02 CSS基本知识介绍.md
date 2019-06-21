# CSS基本介绍

## 一 前言

目前在做IFE的练习，初步学习到CSS内容，所以做了总结。
本博文 主要分为两部分，第一部分介绍HTML的发展，第二部分则介绍了CSS基本概念

## 二 HTML的发展

### 2.1 语义化和结构化的重要性

S1 便于搜索引擎建立内容索引;
S2 便于开发和维护;
S3 便于盲人等特殊用户使用

### 2.2 为什么要引入CSS

S1 随着发展， 之前描述结构的HTML同时也需要描述外在表现了
   这就造成了 HTML的结构混乱，和代码冗余

S2 CSS提供了更多的 足够丰富的样式

S3 减少代码冗余，样式分离后便于代码维护

S4 可以实现在多个页面上复用同一套基本样式

S5 独立了样式内容，减少了HTML的文件大小

## 三、CSS基本概念术语

### 3.1 元素

S1 每个HTML元素都会生成一个框box,其中包含元素内容

S2 元素分类
    A1 可以分为 替换元素/非替换元素
    A2 可以分为 块级元素/行内元素
       块级元素框默认会填充 父元素的全部内容区;
       `在HTML/XHTML中，行内元素不能包含块级元素，但在CSS中没有这种限制` (P16)

### 3.2 引入CSS

S1 外部样式表: HTML的 `<link>元素`
              A1 有一个`media属性`，值可以取 screen / print / all ....
              A2 一个样式表同时用于多个媒体中: `<link rel... media="screen, print">`
              A3 候选样式表 `<link rel="alternate stylesheet" title="Big text">`（P23）

S2 文档样式表: HTML的 `<style>元素`
              A1 @import指令也用于加载外部样式表， 但是它必须是style的第一行内容，否则会被忽略;
              A2 和link的候选样式表不同，每个@import指令的样式都会被加载使用;
              A3 也可以通过媒体查询，限制导入的外部样式表 (P25)
              A4 一般常用在 一个外部样式表中

S3 内联样式:  HTML的 `<xxx元素 style="xxx"属性>`

### 3.3 CSS实际是如何工作的

S1 CSS的结构是  CSS 语句 -> CSS规则 -> 选择器+声明语句块  -> 每条声明语句: 属性和值

S2 处理过程是: 载入HTML -> 解析HTML -> 下载CSS -> 解析CSS -> 创建DOM树 -> 内存表示

## 四 文档类型、DOCTYPE切换和浏览器模式

### 4.1 文档类型

S1 我们知道，html和CSS有不同的版本，每个版本的语法内容/有效规则各不相同;
S2 浏览器需要有一组规则，从而告诉它如何解析页面的语法规则/内容，这就是DTD(文档类型定义)
    它用来明确使用的是哪个版本的解析规则，从而正确处理页面(有效性验证)

S3 我们通过DOCTYPE声明,来告诉浏览器使用哪个DTD

### 4.2 DOCTYPE切换

S1 根据DOCTYPE是否存在，浏览器选择呈现模式（标准模式/兼容模式），称作 DOCTYPE切换

## 五、参考文档

&emsp;&emsp;[1 CSS权威指南;](https://book.douban.com/subject/2308234/)
&emsp;&emsp;[2 MDN的 CSS如何工作;](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Introduction_to_CSS/How_CSS_works)
&emsp;&emsp;[3 MDN的 CSS基本语法;](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Introduction_to_CSS/Syntax)
&emsp;&emsp;[4 精通CSS;](https://book.douban.com/subject/4736167/)