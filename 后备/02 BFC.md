# BFC

目录

1 [预读文档](#1)

2 [什么是BFC](#2)

3 [BFC有哪些用法](#3)


## <span id="1"> 1 预读文档 </span>

阅读文档

1 [史上最全面、最透彻的BFC原理剖析](https://juejin.im/entry/59c3713a518825396f4f6969)

阅读原因: 介绍BFC的相关规则和应用


## <span id="2"> 2 什么是BFC </span>

1 Q: 什么是BFC

A: 

S1 BFC,全称为 块级格式化上下文，触发BFC后，就会在页面中形成一块 独立的渲染区域

S2 BFC 定义了内部 块级元素的定位规则，以及和其他元素的位置关系


2 Q: 如何触发生成 BFC

S1 html根元素

S2 非static定位的元素:  浮动/ 绝对定位 / 固定定位的 元素

S3 overfolw 不为visible的 元素

S4 display: table-cell/ inline-block/ flex的 元素


## <span id="3"> 3 BFC有哪些用法 </span>

1 Q: BFC定义了哪些规则

A: 可以通过html根标签来理解BFC的规则

S1 BFC内部 块级box会垂直排列

S2 同一个BFC里的 两个相邻块级Box 会发生外边距合并   (阻止外边距合并)

S3 BFC的区域 不会和float box 重叠                              (自适应两栏布局)

S4 计算BFC的高度时，内部浮动子元素也参与计算           (清除浮动)

S5 BFC是一个独立容器，内部子元素 不会影响到外面元素


2 Q: BFC有哪些应用/实际作用

S1  阻止外边距合并

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

S2.2 由规则4可知，计算BFC的高度时，浮动子元素也参与计算，所以BFC可以包裹住浮动元素

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

S3 自适应两栏布局 (float + BFC)