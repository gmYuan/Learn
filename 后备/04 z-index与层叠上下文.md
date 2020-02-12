# 层叠上下文


目录

1 [预读文档](#1)

2 [层叠上下文](#2)

3 [层叠等级 与 层叠顺序](#3)

4 [代码举例](#4)



## <span id="1"> 1 预读文档</span>

1 阅读文档有:

01 [CSS中重要的层叠概念](https://juejin.im/post/5ba4efe36fb9a05cf52ac192)

阅读原因: 非常详细，首选参考

02 [彻底搞懂CSS层叠上下文、层叠等级、层叠顺序、z-index](https://juejin.im/post/5b876f86518825431079ddd6#heading-5)

阅读原因: 内容基本同上，可读的是其中的代码实例


## <span id="2"> 2 层叠上下文 </span>

1 Q: 什么是层叠上下文

A:

S1 元素在Z轴上的形成的一个区间，类似于PS中图层的概念

S2 层叠上下文会让其内部元素在Z轴上的等级提升，从而覆盖其他元素


2 Q: 如何触发形成层叠上下文

A:
 
S1 根元素 `<html>标签`

S2 position值为非static的元素 + z-index不为auto

S3 父元素为 flex布局 + 子元素z-index不为auto

S4 transform值不为none的元素

S5 filter值不为none的元素

S6 opacity值小于 1 的元素

S7 其他一些CSS3属性，具体见参考文档1


## <span id="3"> 3 层叠等级 与 层叠顺序 </span>

1 Q: 什么是层叠等级

A:

S1 层叠等级规定了 同一层叠上下文中 元素在Z轴上的先后顺序，是一个概念

S2 具体的规则，是由层叠顺序 规定的:

层叠上下文元素的 背景和边框 < 负z-index值的定位子元素 < 块级元素 < 浮动元素

< 内联元素 < z-index为0/auto的定位元素 < z-index值大于0的定位元素

借用参考文档2的图来直观理解一下: [层叠顺序](https://user-gold-cdn.xitu.io/2018/8/30/1658910c5cb364b6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


2 Q: 所以在z轴上的覆盖规则到底是什么

A:

S1 首先看 要比较的两个元素是否处于同一个层叠上下文中
      
  S1.1 如果是，比较层叠顺序的 优先级

  S1.2 如果不是，则依次比较他们 `所属层叠上下文的` 层叠等级、层叠顺序

  S2 当 `所属的层叠上下文的` 层叠等级相同、层叠顺序都相同时，DOM结构后面的元素在前面元素上面


## <span id="4"> 4 代码举例 </span>

``` html
<style>
  .box1, .box2 {
    position: relative;
    z-index: 0;    
  }
  .child1 {
    width: 200px;
    height: 100px;
    background: #168bf5;

    position: absolute;
    z-index: 2;
  }
  .child2 {
    width: 100px;
    height: 200px;
    background: #32c292;
    
    position: absolute;
    z-index: 1;
  }
</style>
</head>

<body>
  <div class="box1">
    <div class="child1"></div>
  </div>

  <div class="box2">
    <div class="child2"></div>
  </div>
</body>
```

结果为: [示意图](https://user-gold-cdn.xitu.io/2018/8/30/165890f4aabe3939?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

分析步骤如下:

S1 box1 和 box2 各自生成了层叠上下文(不在同一个层叠上下文中)，

S2 比较`所属层叠上下文的` 层叠等级: z-index都为0, 层叠等级相同

S3 比较`所属层叠上下文的` 层叠顺序: 都位于html层叠上下文的第6层

S4 比较DOM结构的先后顺序: box2覆盖box1

S5 所以尽管child1的层叠等级 > child2的层叠等级，但仍然会被child2覆盖