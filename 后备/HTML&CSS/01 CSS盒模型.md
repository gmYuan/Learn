# CSS盒模型

目录

1 [预读文档](#1)

2 [什么是 盒模型](#2)

 

## <span id="1"> 1 预读文档 </span>

01 [MDN— 盒模型介绍](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)

阅读原因: 介绍了盒模型的含义

02 [CSS盒模型详解](https://juejin.im/post/59ef72f5f265da4320026f76)

阅读原因: 盒模型类型的说明很具体


## <span id="2"> 2 什么是 盒模型 </span>

1 Q: 什么是 盒模型

A: 

S1 CSS在把html元素渲染到页面时，会把它们表示成一个个矩形盒子

S2 每个盒子由 Content + padding + border + margin 4个部分组成


S3 盒模型分为 Content-box(标准盒模型) 和 border-box(以前的 IE盒模型) 2类

S3.1 标准盒模型中:      设置的width值 = 内容区Content 宽度值

S3.2 而IE盒模型中:      设置的width值 = 内容区 + padding + border

S3.3 所以，相同的width值，标准盒模型的 实际所占区域 > IE盒模型的 实际所占区域


S4 我们可以使用 CSS3中box-sizing属性 来设置 元素盒模型的类型

