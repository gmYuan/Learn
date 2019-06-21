# 盒模型 + 包含块 + Width属性

## 一 前言

本文主要介绍 正常流下 +  Width属性的相关注意点(脱离文档流的情况以后再单独说)

## 二  盒模型 + 包含块

1 盒模型

S1 浏览器渲染引擎会根据盒模型，将 每个元素表示为一个矩形盒子
  这个模型(盒模型)描述了元素所占空间的内容

S2 盒模型由以下部分组成:
  内容区 + padding + border + margin

S3 盒模型分为 W3C标准盒模型 / IE盒模型
  (1)W3C标准盒模型：  width/height = 内容content
  (2)IE盒模型：      width/height = content+padding+border

S4 使用哪个盒模型可以由 box-sizing控制

S5 在页面中声明了DOCTYPE类型，所有的浏览器就都会把 盒模型解释为W3C盒模型

需要注意的是：
  (1) width/height 决定了 内容区的宽高范围
  (2) 元素的高度默认 由内容高度决定，设置百分比长度是无效的 + px/em是有效的
  (3) 边界（border）也会忽略 百分比宽度设置

  (4) background 默认作用范围是 content~~border(不包括border);
  改变方法是使用 `background-clip`属性

  (5)	color 默认作用范围是 content~~border(包括border)


2 元素框类型

S1 块框（block box）
  其内容会独占一行 + 可以设置宽高

S2 行内框（inline box）
  和其他行内元素出现在同一行 + 对行内盒设置宽高无效
  设置padding/margin/border 会更新周围文字的位置，但对于周围的的块框（block box）无影响

S3 行内块状框（inline-block box）
  不会重新另起一行 + 会像行内框（inline box）随周围文字流动；
  能够设置宽高 + 像块框一样不会在段落行中断开

3 包含块含义
> 正常流中，元素的包含块是  其最近的 + 块级祖先框/行内块祖先框/表单元格
它是一个块级元素的 “布局上下文”


## 三 width属性

1 含义
S1 width和heigth定义的是元素框里 内容区content的范围;
S2 一般只有效于 块级元素+行内替换元素 (当然这句话其实是不够准确的，这里只是为了简化记忆)

准确的适用范围表述是:
> all elements but non-replaced inline elements, table rows, and row groups

2 常见取值

S1 length: px/em,其中 em是相对该元素的font-size(字体大小)

S2 百分比: 指定该元素宽度为 包含块宽度的百分比

S3 auto: 也是默认值，具体情况见下文


3 块级元素水平方向基本原理 和 auto情况讨论

S1 水平方向基本原理
在讨论auto情况之前，必须先明确盒模型水平方向的基本原理，这是理解auto的前提

水平方向的基本原理是:
&emsp;&emsp;正常流中,块级元素框的水平部分总和(padding+width+margin) = 其父元素的内容区width
简单来说，就是 子元素的盒模型总宽度必须等于 其父元素的内容区宽度

根据上一点，所以最好遵循 张鑫旭提的 "宽度分离原则" (即width 和 padding/border/margin分离)
所谓宽度分离，是指
>width属性不与 影响宽度的padding/border/margin属性 共存

翻译成大白话，可以简单理解为，`只在父元素上写死width，子元素利用 auto的自适应性`

具体见 [CSS流体(自适应)布局下宽度分离原则](http://www.zhangxinxu.com/wordpress/2011/02/css%E6%B5%81%E4%BD%93%E8%87%AA%E9%80%82%E5%BA%94%E5%B8%83%E5%B1%80%E4%B8%8B%E5%AE%BD%E5%BA%A6%E5%88%86%E7%A6%BB%E5%8E%9F%E5%88%99/)

S2 auto情况讨论

理解并牢记上面的原理，接下来就可以讨论auto的情况了

(1) 块级元素水平方向 只有width和 margin-left/margin-right 可以取auto;

(2) 3个属性都固定值，且小于父元素width:
      浏览器会强制重置 margin-right:auto, 计算出合适值，从而满足 基本原理;

(3) 1个属性为auto+剩余2个是固定值:
      浏览器自动凑齐那个auto属性的数值， 从而满足原理;

(4) 2个属性值为auto+剩余1个是固定值:
      width固定 + 2个外边距为auto:                     auto会相等，从而让该元素在父元素内 水平居中
      width为auto + 1个外边距为auto + 1个外边距为固定:   设置auto的那个外边距变为0 ，width设为余下所需值

(5) 3个属性值都是auto:
      也是浏览器开始的默认情况，外边距:auto均变为0，width:auto填满父元素

(6) 负外边距+auto:
      width:auto + margin-left:-50px时: 会导致子元素的width > 父元素width;

      width:500px(超过父元素width时)时:
        不论有没有显式设置margin-right，浏览器都会重置为 margin-right:auto,而且此时 margin-right会取负值，以满足基本原理

4 行内替换元素

S1 以上原则都适用于 替换元素;
S2 不同的是，当替换块级元素的 width:auto时，元素的宽度就是替换内容的固有宽度
S3 当改变宽/高其中一项时，另一项会自动成比例变化;
S4 可以显式设置宽高值，以覆盖其原始的固有宽度


5 行内非替换元素的水平方向
	S1 宽度取决于它本身内部文字的多少，设置width是无效的(当然，设置 左右margin/padding/border有效)


## 四 参考文档

[01 MDN-盒模型;](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Styling_boxes/Box_model_recap);

[01 CSS盒模型详解;](https://juejin.im/post/59ef72f5f265da4320026f76)
[01 MDN-盒子模型;](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)

[02 CSS权威指南;](https://book.douban.com/subject/2308234/)
[02 MDN的Width属性;](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width)
[02 页面重构之“无宽度”准则;](http://www.zhangxinxu.com/wordpress/2010/10/%E9%A1%B5%E9%9D%A2%E9%87%8D%E6%9E%84%E2%80%9C%E9%91%AB%E4%B8%89%E6%97%A0%E5%87%86%E5%88%99%E2%80%9D-%E4%B9%8B%E2%80%9C%E6%97%A0%E5%AE%BD%E5%BA%A6%E2%80%9D%E5%87%86%E5%88%99/)