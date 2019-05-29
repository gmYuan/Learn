# BFC

目录

1 [预读文档](#1)

2 [什么是BFC](#2)

3 [BFC有哪些用法](#3)


## <span id="1"> 1 预读文档 </span>

阅读文档

1 [史上最全面、最透彻的BFC原理剖析](https://github.com/zuopf769/notebook/blob/master/fe/BFC%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90/README.md)

阅读原因: 介绍BFC的相关规则和应用

2 [学习 BFC](https://juejin.im/post/59b73d5bf265da064618731d#comment)

阅读原因: 介绍的非常详细，代码较多


## <span id="2"> 2 什么是BFC </span>

1 Q: 什么是BFC

A: 

S1 BFC,全称为 块级格式化上下文，是页面中一块 独立的渲染区域

S2 它 定义了内部元素的定位规则，以及和其他元素的位置关系


2 Q: 如何触发元素形成BFC

S1 根元素

S2 浮动元素

S3 绝对定位 / 固定定位的 元素

S4 overfolw不为visible的元素

S5 `display:table的表格元素 / display: inline-block的行内块元素 / flex布局的元素`


## <span id="3"> 3 BFC有哪些用法 </span>

1 Q: BFC定义了哪些规则

A: 可以通过html根标签来理解BFC的规则

S1 同一个BFC里的 两个相邻Box 会垂直排列

S2 同一个BFC里的 两个相邻Box 会发生外边距合并

S3 BFC中子元素的 margin box的左边， 与包含块 (BFC) border box的左边相接触(子元素 absolute 除外)


S4 BFC的区域 不会与float的元素区域 重叠

S5 计算BFC的高度时，浮动子元素也参与计算

S6 文字层会 环绕在浮动元素周围


2 Q: BFC有哪些应用/实际作用

S1 可以 阻止外边距合并

S1.2 由规则2可知，同一BFC内的box会发生外边距合并，所以只要让元素不属于同一个BFC，就不会发生合并了

S1.3 代码见下:

```html
<style>
  p {
    margin: 100px;
    width: 100px;
    line-height: 100px;
    text-align:center;
    background: #ddd;       
  }
  .wrap {
    overflow: hidden; 
  }
</style>

<body>
    <p class="wrap">par1</p>
    <p>par2</p>
</body>

```

S2 可以清除内部浮动

S2.2 由规则5可知，计算BFC的高度时，浮动子元素也参与计算，所以BFC可以包裹住浮动元素

S2.3 代码见下:

```html

<style>
  .par {
    border: 5px solid #fcc;
    width: 300px;
    overflow: hidden;
  }
  .child {
    border: 5px solid #f66;
    width:100px;
    height: 100px;
    float: left;
  }
</style>

<body>
  <div class="par">
    <div class="child"></div>
    <div class="child"></div>
  </div>
</body>

```