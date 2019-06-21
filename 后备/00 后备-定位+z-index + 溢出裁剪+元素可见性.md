## 三 定位

1 基本概念
S1 position:static    元素框正常生成
S2 position:relative  元素框偏移某个距离 + 元素仍保持其未定位前的形状 + 它原本所占的空间仍保留
S3 position:absolute  元素框从文档流完全删除，并相对于其包含块定位 + 元素定位后生成一个块级框
S4 position:fixed     类似于绝对定位，不过其包含块是视窗本身

S5 包含块(定位上下文)
  (1) “根元素”(html元素)的初始包含块 由用户代理建立(一般是整个视窗)
  (2) 非根元素 + position值是static/relative, 包含块是
      最近的 + 块级框/表单元格/行内块  + 祖先框的 content范围

 （3) 非根元素 +  position值是absolute, 包含块则是  position值不是static + 祖先元素
      如果这个祖先是块级元素，包含块则设置为该元素的border范围
      如果这个祖先是行内元素，包含块则设置为该祖先元素的内容边界
      如果没有祖先，包含块定义为初始包含块

  (4) 元素可以定位到其包含块的外面


2 偏移属性
S1 百分比: top/bottom相对于包含块的髙度 + left/right相对于包含块的宽度

S2 这些属性描述了 距离包含块最近边的偏移(定位元素的外边距边——包含块的边界边)

S3 定位元素的高度和宽度可以由偏移属性 隐式确定，如:
```css
xxx{ top： 0; bottom： 0； left: 0; right: 50%;}  //相当于width:50% + height: 100%
```
注意: 如果向元素增加了边距/边框 + 显式指定height/width, 可能会使 `定位元素超出其包含块`


3 绝对定位
S0 定位同样具有 包裹性+父元素高度坍塌+生成块级框 的特点

S1 元素绝对定位时，会从文档流中完全删除 + 相对于其包含块定位
    绝对定位元素的包含块是  最近的 + position值不为static的 + 祖先元素
    所以可以使用`position: relative`来指定包含块

S2 元素绝对定位时，还会为其后代元素建立一个包含块(因为值不是relative)

S3 绝对定位元素无法通过偏移量负值，超出其包含块外部 + 一般是透明背景(所以需要设置背景色)

S4 偏移属性+width/height
  (0) 遵循的根本原则是: left+width+right+ padding + border + margin = 包含块width

  (1) 非显式width/height + 显式偏移属性: 会由偏移属性隐式形成宽高(通过 `left边~~righ边`得出)
  
  (2）显式设置width/height + 非替换元素情况
      left/right/width都为auto: 
        左边为static时的位置 + width刚好为内容区大小 + right等于余下空间 = 包含块的width

      left/right/width都不为auto + 左右外边距都设置为auto:
        绝对定位元素会水平居中
        `如果只有一个外边距为auto+过度受限时，会重置该外边距值`

      left/right/width都不为auto + 左右外边距也不为auto:
        过度受限情况下，会忽略并重置right的值

      height/top/bottom的规则与 水平方向类似

  (3）显式设置width/height + 替换元素情况
      width为auto：实际使用值由元素内容的 固有宽度决定；
      left为auto:  把 auto 替换为 静态static位置；
      如果left/right仍为auto： 则将 margin-left或margin-right的 auto值替换为0；
      如果此时 margin-left和margin-right都还定义为auto: 则设置为相等，从而元素在其包含块居中；
      在此之后，如果只剩下一个 auto： 则将其修改为等于等式的余下部分（使等式满足)


4 固定定位
S1 固定定位与绝对定位很类似，只不过固定元尜的包含块是视窗
   固定定位时，元素会完全从文档流中去除

S2 其特点是可以创建固定显示的元素(不论页面滚动到何处)


5 相对定位
S1 相对定位一个元素，它会为其所有子元素建立一个新的包含块
   这个包含块对应于该元素 原本所在的位置

S2 当元素相对定位时，它会从其正常位置移走，但其 原来所占的空间还会保留(显示为空白)

S3 相对定位元素可以覆盖其他内容

S4 如果遇到过度受限的相对定位(比如top:10px, bottom:20px)，此时一个值会重置为另一个值的相反数


## 四 z-index相关

1 基本含义
  S1 利用z-index，可以改变元素相互覆盖的顺序
     当position值 非static时, Z-index才生效

S2 z-index的值为整数(包括负数)，值大的元素在z轴上覆盖值小的元素

2 单个z-index内的父子关系
  S1 如果父元素z-index有效，那么子元素无论z-index值是什么，会在父元素上方

  S2 如果父元素z-index失效，那么定位子元素 的z-index设置生效

3 多个z-index间的关系
  S1 两个元素都没有设置z-index:
    一个定位一个没有定位，那么定位元素覆盖未定位元素

  S2 子元素和外界元素进行比较时,采用父元素的Z-index进行比较
     和兄弟元素比较采用自身的Z-index;

  S3 当Z-index为auto时,如果它和它的兄弟进行比较,采用它父元素的Z-index


4 初始堆叠上下文
  z-index:auto, 则不建立层叠上下文
  z-index:0，则会脱离文档流,建立层叠上下文


## 五 其他

1 min-width等最大最小 宽度/高度
S1 应用条件: 除 非替换行内元素+表元素以外的  所有元素
S2 取值：    百分比—— 相对于包含块的宽度/高度
S3 优点:  可以相对安全地混合使用不同的单位


2 内容溢出和剪裁
S1 当内容超出了显式设定的元素框宽高时，就会发生溢出

S2 可以使用overflow属性 控制`溢出内容的显示效果`

S3 可以使用属性clip 改变剪裁区域的形状，它只是改变 显示内容的区域形状(了解即可)
  (1) 语法是  `clip： rect (top,right,bottom,left)/auto/inherit`
  (2) rect(...)的值是 距元素左上角的距离


3 元素可见性
S1 关于visibility的取值，可参考MDN

S2 元素视觉效果不可见的方法
  (1) visibility:hidden        会影响文档布局 + 不会响应交互事件 + 在读屏软件中会被隐藏
  (2) opacity:0                会影响文档布局 + 会响应交互事件 + 内容会被读屏软件阅读
  (3) text-indent:-999em       会影响文档布局 + 会响应交互事件 + 内容会被读屏软件阅读

  (4）position:abs+负数         不会影响文档布局 + 会响应交互事件 + 内容会被读屏软件阅读
  (5) Clip-path                了解即可，略过
  (6) `transform: scale(0,0)`  会影响文档布局 + 不会响应交互事件
  (7) dispaly:none 元素会从文档中彻底删除，效果类似于元素完全不存在


## 六 实践注意点

1 绝对定位 

S1 父元素高度是  %时，子元素绝对定位属性top/bottom的百分比会失效。
   解决方法是父元素height/子元素top设置px固定值

S2 绝对定位可以和flex在同一元素上使用



## 七 参考文档

[01 CSS权威指南第10章](https://book.douban.com/subject/2308234/)

[02 奇舞团——用CSS隐藏页面元素的5种方法](https://75team.com/post/five-ways-to-hide-elements-in-css.html)
[02 css中元素不可见的几种办法](http://www.html-js.com/article/2173)

[03 MDN-浮动](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Floats)
[03 CSS深入理解之float浮动](https://segmentfault.com/a/1190000014554601)

[04 CSS深入理解之absolute定位](https://segmentfault.com/a/1190000014736711)
[04 CSS深入理解之relative定位](https://juejin.im/post/5afb7fc7518825426d2d4aff)

[05 搞懂Z-index的所有细节](https://zhuanlan.zhihu.com/p/26866325)